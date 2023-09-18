import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
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
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="select-small-ide-language">Language</InputLabel>
      <Select
        labelId="select-small-ide-language-label"
        id="select-small-ide-language"
        value={JSON.stringify(language)}
        label="language"
        onChange={handleChange}
        MenuProps={MenuProps}
      >
        {EDITOR_SUPPORTED_LANGUAGES.map((language) => {
          return (
            <MenuItem value={JSON.stringify(language)}>
              {language.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
