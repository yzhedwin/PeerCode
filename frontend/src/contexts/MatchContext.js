import React, { createContext, useState } from "react";

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [match, setMatch] = useState();
  const [findMatchEasy, setFindMatchEasy] = useState();
  const [findMatchMedium, setFindMatchMedium] = useState();
  const [findMatchHard, setFindMatchHard] = useState();
  return (
    <MatchContext.Provider
      value={{
        match,
        findMatchEasy,
        findMatchMedium,
        findMatchHard,
        setMatch,
        setFindMatchEasy,
        setFindMatchMedium,
        setFindMatchHard,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};
