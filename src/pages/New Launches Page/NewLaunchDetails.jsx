import { Box, Container, Stack, Typography } from '@mui/material'
import { collection, doc, getDoc, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/config";
import { Link, useParams } from "react-router-dom";
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import MavLoading from "../../comp/Loading/MavLoading";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import ReactLoading from "react-loading";

function NewLaunchDetails() {
  const { launchId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();
  const [newlaunch, setNewlaunch] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(newlaunch);
  useEffect(() => {
    const fetchNewlaunch = async () => {
      try {
        const docRef = doc(db, "newlaunch", launchId);
        const docSnap = await getDoc(docRef);
        setNewlaunch({ id: docSnap.id, ...docSnap.data() });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewlaunch();
  }, []);
  if (error) return <p>حدث خطأ: {error}</p>;

  return (
    <Box
      sx={
        {
          // minHeight: "100vh",
        }
      }
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: {
              xs: "calc(100vh - 160px)",
              sm: "calc(100vh - 100px)",
            },
          }}
        >
          <MavLoading />
        </Box>
      ) : newlaunch ? (
        <Stack
          sx={{ padding: { xs: "70px 0 0", sm: "70px 0 0", md: "110px 0 0" } }}
        >
          <Container>
            <Stack
              sx={{
                height: { md: "400px", sm: "300px" },
                borderRadius: "10px",
                overflow: "hidden",
                // padding: { xs: "70px 0 0", sm: "70px 0 0", md: "110px 0 0" },
              }}
            >
              {!newlaunch.video ? (
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={newlaunch.img[0]}
                  alt=""
                />
              ) : (
                <video
                  autoPlay
                  style={{ width: "100%", height: "100%" }}
                  controls
                  src={newlaunch.video}
                  type="video/mp4"
                />
              )}
            </Stack>
            <Stack
              sx={{
                flexDirection: { sm: "column", md: "row" },
                gap: 4,
                marginTop: "30px",
                alignItems: "center",
              }}
            >
              <Stack>
                <Link
                  to={`/developers/${newlaunch.developer.devName.en}`}
                  style={{ borderRadius: "50%" }}
                >
                  <img
                    style={{
                      width: "100px",
                      boxShadow: "0 -1px 15px -3px rgba(0, 0, 0, 0.2)",
                      borderRadius: "50%",
                    }}
                    src={newlaunch.devIcon}
                    alt={newlaunch.developer.devName[lang]}
                  />
                </Link>
              </Stack>
              <Stack sx={{ width: "100%" }}>
                <Stack
                  sx={{
                    justifyContent: "center",
                    alignItems: { xs: "center", md: "initial" },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {newlaunch.launchName[lang]}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    flexDirection: { sm: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    sx={{
                      justifyContent: "center",
                      alignItems: { xs: "center", md: "initial" },
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {newlaunch.developer.devName[lang]}
                    </Typography>
                    <Typography variant="caption">
                      {newlaunch.Location[lang]}
                    </Typography>
                    {newlaunch.price && (
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {` ${newlaunch.price} EGP `}
                        <span
                          style={{ fontWeight: "normal", fontSize: "14px" }}
                        >
                          Start Price
                        </span>
                      </Typography>
                    )}
                  </Stack>
                  <Stack>
                    <ContactUsBtn
                      sectionName="New-Launch"
                      sectionData={newlaunch}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <hr />
            <Stack sx={{ margin: "40px 0" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", padding: "0 0 10px 0" }}
              >
                Launch Details
              </Typography>
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p style={{ whiteSpace: "pre-line" }} {...props} />
                  ),
                  h6: ({ node, ...props }) => (
                    <h6 style={{ margin: "10px 0" }} {...props} />
                  ),
                }}
              >
                {newlaunch.Dis[lang]}
              </ReactMarkdown>
            </Stack>
          </Container>
        </Stack>
      ) : (
        <Typography>
          {lang === "en"
            ? `No Projects in ${country.en}`
            : `لا يوجد مشاريع في ${country.ar}`}
        </Typography>
      )}
    </Box>
  );
}

export default NewLaunchDetails