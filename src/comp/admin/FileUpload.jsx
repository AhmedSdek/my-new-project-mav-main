import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import { memo } from "react";

const VisuallyHiddenInput = (props) => (
  <input
    type="file"
    style={{
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: 1,
      overflow: "hidden",
      position: "absolute",
      bottom: 0,
      left: 0,
      whiteSpace: "nowrap",
      width: 1,
    }}
    {...props}
  />
);

function UploadSection({ handleFileChange, prog, title, multiple }) {
  return (
    <Box className="mt-2.5 mb-2.5 w-full">
      <Typography variant="body2">{title}</Typography>
      <Button
        component="label"
        variant="outlined"
        className="p-2! m-2.5!"
        startIcon={<AddPhotoAlternate />}
      >
        <VisuallyHiddenInput
          type="file"
          multiple={multiple}
          onChange={handleFileChange}
        />
      </Button>
      <LinearProgress variant="determinate" value={prog} />
    </Box>
  );
}

export default memo(UploadSection);
