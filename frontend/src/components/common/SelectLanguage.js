import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { EDITOR_SUPPORTED_LANGUAGES } from "../../utils/constants";

export default function SelectLanguage(props) {
	const { language, handleChange } = props;
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
	};

	return (
		<FormControl
			sx={{ m: 0, minWidth: 120, backgroundColor: "secondary.main" }}
			size="small"
		>
			<Select
				id="select-small-ide-language"
				value={JSON.stringify(language)}
				onChange={handleChange}
				MenuProps={MenuProps}
				displayEmpty
				title="Select Editor Language"
			>
				{EDITOR_SUPPORTED_LANGUAGES.map((language) => {
					return (
						<MenuItem
							key={language.name}
							value={JSON.stringify(language)}
						>
							{language.name}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
}
