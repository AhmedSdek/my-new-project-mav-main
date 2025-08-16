import React, { Suspense, lazy } from "react";
import "./home.css";
import { Box, Stack } from "@mui/material";
import Calc from "../Calc/Calc";

// الصور بصيغة WebP
import imLargeWebp from "/im.webp";
import imSmallWebp from "./im2.webp";

const SahelMap = lazy(() => import("../sahelMap/SahelMap"));
const CityscapeHome = lazy(() => import("../cityscape/CityscapeHome"));
const NewLaunches = lazy(() => import("../newLaunche/NewLaunches"));
const Developers = lazy(() => import("../developers/Developers"));
const Deals = lazy(() => import("../deals/Deals"));
const Form = lazy(() => import("../form/Form"));
const Search = lazy(() => import("../search/Search"));
const NorthCoastProjects = lazy(() =>
  import("../north Coast Projects/NorthCoastProjects")
);

import { useTranslation } from "react-i18next";
import MavLoading from "../../../comp/Loading/MavLoading";

function Home() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div>
      {/* الهيدر */}
      <Box
        component="header"
        sx={{
          position: "relative",
          backgroundColor: "white",
          minHeight: "400px",
          overflow: "hidden",
        }}
        className="home-header"
      >
        <img
          src="/im.webp"
          srcSet={`${imSmallWebp} 600w, ${imLargeWebp} 1200w`}
          sizes="(max-width: 600px) 100vw, 100vw"
          alt={lang === "ar" ? "صورة الهيدر" : "Header background"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
          loading="eager"
          fetchpriority="high"
        />

        <div
          className="header-main"
          style={{ textAlign: "start", width: "40%", margin: "35px auto 0" }}
        >
          <h1
            className="hed1"
            style={{ color: "white", lineHeight: "1.8", width: "fit-content" }}
          >
            <mark
              style={{
                backgroundColor: "rgb(255 145 77 / 87%)",
                borderRadius: "6px",
                fontWeight: "bold",
                color: "#1e4164",
              }}
            >
              {lang === "ar" ? "دعنا" : "Let us"}
            </mark>
          </h1>
          <h2
            className="hed2"
            style={{
              color: "white",
              fontWeight: "bold",
              margin: "0",
              fontSize: "40px",
            }}
          >
            {lang === "ar" ? "نساعدك في" : "Help You To Make"}
          </h2>
          <h2
            className="hed3"
            style={{
              textAlign: "end",
              fontWeight: "bold",
              color: "white",
              margin: "5px 0 0 0",
              fontSize: "40px",
            }}
          >
            {lang === "ar" ? "الحركه" : "The Move"}
          </h2>

          <Suspense fallback={<div style={{ color: "white" }}>Loading...</div>}>
            <Search />
          </Suspense>
        </div>
      </Box>

      {/* باقي الكومبوننت */}
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MavLoading />
          </div>
        }
      >
        <SahelMap />
        <CityscapeHome />
        <NorthCoastProjects />
        <NewLaunches />
        <Developers />
        <Deals />
        <Stack sx={{ marginBottom: "15px" }}>
          <Form
            hedText="Need Expert Advice ?"
            text2="Fill out the form and one of our property consultants will contact you."
            Alert="Thank you. I will get back to you as soon as possible."
          />
        </Stack>
      </Suspense>

      <Calc />
    </div>
  );
}

export default Home;
