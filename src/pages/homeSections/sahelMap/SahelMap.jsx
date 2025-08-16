import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import img from './SAHE L MAP.webp'
import { Box, Container, Stack, Typography } from '@mui/material'
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
              : "Explore all project in north coast"}
          </Typography>
        </Stack>
        <Link
          aria-label="sahel-map"
          to="/sahelmap"
          className="saheldev"
          style={{
            display: "inline-block",
            height: "fit-content",
            width: "100%",
          }}
        >
          <Box
            className="videodev"
            sx={{
              width: "100%",
              height: { xs: "100px", sm: "150px", md: "180px" },
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                }}
                src={img}
                alt=""
              />
            </div>
          </Box>
        </Link>
      </div>
    </Container>
  );
}

export default SahelMap