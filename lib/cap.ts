import { FormAlertData } from "../components/editor/Editor";
import { validate as validateJSON } from 'jsonschema';
import { CAPV12JSONSchema, CAPV12Schema } from "./types/cap.schema";

export const mapFormAlertDataToCapSchema = (alertData: FormAlertData, id: string): CAPV12JSONSchema => {
  // Type as `any` for now because this object needs to next be validated against the JSON schema
  const alert: any = {
    identifier: id,
    sender: process.env.CAP_ALERT_SENDER,
    sent: new Date().toISOString(),
    status: alertData.status,
    msgType: alertData.msgType,
    // source
    scope: alertData.scope,
    ...(alertData.restriction && { restriction: alertData.restriction }),
    ...(alertData.addresses && { addresses: alertData.addresses?.map(a => `"${a}"`).join(' ') }),
    // code
    // note
    ...(alertData.references && { references: alertData.references?.join(' ') }),
    // incidents,
    info: [{
      // language
      category: alertData.category,
      event: alertData.event,
      responseType: alertData.actions,
      urgency: alertData.urgency,
      severity: alertData.severity,
      certainty: alertData.certainty,
      // audience
      // eventCode
      // effective
      onset: alertData.from,
      expires: alertData.to,
      // senderName
      headline: alertData.headline,
      description: alertData.description,
      instruction: alertData.instruction,
      web: `https://${process.env.DOMAIN}/feed/${identifier}`,
      // contact
      // parameter
      // resource: [{
      //   resourceDesc: alertData.resourceDesc,
      //   mimeType: alertData.mimeType,
      //   // size
      //   // uri
      //   // drefUri
      //   // digest
      // }],
      area: [{
        areaDesc: Object.keys(alertData.regions).join(', '),
        circle: Object.values(alertData.regions).filter(data => typeof data === 'string'),
        polygon: Object.values(alertData.regions).filter(data => typeof data !== 'string'),
        // geocode
        // altitude
        // ceiling
      }]
    }]
  };


  const validationResult = validateJSON(alert, CAPV12Schema);
  if (!validationResult.valid) throw 'Invalid alert details';

  return alert as CAPV12JSONSchema;
};