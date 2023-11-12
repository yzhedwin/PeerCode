import { createContext, useState } from "react";

export const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
	const [match, setMatch] = useState({});
	const [findMatch, setFindMatch] = useState(false);
	const [hasInit, setHasInit] = useState(false);
	const [findMatchFail, setFindMatchFail] = useState(false);
	return (
		<MatchContext.Provider
			value={{
				match,
				findMatch,
				setMatch,
				setFindMatch,
				hasInit,
				setHasInit,
				findMatchFail,
				setFindMatchFail,
			}}
		>
			{children}
		</MatchContext.Provider>
	);
};
