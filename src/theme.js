// src/theme.js
import { createTheme } from "@mui/material/styles";

export const getTheme = (lang) =>
  createTheme({
    direction: lang === "ar" ? "rtl" : "ltr",
    typography: {
      fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Roboto, sans-serif",
    },
  });
