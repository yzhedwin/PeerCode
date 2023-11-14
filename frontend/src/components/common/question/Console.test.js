import React from "react";
import { render, screen } from "@testing-library/react";
import Console from "./Console";
import { ProblemContext } from "../../../contexts/ProblemContext";
import '@testing-library/jest-dom';

const mockProblemContextValue = {
  consoleResult: {
    status: {
      description: "Success",
      id: 4,
    },
    time: 2,
    stderr: "",
    stdout: "Test Output",
  },
};

describe("Console Component", () => {
    it("should render the console when consoleResult is available", () => {
      render(
        <ProblemContext.Provider value={mockProblemContextValue}>
          <Console expectedOutput="Expected Output" />
        </ProblemContext.Provider>
      );
      
      // Assert that the important text content is present
      expect(screen.getByText("Success")).toBeInTheDocument(); // Check status description
      expect(screen.getByText("Runtime: 2000ms")).toBeInTheDocument(); // Check runtime
      expect(screen.getByText("Output")).toBeInTheDocument(); // Check "Output" title
      expect(screen.getByText("Test Output")).toBeInTheDocument(); // Check actual output
      expect(screen.getByText("Expected")).toBeInTheDocument(); // Check "Expected" title
      expect(screen.getByText("Expected Output")).toBeInTheDocument(); // Check expected output
    });
  
    it("should render an error message when the status is an error", () => {
      const mockErrorContextValue = {
        consoleResult: {
          status: {
            description: "Error",
            id: 5,
          },
          stderr: "Error Message",
        },
      };
  
      render(
        <ProblemContext.Provider value={mockErrorContextValue}>
          <Console expectedOutput="Expected Output" />
        </ProblemContext.Provider>
      );
  
      // Assert that the error message is displayed
      expect(screen.getByText("Error Message")).toBeInTheDocument();
    });
  
    it("should render the console without 'Expected' section when status is not 4", () => {
      const mockOtherStatusContextValue = {
        consoleResult: {
          status: {
            description: "Partial Success",
            id: 2,
          },
          stdout: "Partial Output",
        },
      };
  
      render(
        <ProblemContext.Provider value={mockOtherStatusContextValue}>
          <Console expectedOutput="Expected Output" />
        </ProblemContext.Provider>
      );
  
      // Assert that the "Expected" section is not displayed
      expect(screen.queryByText("Expected")).toBeNull();
  
      // Assert that the actual output is displayed
      expect(screen.getByText("Partial Output")).toBeInTheDocument();
    });
  
    it("should not render the console when consoleResult is not available", () => {
      render(
        <ProblemContext.Provider value={{}}>
          <Console expectedOutput="Expected Output" />
        </ProblemContext.Provider>
      );
  
      // Assert that the console container is not rendered
      expect(screen.queryByRole("box", { name: /console/i })).toBeNull();
    });
  });
  