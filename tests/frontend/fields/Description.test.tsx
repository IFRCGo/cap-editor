import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Description } from "../../../components/editor/fields";
import { messages } from "../../../locales/en/messages";
import { Form } from "rsuite";
import userEvent from "@testing-library/user-event";
import { defaultFormData } from "../helpers";

i18n.load({ en: messages });
i18n.activate("en");
const TestingProvider = ({ children }: any) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={true}>
      <Form>{children}</Form>
    </I18nProvider>
  );
};

const props = { alertData: { ...defaultFormData, description: "" } };

describe("<Description>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Description {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Description");
    await screen.findByRole("textbox");
  });

  test("triggers callback on typing correctly", async () => {
    const onUpdate = jest.fn();
    render(<Description {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByRole("textbox");
    const user = userEvent.setup();
    const text = "test";
    await user.type(input, text);

    expect(onUpdate).toBeCalledTimes(text.length);
    expect(onUpdate).toBeCalledWith({ description: text });
  });
});
