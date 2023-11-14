import { render, screen, fireEvent } from "@testing-library/react";
import CoolButton from "./CoolButton";
import { ModeContext } from "../../contexts/ModeContext";
import "@testing-library/jest-dom";
import React from "react";

describe("CoolButton", () => {
  it("renders CoolButton with correct styles and text", () => {
    const mockModeContextValue = { mode: "light" };

    render(
      <ModeContext.Provider value={mockModeContextValue}>
        <CoolButton text="Easy" loading={false} onClick={() => {}} disabled={false} />
      </ModeContext.Provider>
    );

    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Easy").closest("button")).toHaveStyle({
      background: "rgb(27, 94, 32)",
      color: "white",
      cursor: "pointer",
    });
  });

  it("handles click event when not disabled", () => {
    const mockModeContextValue = { mode: "dark" };
    const mockClickHandler = jest.fn();

    render(
      <ModeContext.Provider value={mockModeContextValue}>
        <CoolButton text="Medium" loading={false} onClick={mockClickHandler} disabled={false} />
      </ModeContext.Provider>
    );

    fireEvent.click(screen.getByText("Medium"));

    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  it("renders loading state when loading is true", () => {
    const mockModeContextValue = { mode: "light" };

    render(
      <ModeContext.Provider value={mockModeContextValue}>
        <CoolButton text="Loading" loading={true} onClick={() => {}} disabled={false} />
      </ModeContext.Provider>
    );

    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();
  });

  it("renders disabled state when disabled is true", () => {
    const mockModeContextValue = { mode: "light" };

    render(
      <ModeContext.Provider value={mockModeContextValue}>
        <CoolButton text="Disabled" loading={false} onClick={() => {}} disabled={true} />
      </ModeContext.Provider>
    );

    expect(screen.getByText("Disabled").closest("button")).toBeDisabled();
  });
});