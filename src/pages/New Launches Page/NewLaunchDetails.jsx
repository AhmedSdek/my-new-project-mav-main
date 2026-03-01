import {
  Box,
  Container,
  Stack,
  Typography,
  Divider,
  Avatar,
  Paper,
  Chip,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { Link, useParams } from "react-router-dom";
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import MavLoading from "../../comp/Loading/MavLoading";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";

function NewLaunchDetails() {
  const { launchId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === "ar";
  const { country } = useGlobal();
  const [newlaunch, setNewlaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewlaunch = async () => {
      try {
        const docRef = doc(db, "newlaunch", launchId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNewlaunch({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewlaunch();
  }, [launchId]);

  if (error)
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error">حدث خطأ: {error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#fcfcfc", minHeight: "100vh" }}>
      {loading ? (
        <Stack
          sx={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <MavLoading />
        </Stack>
      ) : newlaunch ? (
        <Stack sx={{ pt: { xs: 10, md: 15 }, pb: 10 }}>
          <Container maxWidth="lg">
            {/* Media Section (Image/Video) */}
            <Paper
              elevation={0}
              sx={{
                height: { xs: "250px", sm: "400px", md: "550px" },
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                position: "relative",
                bgcolor: "#000",
              }}>
              {!newlaunch.video ? (
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={newlaunch.img[0]}
                  alt={newlaunch.launchName[lang]}
                />
              ) : (
                <video
                  autoPlay
                  muted
                  loop
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={newlaunch.video}
                />
              )}
              <Chip
                label={isAr ? "إطلاق جديد" : "New Launch"}
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  bgcolor: "#ff6e19",
                  color: "#white",
                  fontWeight: "bold",
                  px: 1,
                }}
              />
            </Paper>

            {/* Header Content */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ mt: 5, alignItems: { xs: "center", md: "flex-start" } }}>
              {/* Developer Logo */}
              <Link to={`/developers/${newlaunch.developer.devName.en}`}>
                <Avatar
                  src={newlaunch.devIcon}
                  alt={newlaunch.developer.devName[lang]}
                  sx={{
                    width: 120,
                    height: 120,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    border: "4px solid white",
                  }}
                />
              </Link>

              {/* Title and Key Details */}
              <Stack sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: "#1e4164",
                    mb: 1,
                    fontSize: { xs: "2rem", md: "2.8rem" },
                  }}>
                  {newlaunch.launchName[lang]}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 3 }}
                  sx={{
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: 3,
                  }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ color: "text.secondary" }}>
                    <BusinessIcon
                      sx={{ fontSize: "1.2rem", color: "#ff6e19" }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {newlaunch.developer.devName[lang]}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ color: "text.secondary" }}>
                    <LocationOnIcon
                      sx={{ fontSize: "1.2rem", color: "#ff6e19" }}
                    />
                    <Typography variant="subtitle1">
                      {newlaunch.Location[lang]}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider
                  sx={{
                    display: { xs: "block", md: "none" },
                    mb: 3,
                    width: "100%",
                  }}
                />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ bgcolor: "#f0f4f8", p: 3, borderRadius: "20px" }}>
                  {newlaunch.price && (
                    <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}>
                        {isAr ? "السعر المبدئي" : "Starting Price"}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 900, color: "#ff6e19" }}>
                        {Number(newlaunch.price).toLocaleString()}
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "1rem",
                            ml: 1,
                            fontWeight: 500,
                            color: "#1e4164",
                          }}>
                          EGP
                        </Typography>
                      </Typography>
                    </Box>
                  )}
                  <ContactUsBtn
                    sectionName="New-Launch-Details"
                    sectionData={newlaunch}
                  />
                </Stack>
              </Stack>
            </Stack>

            {/* Description Section */}
            <Box sx={{ mt: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#1e4164",
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}>
                <Box
                  sx={{
                    width: 6,
                    height: 35,
                    bgcolor: "#ff6e19",
                    borderRadius: 1,
                  }}
                />
                {isAr ? "تفاصيل المشروع" : "Launch Details"}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: "24px",
                  border: "1px solid #eee",
                  bgcolor: "white",
                  lineHeight: 1.8,
                }}>
                <Box
                  sx={{
                    "& p": {
                      marginBottom: "1.5rem",
                      fontSize: "1.1rem",
                      color: "#444",
                    },
                    "& h6": {
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      color: "#1e4164",
                      mt: 3,
                      mb: 1,
                    },
                  }}>
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p style={{ whiteSpace: "pre-line" }} {...props} />
                      ),
                      h6: ({ node, ...props }) => (
                        <h6 style={{ margin: "20px 0 10px" }} {...props} />
                      ),
                    }}>
                    {newlaunch.Dis[lang]}
                  </ReactMarkdown>
                </Box>
              </Paper>
            </Box>
          </Container>
        </Stack>
      ) : (
        <Stack
          sx={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Typography variant="h5">
            {lang === "en" ? `Project not found` : `المشروع غير موجود`}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default NewLaunchDetails;
