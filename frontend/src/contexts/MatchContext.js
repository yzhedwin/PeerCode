import React, { createContext, useState } from "react";

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
    const [match, setMatch] = useState();
    const [findMatch, setFindMatch] = useState(false);
    const [hasInit, setHasInit] = useState(false);

    return (
        <MatchContext.Provider
            value={{
                match,
                findMatch,
                hasInit,
                setMatch,
                setFindMatch,
                setHasInit,
            }}
        >
            {children}
        </MatchContext.Provider>
    );
};
