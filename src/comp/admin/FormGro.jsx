import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { memo } from "react";

function FormGro(props) {
  const {
    inputLabel,
    label,
    name,
    value,
    fun,
    data,
    lang,
    disabled
  } = props;

  return (
    <FormControl fullWidth disabled={disabled} className="mt-2.5 mb-2.5 w-full">
      <InputLabel>{inputLabel}</InputLabel>
      <Select label={label} name={name} value={value} onChange={fun}>
        {data?.map((item, index) => {
          let itemLabel = "";
          let itemValue = "";
          if (typeof item === "object" && item !== null) {
            if ("devName" in item) {
              // النوع الأول
              itemLabel = item.devName[lang] || item.devName.en;
              itemValue = item.id;
            } else {
              // النوع التاني
              itemLabel = item[lang] || item.en;
              itemValue = item[lang] || item.en;
            }
          } else {
            // لو نص مباشر
            itemLabel = item;
            itemValue = item;
          }
          return (
            <MenuItem value={itemValue} key={index}>
              {itemLabel}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default memo(FormGro);
