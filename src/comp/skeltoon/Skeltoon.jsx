import { Grid, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

function Skeltoon({ height, width, Xs, Sm, Md, lg, variant }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.only("md"));
  const islg = useMediaQuery(theme.breakpoints.only("lg"));
  let skeltonCount = 1;
  if (isXs) skeltonCount = Xs;
  if (isSm) skeltonCount = Sm;
  if (isMdUp) skeltonCount = Md;
  if (islg) skeltonCount = lg;
  return (
    <Grid container spacing={2}>
      {Array.from({ length: skeltonCount }).map((_, index) => (
        <Grid
          key={index}
          size={{
            xs: 12 / skeltonCount,
            sm: 12 / Sm,
            md: 12 / Md,
            lg: 12 / lg,
          }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Skeleton
            height={height}
            variant={variant}
            sx={{ width: { xs: width, sm: "100%" }, maxWidth: "100%" }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default Skeltoon;
