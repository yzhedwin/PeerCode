import React, { createContext, useState } from "react";

export const CodeContext = createContext();

export const CodeProvider = ({ children }) => {
  const [code, setCode] = useState("console.log('hello world')");

  return (
    <CodeContext.Provider
      value={{
        code,
        setCode,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};
