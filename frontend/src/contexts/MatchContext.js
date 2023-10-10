import React, { createContext, useState } from "react";

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [match, setMatch] = useState();
  const [findMatch, setFindMatch] = useState({
    easy: false,
    medium: false,
    hard: false,
  });
  return (
    <MatchContext.Provider
      value={{
        match,
        findMatch,
        setMatch,
        setFindMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};
