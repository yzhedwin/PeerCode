import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function CustomSelect(props) {
	const { title, list, value, handleChange } = props;
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
		<FormControl sx={{ m: 0, minWidth: 120, backgroundColor: "secondary.main" }} size="small">
			<Select
				id="select-small-ide-"
				value={JSON.stringify(value)}
				onChange={handleChange}
				MenuProps={MenuProps}
				displayEmpty
				title={`Select ${title}`}
			>
				{list.map((value) => {
					return (
						<MenuItem key={value.name} value={JSON.stringify(value)}>
							{value.name}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
}
