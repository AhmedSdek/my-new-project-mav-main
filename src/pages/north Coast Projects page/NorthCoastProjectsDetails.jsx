import { Box, Container, Stack, Typography } from "@mui/material";
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
function NorthCoastProjectsDetails() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();
  const [northCoast, setNorthCoast] = useState({});
  console.log(northCoast);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchnorthcoast = async () => {
      try {
        const docRef = doc(db, "northcoast", id);
        const docSnap = await getDoc(docRef);
        setNorthCoast({ id: docSnap.id, ...docSnap.data() });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchnorthcoast();
  }, []);
  if (error) return <p>حدث خطأ: {error}</p>;

  return (
    <Box>
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
      ) : northCoast ? (
        <Stack
          sx={{
            minHeight: "100vh",
            padding: { xs: "70px 0 0", sm: "70px 0 0", md: "110px 0 0" },
          }}
        >
          <Container>
            <Stack
              sx={{
                height: { md: "400px", sm: "300px" },
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {!northCoast.video ? (
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={northCoast.img[0]}
                  alt=""
                />
              ) : (
                <video
                  autoPlay
                  style={{ width: "100%", height: "100%" }}
                  controls
                  src={northCoast.video}
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
                  to={`/developers/${northCoast.developer.devName.en}`}
                  style={{ borderRadius: "50%" }}
                >
                  <img
                    style={{
                      width: "100px",
                      boxShadow: "0 -1px 15px -3px rgba(0, 0, 0, 0.2)",
                      borderRadius: "50%",
                    }}
                    src={northCoast.devIcon}
                    alt={northCoast.developer.devName[lang]}
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
                    {northCoast.compoundName[lang]}
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
                      {northCoast.developer.devName[lang]}
                    </Typography>
                    <Typography variant="caption">
                      {northCoast.Location[lang]}
                    </Typography>
                    {northCoast.price && (
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {` ${northCoast.price} EGP `}
                        <span
                          style={{ fontWeight: "normal", fontSize: "14px" }}
                        >
                          Price
                        </span>
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgb(100, 100, 100)",
                        paddingTop: "4px",
                        fontSize: "14px",
                      }}
                    >
                      {`
                                  ${lang === "ar" ? "متاح" : "Available"}
                            ${
                              lang === "ar"
                                ? `من ${new Date(
                                    northCoast.startDate
                                  ).toLocaleDateString("ar-EG", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })} إلى ${new Date(
                                    northCoast.endDate
                                  ).toLocaleDateString("ar-EG", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}`
                                : `From ${new Date(
                                    northCoast.startDate
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })} to ${new Date(
                                    northCoast.endDate
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}`
                            }`}
                    </Typography>
                  </Stack>
                  <Stack>
                    <ContactUsBtn
                      sectionName="New-Launch"
                      sectionData={northCoast}
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
                {northCoast.Dis[lang]}
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

export default NorthCoastProjectsDetails;
