import { Call, WhatsApp } from '@mui/icons-material'
import { IconButton, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from "react-i18next";

function ContactUsIcon({ sectionName = "", sectionData = "" }) {
  // console.log(sectionData);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  return (
    <Stack sx={{ flexDirection: "row", gap: 2, justifyContent: "end" }}>
      <a href="tel:+201008582515">
        <IconButton
          variant="contained"
          sx={{
            backgroundColor: "rgb(228, 235, 242)",
            color: "rgb(30, 65, 100)",
            fontWeight: "bold",
          }}
        >
          <Call />
        </IconButton>
      </a>
      <a
        target="_blank"
        href={`https://wa.me/+201008582515?text=${
          sectionName && `Section%20Name%20:%20${sectionName}`
        }${
          sectionData && sectionData.launchName
            ? `%0ALaunch-Name%20:%20${sectionData.launchName[lang]}`
            : ""
        }${
          sectionData && sectionData.devname
            ? `%0ADeveloper-Name%20:%20${sectionData.devname}`
            : ""
        }${
          sectionData && sectionData.compoundName
            ? `%0ACompound-Name%20:%20${sectionData.compoundName[lang]}`
            : ""
        }${
          sectionData && sectionData.refNum
            ? `%0AReference-NO%20:%20${sectionData.refNum}`
            : ""
        }${
          sectionData && sectionData.devName
            ? `%0ADeveloper-Name%20:%20${sectionData.devName}`
            : ""
        }${
          sectionData && sectionData.proj
            ? `%0AProject-Name%20:%20${sectionData.proj}`
            : ""
        }${
          sectionData && sectionData.district
            ? `%0AProject-District%20:%20${sectionData.district}`
            : ""
        }${
          sectionData && sectionData.Location
            ? `%0AProject-Location%20:%20${sectionData.Location[lang]}`
            : ""
        }${
          sectionData && sectionData.projectName
            ? `%0AProject-Name%20:%20${sectionData.projectName}`
            : ""
        }`}
      >
        <IconButton
          className="whatsbtn"
          variant="contained"
          sx={{
            backgroundColor: "rgb(76, 217, 100)",
            color: "white",
            fontWeight: "bold",
            transition: "0.3s",
          }}
        >
          <WhatsApp />
        </IconButton>
      </a>
    </Stack>
  );
}

export default ContactUsIcon