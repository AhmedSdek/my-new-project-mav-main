import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import ContactUsIcon from "../../comp/Contact Us/ContactUsIcon";
import MavLoading from "../../comp/Loading/MavLoading";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import ReactMarkdown from "react-markdown";
import ReactLoading from "react-loading";

export default function DeveloperDetails() {
  const { devId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();

  const [developer, setDeveloper] = useState(null);
  const [compounds, setCompounds] = useState([]);
  console.log(compounds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingcompound, setLoadingcompound] = useState(true);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const docRef = doc(db, "developer", devId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDeveloper({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeveloper();
  }, [devId]);

  useEffect(() => {
    const fetchcompounds = async () => {
      if (!country) return;
      try {
        setLoadingcompound(true);
        const q = query(
          collection(db, "compound"),
          where("countryKey", "==", country.en),
          where("devId", "==", devId)
        );
        const snapshot = await getDocs(q);
        const compoundsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompounds(compoundsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingcompound(false);
      }
    };
    fetchcompounds();
  }, [devId, country]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <MavLoading />
      </Box>
    );
  }

  if (error)
    return (
      <Typography color="error" textAlign="center" sx={{ mt: 10 }}>
        Error: {error}
      </Typography>
    );

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", pb: 10 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e4164 0%, #2a5a8a 100%)",
          pt: 15,
          pb: 10,
          color: "white",
        }}>
        <Container>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems="center">
            <Avatar
              src={developer?.img}
              alt={developer?.devName?.[lang]}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              }}
            />
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {developer?.devName?.[lang]}
              </Typography>
              <Typography
                sx={{
                  opacity: 0.9,
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                {lang === "ar"
                  ? "المطور العقاري المعتمد"
                  : "Certified Real Estate Developer"}
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ mt: -5 }}>
        {developer ? (
          <>
            {/* About Section */}
            <Paper
              elevation={3}
              sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#1e4164",
                  mb: 3,
                  borderBottom: "2px solid #eee",
                  pb: 1,
                }}>
                {lang === "ar"
                  ? `عن ${developer.devName[lang]}`
                  : `About ${developer.devName[lang]}`}
              </Typography>
              <Box sx={{ color: "#555", lineHeight: 1.8, fontSize: "1.05rem" }}>
                <ReactMarkdown
                  children={developer.devDis[lang]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        style={{ whiteSpace: "pre-line", marginBottom: "15px" }}
                        {...props}
                      />
                    ),
                  }}
                />
              </Box>
            </Paper>

            {/* Projects Section */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#1e4164",
                  mb: 4,
                  textAlign: "center",
                }}>
                {lang === "ar" ? "استكشاف المشاريع" : "Explore Projects"}
              </Typography>

              {loadingcompound ? (
                <Stack alignItems="center" sx={{ py: 5 }}>
                  <ReactLoading
                    color="#1e4164"
                    type="spin"
                    height={50}
                    width={50}
                  />
                </Stack>
              ) : compounds.length > 0 ? (
                <Row>
                  {compounds.map((project, index) => (
                    <Col key={index} lg={4} md={6} xs={12} className="mb-5">
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: "20px", // زوايا أكثر نعومة
                          overflow: "hidden",
                          backgroundColor: "#fff",
                          border: "1px solid rgba(0,0,0,0.05)",
                          transition:
                            "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          position: "relative",
                          "&:hover": {
                            transform: "translateY(-12px)",
                            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                            "& img": {
                              transform: "scale(1.1)", // تأثير زووم للصورة عند التحويم
                            },
                            "& .contact-overlay": {
                              opacity: 1,
                              bottom: "20px",
                            },
                          },
                        }}>
                        <Link
                          to={`/developers/${devId}/${project.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}>
                          {/* Container الصورة مع Badge الموقع */}
                          <Box
                            sx={{
                              height: 260,
                              overflow: "hidden",
                              position: "relative",
                            }}>
                            <img
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                transition: "transform 0.6s ease",
                              }}
                              src={project.compoundImgs[0]}
                              alt={project.compoundName[lang]}
                            />

                            {/* Badge الموقع فوق الصورة بشكل أنيق */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 15,
                                left: 15,
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                backdropFilter: "blur(5px)",
                                padding: "5px 12px",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              }}>
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: "bold", color: "#1e4164" }}>
                                📍 {project.Location[lang]}
                              </Typography>
                            </Box>

                            {/* تدرج لوني أسفل الصورة ليظهر النص بوضوح */}
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "50%",
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                p: 3,
                              }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "white",
                                  fontWeight: "800",
                                  fontSize: "1.2rem",
                                  lineHeight: 1.2,
                                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                }}>
                                {project.compoundName[lang]}
                              </Typography>
                            </Box>
                          </Box>

                          <CardContent sx={{ p: 3, backgroundColor: "#fff" }}>
                            <Stack spacing={1}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#666",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  fontSize: "0.9rem",
                                  minHeight: "40px",
                                }}>
                                {/* يمكنك هنا وضع وصف قصير أو تفاصيل إضافية */}
                                {lang === "ar"
                                  ? "استكشف تفاصيل المشروع والوحدات المتاحة"
                                  : "Explore project details and available units"}
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Link>

                        <Divider sx={{ opacity: 0.6, mx: 2 }} />

                        {/* منطقة أزرار التواصل بتنسيق أنيق */}
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#fcfcfc",
                          }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "#999", fontWeight: "bold" }}>
                            {lang === "ar" ? "تواصل الآن" : "Contact Now"}
                          </Typography>
                          <Box
                            sx={{
                              transition: "0.3s",
                              "&:hover": { transform: "scale(1.1)" },
                            }}>
                            <ContactUsIcon
                              sectionName="Developer"
                              sectionData={project}
                            />
                          </Box>
                        </Box>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Paper sx={{ p: 10, textAlign: "center", borderRadius: 4 }}>
                  <Typography variant="h6" color="textSecondary">
                    {lang === "ar"
                      ? "لا توجد مشاريع متاحة حالياً"
                      : `No projects found in ${country?.[lang]}`}
                  </Typography>
                </Paper>
              )}
            </Box>
          </>
        ) : (
          <Stack sx={{ py: 20, alignItems: "center" }}>
            <Typography variant="h4" fontWeight="bold">
              Oops, Data not Found
            </Typography>
          </Stack>
        )}
      </Container>
    </Box>
  );
}