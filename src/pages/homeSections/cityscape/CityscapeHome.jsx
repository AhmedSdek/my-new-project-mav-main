import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import img from "./cityescape (890 x 120 بيكسل) (690 x 120 بيكسل).webp";
import { useTranslation } from "react-i18next";

function CityscapeHome() {
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
            {lang === "ar" ? "عروض السوق" : "Market offers"}
          </Typography>
        </Stack>

        <Link
          to="/cityscapeprojects"
          aria-label={lang === "ar" ? "عروض السوق" : "Market offers"}
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
              alt={lang === "ar" ? "عروض السوق" : "Market offers"}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        </Link>
      </div>
    </Container>
  );
}

export default CityscapeHome;
