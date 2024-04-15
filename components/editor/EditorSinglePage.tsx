import { t, Trans } from "@lingui/macro";
import { AlertStatus, Role } from "../../generated/client";
import { ShareOutline } from "@rsuite/icons";
import "ol/ol.css";
import { useState } from "react";
import { Button, Divider, Form, Stack } from "rsuite";

import { classes, updateState } from "../../lib/helpers.client";
import { Resource, UserAlertingAuthority } from "../../lib/types/types";
import styles from "../../styles/components/editor/EditorSinglePage.module.css";
import {
  Category,
  Certainty,
  Contact,
  Description,
  Event,
  Expires,
  Headline,
  Instruction,
  Language,
  MapForm,
  MessageType,
  Onset,
  References,
  Resources,
  ResponseType,
  Severity,
  Status,
  Timezone,
  Urgency,
  Web,
} from "./fields";
import SeverityCertaintyMatrix from "./SeverityCertaintyMatrix";
import XMLPreview from "./XMLPreview";
import { useLingui } from "@lingui/react";

const STEPS = ["metadata", "category", "map", "data", "text", "summary"];
export type Step = (typeof STEPS)[number];

export type FormAlertData = {
  // Only present if an Alert is being edited (instead of created)
  identifier?: string;
  category: string[];
  regions: {
    [key: string]: {
      polygons: number[][];
      circles: string[];
      geocodes: {
        [key: string]: string;
      };
    };
  };
  timezone?: string;
  onset: Date | string;
  expires: Date | string;
  responseType: string[];
  certainty: string;
  severity: string;
  urgency: string;
  status: string;
  msgType: string;
  references: string[];
  language: string;
  web?: string;
  contact?: string;
  event: string;
  headline: string;
  description: string;
  instruction: string;
  resources: Resource[];
};

export type StepProps = {
  onUpdate: (data: Partial<FormAlertData>) => void;
};

type Props = {
  onSubmit: (alertData: FormAlertData, alertStatus: AlertStatus) => void;
  onCancel: () => void;
  onShareAlert: (email: string) => void;
  isShareable: boolean;
  defaultAlertData: FormAlertData;
  alertingAuthority: UserAlertingAuthority;
  roles: Role[];
  existingAlertStatus?: AlertStatus;
  multiLanguageGroupId?: string;
};

export default function EditorSinglePage(props: Props) {
  useLingui();
  const [alertData, setAlertData] = useState(props.defaultAlertData);
  const isNewLanguageDraft = !!props.multiLanguageGroupId;
  const onUpdate = (data: Partial<FormAlertData>) =>
    updateState(setAlertData, data);

  const renderActionButtons = () => (
    <div className={styles.actions}>
      <Button
        appearance="ghost"
        color="red"
        onClick={() => {
          if (
            window.confirm(
              t`Are you sure you want to cancel editing this alert?`
            )
          ) {
            props.onCancel();
          }
        }}
      >
        <Trans>Cancel</Trans>
      </Button>
      <Button
        appearance="primary"
        color="blue"
        onClick={() => props.onSubmit(alertData, "DRAFT")}
      >
        {alertData.identifier ? (
          <Trans>Update draft</Trans>
        ) : (
          <Trans>Save draft</Trans>
        )}
      </Button>
      {(props.roles.includes("APPROVER") || props.roles.includes("ADMIN")) && (
        <Button
          appearance="primary"
          color="red"
          onClick={() => {
            if (
              window.confirm(
                t`Are you sure you want to publish this alert immediately?`
              )
            ) {
              props.onSubmit(alertData, "PUBLISHED");
            }
          }}
        >
          <Trans>Publish</Trans>
        </Button>
      )}
    </div>
  );

  return (
    <div className={classes(styles.newAlert)}>
      <div className={classes(styles.header)}>
        <h2>
          CAP Alert Composer
          {alertData.identifier && <i> (editing)</i>}
          {props.existingAlertStatus === "DRAFT" && props.isShareable && (
            <span
              title={t`Collaborate on this alert with someone`}
              className={styles.shareIcon}
              onClick={() => {
                const email = window.prompt(
                  t`Please enter the email address of the user you wish to invite to collaborate`
                );
                if (!email) return;

                props.onShareAlert(email);
              }}
            >
              <ShareOutline />
            </span>
          )}
        </h2>
        {renderActionButtons()}
      </div>

      <Form fluid className={styles.editorContainer}>
        <div className={styles.left}>
          <Headline onUpdate={onUpdate} alertData={alertData} />
          <Event onUpdate={onUpdate} alertData={alertData} />
          <Description onUpdate={onUpdate} alertData={alertData} />
          <Instruction
            onUpdate={onUpdate}
            alertData={alertData}
            alertingAuthority={props.alertingAuthority}
          />

          <Divider />

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            <Status
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
            <MessageType
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />

            <Category
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
            <ResponseType
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
          </Stack>

          {["Update", "Cancel"].includes(alertData.msgType) && (
            <References
              onUpdate={onUpdate}
              alertData={alertData}
              alertingAuthorityId={props.alertingAuthority.id}
            />
          )}

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            {props.alertingAuthority.severityCertaintyMatrixEnabled && (
              <SeverityCertaintyMatrix
                certainty={alertData.certainty}
                severity={alertData.severity}
                onChange={onUpdate}
                disabled={isNewLanguageDraft}
              />
            )}
            <Severity
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
            <Certainty
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
            <Urgency
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            <Timezone onUpdate={onUpdate} alertData={alertData} />
            <Onset
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
            <Expires
              onUpdate={onUpdate}
              alertData={alertData}
              disabled={isNewLanguageDraft}
            />
          </Stack>

          <Divider />

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            <Language onUpdate={onUpdate} alertData={alertData} />
            <Web onUpdate={onUpdate} alertData={alertData} />
            <Contact onUpdate={onUpdate} alertData={alertData} />
          </Stack>

          <Divider />

          <Resources onUpdate={onUpdate} alertData={alertData} />
        </div>

        <div className={styles.right}>
          <div className={styles.row}>
            <MapForm
              onUpdate={onUpdate}
              alertData={alertData}
              alertingAuthority={props.alertingAuthority}
              disabled={isNewLanguageDraft}
            />
          </div>

          <div className={styles.row}>
            <XMLPreview
              alertingAuthority={props.alertingAuthority}
              alertData={alertData}
              {...(isNewLanguageDraft && {
                multiLanguageGroupId: props.multiLanguageGroupId,
              })}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
