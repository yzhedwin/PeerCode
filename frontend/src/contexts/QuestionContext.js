import React, { createContext, useState } from "react";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [question, setQuestion] = useState({ problem: "some question" });

  return (
    <QuestionContext.Provider
      value={{
        question,
        setQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
