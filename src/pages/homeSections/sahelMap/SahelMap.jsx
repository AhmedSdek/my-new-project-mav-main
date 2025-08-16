import React from "react";
import { Link } from "react-router-dom";
import img from "./SAHE L MAP.webp";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function SahelMap() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Container>
      <div style={{ marginTop: "15px" }}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>
            {lang === "ar"
              ? "استكشف كل المشاريع في الساحل الشمالي"
              : "Explore all projects in North Coast"}
          </Typography>
        </Stack>

        <Link
          to="/sahelmap"
          aria-label={
            lang === "ar" ? "خريطة الساحل الشمالي" : "Sahel North Coast Map"
          }
          style={{
            display: "inline-block",
            width: "100%",
            textDecoration: "none",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: { xs: "100px", sm: "150px", md: "180px" },
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={img}
              alt={
                lang === "ar" ? "خريطة الساحل الشمالي" : "Sahel North Coast Map"
              }
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Link>
      </div>
    </Container>
  );
}

export default SahelMap;
