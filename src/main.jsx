import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import ScrollTop from "./comp/ScrollTop";
import './i18n'; // 👈 مهم جدًا تكتبه هنا
import i18n from "./i18n"; // لو عندك i18n
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import rtlPlugin from "stylis-plugin-rtl";
import { GlobalProvider } from "./context/GlobalContext";
const lang = i18n.language || "en";
const cacheRtl = createCache({
  key: lang === "ar" ? "mui-rtl" : "mui",
  stylisPlugins: lang === "ar" ? [rtlPlugin] : [],
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={getTheme(lang)}>
      <GlobalProvider>
        <BrowserRouter>
          <ScrollTop />
          <App />
        </BrowserRouter>
      </GlobalProvider>
    </ThemeProvider>
  </CacheProvider>
);
