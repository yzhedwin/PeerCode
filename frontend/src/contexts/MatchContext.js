import React, { createContext, useState } from "react";

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
    const [match, setMatch] = useState();
    const [findMatch, setFindMatch] = useState(false);
    const [quitMatch, setQuitMatch] = useState(false);
    const [hasInit, setHasInit] = useState(false);

    return (
        <MatchContext.Provider
            value={{
                match,
                findMatch,
                hasInit,
                quitMatch,
                setMatch,
                setFindMatch,
                setQuitMatch,
                setHasInit,
            }}
        >
            {children}
        </MatchContext.Provider>
    );
};
