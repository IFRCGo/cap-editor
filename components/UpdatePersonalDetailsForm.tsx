import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form, Message } from "rsuite";

import { HandledError } from "../lib/helpers.client";
import { useToasterI18n } from "../lib/useToasterI18n";
import ErrorMessage from "./ErrorMessage";

type Data = { name: string };
export default function UpdatePersonalDetailsForm() {
  const toaster = useToasterI18n();
  const router = useRouter();
  const [formData, setFormData] = useState<Data>({ name: "" });

  return (
    <div>
      <Form
        formValue={formData}
        onChange={(v) => setFormData(v as Data)}
        onSubmit={async (_, e) => {
          e.preventDefault();
          await fetch("/api/user/personalDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.name }),
          })
            .then((res) => res.json())
            .then(async (res) => {
              if (res.error) throw new HandledError(res.message);
              toaster.push(
                <Message type="success" duration={0} closable>
                  <Trans>Your personal details were updated successfully</Trans>
                  .
                </Message>
              );
              router.reload();
            })
            .catch((err) =>
              toaster.push(
                <ErrorMessage
                  error={err}
                  action="updating your personal details"
                />
              )
            );
        }}
      >
        <Form.Group controlId="name">
          <Form.ControlLabel>
            <Trans>Name</Trans>
          </Form.ControlLabel>
          <Form.Control required name="name" placeholder={t`Your name`} />
        </Form.Group>

        <Form.Group>
          <Button appearance="primary" type="submit">
            <Trans>Save</Trans>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}