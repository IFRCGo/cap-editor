/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * JSON Schema for Common Alerting Protocol v1.2
 */
export type CAPV12JSONSchema = CAPV12JSONSchema1 & CAPV12JSONSchema2;
export type CAPV12JSONSchema1 = {
  [k: string]: unknown;
};

export interface CAPV12JSONSchema2 {
  identifier: string;
  sender: string;
  sent: string;
  status: "Actual" | "Exercise" | "System" | "Test";
  msgType: "Alert" | "Update" | "Cancel";
  source?: string;
  scope: "Public";
  restriction?: string;
  addresses?: string;
  code?: string[];
  note?: string;
  references?: string;
  incidents?: string;
  info?: {
    language?: string;
    /**
     * @minItems 1
     */
    category: [
      "Geo" | "Met" | "Safety" | "Rescue" | "Fire" | "Health" | "Env" | "Transport" | "Infra" | "CBRNE" | "Other",
      ...("Geo" | "Met" | "Safety" | "Rescue" | "Fire" | "Health" | "Env" | "Transport" | "Infra" | "CBRNE" | "Other")[]
    ];
    event: string;
    responseType?: (
      | "Shelter"
      | "Evacuate"
      | "Prepare"
      | "Execute"
      | "Avoid"
      | "Monitor"
      | "Assess"
      | "AllClear"
      | "None"
    )[];
    urgency: "Immediate" | "Expected" | "Future" | "Past" | "Unknown";
    severity: "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
    certainty: "Observed" | "Likely" | "Possible" | "Unlikely" | "Unknown";
    audience?: string;
    eventCode?: {
      name: string;
      value: string;
    }[];
    effective?: string;
    onset?: string;
    expires?: string;
    senderName?: string;
    headline?: string;
    description?: string;
    instruction?: string;
    web?: string;
    contact?: string;
    parameter?: {
      valueName: string;
      value: string;
    }[];
    resource?: {
      resourceDesc: string;
      mimeType: string;
      size?: number;
      uri?: string;
      drefUri?: string;
      digest?: string;
    }[];
    area?: {
      areaDesc: string;
      polygon?: ((number[] | number)[] | number)[][];
      circle?: string[];
      geocode?: {
        valueName: string;
        value: string;
      }[];
      altitude?: number;
      ceiling?: number;
    }[];
  }[];
}

export const CAPV12Schema = 
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "CAP v1.2 JSON schema",
  "description": "JSON Schema for Common Alerting Protocol v1.2",
  "type": "object",
  "properties": {
    "identifier": {
      "type": "string",
      "format": "uuid",
      "pattern": "[^<&,\\s]"
    },
    "sender": {
      "type": "string",
      "pattern": "[^<&,\\s]"
    },
    "sent": {
      "type": "string",
      "format": "date-time"
    },
    "status": {
      "type": "string",
      "enum": [
        "Actual",
        "Exercise",
        "System",
        "Test"
      ]
    },
    "msgType": {
      "type": "string",
      "enum": [
        "Alert",
        "Update",
        "Cancel"
      ]
    },
    "source": {
      "type": "string"
    },
    "scope": {
      "type": "string",
      "enum": [
        "Public"
      ]
    },
    "restriction": {
      "type": "string"
    },
    "addresses": {
      "type": "string"
    },
    "code": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "note": {
      "type": "string"
    },
    "references": {
      "type": "string"
    },
    "incidents": {
      "type": "string"
    },
    "info": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string"
          },
          "category": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "string",
              "enum": [
                "Geo",
                "Met",
                "Safety",
                "Rescue",
                "Fire",
                "Health",
                "Env",
                "Transport",
                "Infra",
                "CBRNE",
                "Other"
              ]
            }
          },
          "event": {
            "type": "string"
          },
          "responseType": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Shelter",
                "Evacuate",
                "Prepare",
                "Execute",
                "Avoid",
                "Monitor",
                "Assess",
                "AllClear",
                "None"
              ]
            }
          },
          "urgency": {
            "type": "string",
            "enum": [
              "Immediate",
              "Expected",
              "Future",
              "Past",
              "Unknown"
            ]
          },
          "severity": {
            "type": "string",
            "enum": [
              "Extreme",
              "Severe",
              "Moderate",
              "Minor",
              "Unknown"
            ]
          },
          "certainty": {
            "type": "string",
            "enum": [
              "Observed",
              "Likely",
              "Possible",
              "Unlikely",
              "Unknown"
            ]
          },
          "audience": {
            "type": "string"
          },
          "eventCode": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                }
              },
              "required": [
                "name",
                "value"
              ],
              "additionalProperties": false
            }
          },
          "effective": {
            "type": "string",
            "format": "date-time"
          },
          "onset": {
            "type": "string",
            "format": "date-time"
          },
          "expires": {
            "type": "string",
            "format": "date-time"
          },
          "senderName": {
            "type": "string"
          },
          "headline": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "instruction": {
            "type": "string"
          },
          "web": {
            "type": "string",
            "format": "uri"
          },
          "contact": {
            "type": "string"
          },
          "parameter": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "valueName": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                }
              },
              "required": [
                "valueName",
                "value"
              ],
              "additionalProperties": false
            }
          },
          "resource": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "resourceDesc": {
                  "type": "string"
                },
                "mimeType": {
                  "type": "string"
                },
                "size": {
                  "type": "number"
                },
                "uri": {
                  "type": "string",
                  "format": "uri"
                },
                "drefUri": {
                  "type": "string"
                },
                "digest": {
                  "type": "string"
                }
              },
              "required": [
                "resourceDesc",
                "mimeType"
              ],
              "additionalProperties": false
            }
          },
          "area": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "areaDesc": {
                  "type": "string"
                },
                "polygon": {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "anyOf": [
                        {
                          "type": "array",
                          "items": {
                            "anyOf": [
                              {
                                "type": "array",
                                "items": {
                                  "type": "number"
                                }
                              },
                              {
                                "type": "number"
                              }
                            ]
                          }
                        },
                        {
                          "type": "number"
                        }
                      ]
                    }
                  }
                },
                "circle": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "geocode": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "valueName": {
                        "type": "string"
                      },
                      "value": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "valueName",
                      "value"
                    ],
                    "additionalProperties": false
                  }
                },
                "altitude": {
                  "type": "number"
                },
                "ceiling": {
                  "type": "number"
                }
              },
              "required": [
                "areaDesc"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "category",
          "event",
          "urgency",
          "severity",
          "certainty"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "identifier",
    "sender",
    "sent",
    "status",
    "msgType",
    "scope"
  ],
  "additionalProperties": false,
  "allOf": [
    {
      "if": {
        "properties": {
          "scope": {
            "const": "Restricted"
          }
        }
      },
      "then": {
        "required": [
          "restriction"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "scope": {
            "const": "Private"
          }
        }
      },
      "then": {
        "required": [
          "addresses"
        ]
      }
    }
  ]
}
