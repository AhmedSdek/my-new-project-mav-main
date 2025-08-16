import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Call, Mail, WorkHistory } from "@mui/icons-material";
import Form from "../homeSections/form/Form";

function ContactUs() {
  return (
    <Stack
      sx={{
        paddingTop: "70px ",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
      >
        <Box sx={{ textAlign: "center", margin: "15px 0" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "45px" }}>Contact us</h2>
          <Typography>Any Questions ? Just write us a message !</Typography>
        </Box>
        <Stack sx={{ width: "100%" }}>
          <Form />
        </Stack>
      </Stack>
      <Stack
        sx={{
          marginTop: "35px",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 7,
          minHeight: "200px",
          flexWrap: "wrap",
        }}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "150px",
            textAlign: "center",
          }}
        >
          <Stack
            sx={{
              width: "100px",
              height: "100px",
              backgroundColor: "#1e4164",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
              color: "#ff914d",
              marginBottom: "15px",
            }}
          >
            <Call sx={{ fontSize: "50px" }} />
          </Stack>
          <Typography sx={{ fontWeight: "bold" }}>Call us</Typography>
          <Typography variant="caption">+201008582515</Typography>
        </Stack>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "150px",
            textAlign: "center",
          }}
        >
          <Stack
            sx={{
              width: "100px",
              height: "100px",
              backgroundColor: "#1e4164",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
              color: "#ff914d",
              marginBottom: "15px",
            }}
          >
            <Mail sx={{ fontSize: "50px" }} />
          </Stack>
          <Typography sx={{ fontWeight: "bold" }}>E-Mail</Typography>
          <Typography variant="caption">
            Info@maverick-for-realestate.com
          </Typography>
        </Stack>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "150px",
            textAlign: "center",
          }}
        >
          <Stack
            sx={{
              width: "100px",
              height: "100px",
              backgroundColor: "#1e4164",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
              color: "#ff914d",
              marginBottom: "15px",
            }}
          >
            <WorkHistory sx={{ fontSize: "50px" }} />
          </Stack>
          <Typography sx={{ fontWeight: "bold" }}>Working hours</Typography>
          <Typography variant="caption">
            Saturday-thursday
            <br />
            11:00 AM - 7:00 pm
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ContactUs;
