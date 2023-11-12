import React, { createContext, useState } from "react";

export const SnackBarContext = createContext();

export const SnackBarProvider = ({ children }) => {
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [sb, setSB] = useState({ msg: "", severity: "info" });

	return (
		<SnackBarContext.Provider
			value={{
				openSnackBar,
				setOpenSnackBar,
				sb,
				setSB,
			}}
		>
			{children}
		</SnackBarContext.Provider>
	);
};
