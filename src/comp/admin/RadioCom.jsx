import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { memo } from "react";

function RadioCom({ value, onChange, data, label, name, lang }) {
  // console.log(lang)
  // console.log(value)
  return (
    <FormControl className="mt-2.5 mb-2.5 w-full">
      <FormLabel required>{label}</FormLabel>
      <RadioGroup
        row
        name={name}
        value={JSON.stringify(value)} // مهم جدا عشان يقارن ال object
        onChange={(e) => {
          const selectedValue = JSON.parse(e.target.value);
          onChange(selectedValue);
        }}
      >
        {data?.map((item, index) => {
          const itemLabel = typeof item === "object" ? item[lang] : item;
          const itemValue = typeof item === "object" ? JSON.stringify(item) : item;
          // console.log(itemValue)
          // console.log(item)
          return (
            <FormControlLabel
              value={itemValue}
              key={index}
              control={<Radio />}
              label={itemLabel}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}

export default memo(RadioCom);
