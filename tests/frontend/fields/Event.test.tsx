import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Event } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, event: "" } };

describe("<Event>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Event {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Event");
    await screen.findByText("0/35 characters", { exact: false });
    await screen.findByText("What is the event this alert pertains to?", {
      exact: false,
    });
    await screen.findByRole("textbox");
  });

  test("triggers callback on typing correctly", async () => {
    const onUpdate = jest.fn();
    render(<Event {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByRole("textbox");
    const user = userEvent.setup();
    await user.type(input, "t");

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ event: "t" });
  });
});
