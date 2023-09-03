import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";
import { useLingui } from "@lingui/react";

export default function Web({ onUpdate, alertData }: FieldProps) {
  useLingui();
  return (
    <TextField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Web`}
      fieldName="web"
    />
  );
}
