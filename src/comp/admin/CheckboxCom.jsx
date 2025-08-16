import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { memo } from "react";

function CheckboxCom({ handleCheckboxChange, name, data, lang = "en" }) {
  return (
    <FormGroup className="flex-row flex-wrap gap-2">
      {data.map((item, index) => {
        const label = item[lang] || item.en; // يعرض حسب اللغة
        const isChecked = name.some(
          (selected) => selected.en === item.en && selected.ar === item.ar
        );

        return (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={isChecked}
                onChange={() => handleCheckboxChange(item)}
              />
            }
            label={label}
          />
        );
      })}
    </FormGroup>
  );
}

export default memo(CheckboxCom);
