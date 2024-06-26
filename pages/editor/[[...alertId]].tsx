import { t, Trans } from "@lingui/macro";
import { AlertStatus } from "../../generated/client";
import { GetServerSideProps } from "next";
import { getServerSession, Session } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Message } from "rsuite";
import EditorSinglePage, {
  FormAlertData,
} from "../../components/editor/EditorSinglePage";
import prisma from "../../lib/prisma";

import AlertingAuthoritySelector from "../../components/AlertingAuthoritySelector";
import ErrorMessage from "../../components/ErrorMessage";
import { ERRORS } from "../../lib/errors";
import {
  formatDate,
  getStartOfToday,
  HandledError,
  useMountEffect,
} from "../../lib/helpers.client";
import { CAPV12JSONSchema } from "../../lib/types/cap.schema";
import { UserAlertingAuthority } from "../../lib/types/types";
import { useAlertingAuthorityLocalStorage } from "../../lib/useLocalStorageState";
import { useToasterI18n } from "../../lib/useToasterI18n";
import { authOptions } from "../api/auth/[...nextauth]";
import { MULTI_LANGUAGE_GROUP_ID_CAP_PARAMETER_NAME } from "../../lib/constants";
import { DateTime } from "luxon";
import timezones from "timezones.json";
import { useLingui } from "@lingui/react";

// Must serialise Dates between server and client
type FormAlertDataSerialised = FormAlertData & {
  onset: string;
  expires: string;
};

type Props =
  | {
      invalidAlertingAuthority: true;
    }
  | {
      invalidAlertingAuthority: false;
      defaultAlertData: FormAlertDataSerialised;
      editingAlert: { id: string; status: AlertStatus } | null;
      alertingAuthority: UserAlertingAuthority;
      isShared: boolean;
      session: Session;
      multiLanguageGroupId: string | null;
    };

const redirect = (url: string) => ({
  redirect: { destination: url, permanent: false },
});

/**
 * There can be 3 cases:
 * - /editor?alertingAuthorityId=aa-id: create a new alert
 * - /editor?template=alert-id&alertingAuthorityId=aa-id: create a new alert, using the given alert as a template
 * - /editor/alert-id: edit the given alert
 *
 * When editing, the user must have edit permission for the AA of that alert, or the alert must have been shared with them.
 * When creating, we must know which AA the user wants to create the alert on, and they must have permission for this AA.
 */
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return redirect("/login");

  const userAlertingAuthorityIds = Object.keys(
    session.user.alertingAuthorities
  );

  // First, check if user wants to edit an alert through /editor/ID
  let { alertId, alertingAuthorityId, template } = context.query;
  const isNewLanguageDraft = context.query.isNewLanguageDraft === "1";
  let isTemplate = false;
  let isNewAlert = true;

  if (alertId) {
    // Check if user wants to edit existing alert through /editor/:ID
    // Next.js returns optional catch-all route params as array of each nested route
    alertId = alertId[0];
    isNewAlert = false;
  } else if (typeof template === "string") {
    // Check if user wants to use an existing alert as a template through /editor?template=ID
    alertId = template;
    isTemplate = true;
  }

  // If we're making a new alert, but don't know for which AA,
  //  and the user only has one AA, then default to that.
  // Otherwise, ask them to choose which AA first
  if (
    isNewAlert &&
    typeof alertingAuthorityId !== "string" &&
    userAlertingAuthorityIds.length === 1
  ) {
    alertingAuthorityId = userAlertingAuthorityIds[0];
  }

  let alert;
  let editingAlert;
  let multiLanguageGroupId;
  if (alertId) {
    alert = await prisma.alert.findFirst({
      where: { id: alertId },
      include: {
        SharedAlerts: {
          include: { User: { select: { email: true } } },
          where: { expires: { gt: new Date() } },
        },
        AlertingAuthority: true,
      },
    });

    if (!alert) return redirect(`/error/${ERRORS.ALERT_NOT_FOUND.slug}`);

    if (!isTemplate) {
      // Nobody is allowed to edit an already-published alert
      if (alert.status === "PUBLISHED") {
        return redirect(`/error/${ERRORS.EDIT_PUBLISHED_ALERT.slug}`);
      }

      editingAlert = { id: alert.id, status: alert.status };
    }

    if (isNewLanguageDraft) {
      multiLanguageGroupId = (
        alert.data as CAPV12JSONSchema
      ).info?.[0]?.parameter?.find(
        (p) => p.valueName === MULTI_LANGUAGE_GROUP_ID_CAP_PARAMETER_NAME
      )?.value;
    }

    alertingAuthorityId = alert.alertingAuthorityId;
  }

  if (typeof alertingAuthorityId !== "string") {
    return { props: { invalidAlertingAuthority: true } };
  }

  let alertingAuthority = session.user.alertingAuthorities[
    alertingAuthorityId
  ] as UserAlertingAuthority;

  let isShared = false;
  if (!isNewAlert && alert) {
    // The user must be part of this AA to edit it, or this alert must be shared with them
    isShared = !!alert.SharedAlerts.find(
      (s) => s.User.email === session.user.email
    );

    if (isShared) alertingAuthority = { ...alert.AlertingAuthority, roles: [] };
  }

  if (!alertingAuthority) {
    return redirect(`/error/${ERRORS.AA_NOT_ALLOWED.slug}`);
  }

  let defaultAlertData: FormAlertDataSerialised;
  if (alert) {
    // Convert DB Alert data to FormAlertData for Editor
    const alertData = alert.data as CAPV12JSONSchema;
    const info = alertData.info?.[0];

    let timezone = "Etc/GMT";
    if (info?.expires) {
      const timezoneOffset = DateTime.fromISO(info.expires, {
        setZone: true,
      }).toFormat("ZZ");

      const timezoneIANA = timezones
        .find((t) => t.text.startsWith(`(UTC${timezoneOffset})`))
        ?.utc.at(-1);

      if (timezoneIANA) timezone = timezoneIANA;
    }

    defaultAlertData = {
      ...(!isTemplate && { identifier: alertData.identifier }),
      category: info?.category ?? [],
      regions:
        info?.area?.reduce((acc, area) => {
          acc[area.areaDesc] = {
            circles: area.circle ?? [],
            polygons: area.polygon ?? [],
            geocodes:
              area.geocode?.reduce((acc, cur) => {
                acc[cur.valueName] = cur.value;
                return acc;
              }, {} as { [key: string]: string }) ?? {},
          };
          return acc;
        }, {} as { [key: string]: any }) ?? {},
      onset: (info?.onset
        ? new Date(info?.onset)
        : getStartOfToday()
      ).toString(),
      expires: (info?.expires
        ? new Date(info?.expires)
        : new Date()
      ).toString(),
      timezone,
      responseType: info?.responseType ?? [],
      certainty: info?.certainty ?? "",
      severity: info?.severity ?? "",
      urgency: info?.urgency ?? "",
      status: alertData.status,
      msgType: alertData.msgType,
      contact: info?.contact ?? "",
      web: info?.web ?? "",
      references: alertData.references?.split(" ") ?? [],
      language: info?.language ?? "",
      event: info?.event ?? "",
      headline: info?.headline ?? "",
      description: info?.description ?? "",
      instruction: info?.instruction ?? "",
      resources:
        info?.resource?.map((r) => ({
          mimeType: r.mimeType,
          resourceDesc: r.resourceDesc,
          uri: r.uri!,
        })) ?? [],
    };
  } else {
    defaultAlertData = {
      category: [],
      regions: {},
      onset: getStartOfToday().toString(),
      expires: new Date().toString(),
      responseType: [],
      certainty: "",
      severity: "",
      urgency: "",
      status: "",
      msgType: "",
      contact: "",
      web: "",
      references: [],
      language: "eng",
      event: "",
      headline: "",
      description: "",
      instruction: "",
      resources: [],
    };
  }

  return {
    props: {
      invalidAlertingAuthority: false,
      defaultAlertData: defaultAlertData,
      editingAlert: editingAlert ?? null,
      alertingAuthority,
      session,
      isShared,
      multiLanguageGroupId: multiLanguageGroupId ?? null,
    },
  };
};

export default function EditorPage(props: Props) {
  useLingui();

  const toaster = useToasterI18n();
  const router = useRouter();
  const { data: session } = useSession();
  const [alertingAuthorityId] = useAlertingAuthorityLocalStorage();

  // If query params exists, hide it from user
  useMountEffect(() => {
    if (Object.keys(router.query).length) {
      router.replace("/editor", undefined, { shallow: true });
    }
  });

  if (!session) {
    return (
      <>
        <Head>
          <title>CAP Editor - Edit</title>
        </Head>
        <main>
          <Message type="info" header="Login">
            <Trans>Please login</Trans>.
          </Message>
        </main>
      </>
    );
  }

  if (props.invalidAlertingAuthority) {
    return (
      <>
        <Head>
          <title>CAP Editor - Edit</title>
        </Head>
        <main>
          <Message type="info" header="Choose Alerting Authority">
            <Trans>
              Please choose which Alerting Authority you wish to create an alert
              for:
            </Trans>
            <br />
            <AlertingAuthoritySelector
              alertingAuthorities={session!.user.alertingAuthorities}
              appendToQuery
              fullWidth
            />
          </Message>
        </main>
      </>
    );
  }

  // Dates were serialised on server; convert back to Date now
  const defaultAlertData: FormAlertData = {
    timezone:
      session!.user.alertingAuthorities[alertingAuthorityId].defaultTimezone,
    ...props.defaultAlertData!,
    onset: new Date(props.defaultAlertData!.onset),
    expires: new Date(props.defaultAlertData!.expires),
  };

  return (
    <>
      <Head>
        <title>CAP Editor - Edit</title>
      </Head>
      <main>
        <EditorSinglePage
          key={
            props.editingAlert
              ? `editor-${props.editingAlert.id}`
              : `editor-${new Date().getTime()}`
          }
          alertingAuthority={props.alertingAuthority!}
          roles={props.isShared ? ["COMPOSER"] : props.alertingAuthority!.roles}
          defaultAlertData={defaultAlertData}
          {...(props.editingAlert && {
            existingAlertStatus: props.editingAlert.status,
          })}
          {...(typeof props.multiLanguageGroupId === "string" && {
            multiLanguageGroupId: props.multiLanguageGroupId,
          })}
          isShareable={!props.isShared}
          onShareAlert={async (email) => {
            if (!props.editingAlert!.id) return;

            fetch(`/api/alerts/${props.editingAlert!.id}/share`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.error) throw new HandledError(res.message);
                toaster.push(
                  <Message type="success" showIcon closable>
                    <Trans>
                      An invitation email to collaborate on this Alert has been
                      sent.
                    </Trans>
                  </Message>,
                  { duration: 3000 }
                );
              })
              .catch((err) =>
                toaster.push(
                  <ErrorMessage error={err} action={t`sharing the alert`} />,
                  { placement: "bottomCenter" }
                )
              );
          }}
          onSubmit={async (
            alertData: FormAlertData,
            alertStatus: AlertStatus
          ) => {
            fetch(
              props.editingAlert
                ? `/api/alerts/${props.editingAlert.id}`
                : `/api/alerts/alertingAuthorities/${alertingAuthorityId}`,
              {
                method: props.editingAlert ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                  {
                    status: alertStatus,
                    data: alertData,
                    multiLanguageGroupId: props.multiLanguageGroupId,
                  },
                  function (k, v) {
                    return this[k] instanceof Date
                      ? formatDate(this[k], alertData.timezone)
                      : v;
                  }
                ),
              }
            )
              .then((res) => res.json())
              .then((res) => {
                if (res.error) throw new HandledError(res.message);
                toaster.push(
                  <Message type="success" showIcon closable>
                    <Trans>Alert successfully submitted.</Trans>
                  </Message>,
                  { placement: "bottomCenter", duration: 3000 }
                );
                router.push("/");
              })
              .catch((err) =>
                toaster.push(
                  <ErrorMessage error={err} action={t`submitting the alert`} />,
                  { placement: "bottomCenter" }
                )
              );
          }}
          onCancel={() => router.push("/")}
        />
      </main>
    </>
  );
}
