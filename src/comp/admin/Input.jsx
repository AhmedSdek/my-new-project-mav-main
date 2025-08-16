import { TextField } from "@mui/material";
import React, { memo } from "react";

function Input(props) {
  return <TextField fullWidth className="mt-2.5 mb-2.5 w-full"  {...props} />;
}

export default memo(Input);
