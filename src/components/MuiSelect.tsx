import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IMuiSelectProps {
  data: string[];
  onChange: any;
  selected: string | string[];
  multiSelect: boolean;
  label: string;
}
export default function MuiSelect(props: IMuiSelectProps) {
  const { data, onChange, selected, multiSelect, label } = props;
  return (
    <div>
      {multiSelect ? (
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel>{label}</InputLabel>
          <Select
            multiple={multiSelect}
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            input={<OutlinedInput label={label} />}
            renderValue={(selections) =>
              Array.isArray(selections) && selections.join(", ")
            }
            MenuProps={MenuProps}
          >
            {data.map((d) => {
              return (
                <MenuItem key={d} value={d}>
                  <Checkbox checked={selected.indexOf(d) > -1} />
                  <ListItemText primary={d} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      ) : (
        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            label={label}
          >
            <MenuItem sx={{ m: 1, minWidth: 280 }} value="0">
              <em>None</em>
            </MenuItem>
            {data.map((d, i) => {
              return (
                <MenuItem
                  sx={{ m: 1, minWidth: 280 }}
                  key={d + i}
                  value={i + 1 + ""}
                >
                  {d}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
MuiSelect.defaultProps = {
  data: [],
};
