import styles from "../styles/components/AuthenticateForm.module.css";
import { Button, Form, SelectPicker } from "rsuite";
import { useState } from "react";
import { AlertingAuthority } from "../lib/types";

type RegisterData = {
  name: string;
  email: string;
  alertingAuthorityId: string;
};

export default function RegisterForm() {
  const [alertingAuthorities, setAlertingAuthorities] = useState([]);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    alertingAuthorityId: "",
  });

  // TODO fix styling of select items (height of virtualised cells)
  return (
    <div className={styles.wrapper}>
      <h1>Register</h1>
      <Form
        formValue={formData}
        onChange={(v) => setFormData(v as RegisterData)}
        onSubmit={async (_, e) => {
          e.preventDefault();
          console.log(formData);
          await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              alertingAuthorityId: formData.alertingAuthorityId,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              window.alert(
                "Registration successful. You will receive an email once your Alerting Authority has approved your account."
              );
            });
        }}
      >
        <Form.Group controlId="name">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control required name="name" placeholder="Your name" />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control
            required
            name="email"
            type="email"
            placeholder="me@example.com"
          />
        </Form.Group>

        <Form.Group controlId="alertingAuthorityId">
          <Form.ControlLabel>Alerting Authority</Form.ControlLabel>
          <Form.Control
            style={{ width: "400px" }}
            name="alertingAuthorityId"
            accepter={SelectPicker}
            onOpen={() =>
              fetch("/api/alertingAuthorities")
                .then((res) => res.json())
                .then((res) => setAlertingAuthorities(res.result))
            }
            virtualized
            groupBy="countryCode"
            labelKey="name"
            valueKey="id"
            sort={(isGroup) => {
              return (a: AlertingAuthority, b: AlertingAuthority) =>
                (isGroup ? a.countryCode < b.countryCode : a.name < b.name)
                  ? 1
                  : -1;
            }}
            data={alertingAuthorities}
          />
        </Form.Group>

        <Form.Group>
          <Button appearance="primary" type="submit">
            Register
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
