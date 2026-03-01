import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import { Link } from "react-router-dom";
import MavLoading from "../../comp/Loading/MavLoading";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function NewLaunches() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === "ar";
  const { country } = useGlobal();
  const [newlaunch, setNewlaunch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewlaunch = async () => {
      try {
        const q = query(
          collection(db, "newlaunch"),
          where("countryKey", "==", country.en)
        );
        const snapshot = await getDocs(q);
        const newlaunchData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewlaunch(newlaunchData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewlaunch();
  }, [country]);

  if (error)
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error">حدث خطأ: {error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#fcfcfc", minHeight: "100vh", pb: 10 }}>
      {loading ? (
        <Stack
          sx={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <MavLoading />
        </Stack>
      ) : (
        <Container maxWidth="lg">
          {/* Header Section */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              pt: 12,
              pb: 6,
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#ff6e19",
                  fontWeight: 900,
                  letterSpacing: 2,
                  fontSize: "0.9rem",
                }}>
                {isAr ? "اكتشف الجديد" : "DISCOVER THE FUTURE"}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  color: "#1e4164",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  mb: 1,
                }}>
                Explore New <span style={{ color: "#ff6e19" }}>Launches</span>
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "text.secondary", fontWeight: 400 }}>
                {isAr
                  ? "كن أول من يحجز وحدته الفاخرة"
                  : "Be the first one to reserve your luxury unit"}
              </Typography>
            </Box>
            <ContactUsBtn sectionName="New-Launch" />
          </Stack>

          <Divider sx={{ mb: 6, opacity: 0.6 }} />

          {/* Listings Section */}
          {newlaunch.length > 0 ? (
            <>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  fontWeight: 800,
                  color: "#1e4164",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    bgcolor: "#ff6e19",
                    borderRadius: 1,
                  }}
                />
                {isAr ? "انطلاقات قريباً" : "Launching Soon"}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  // هنا نحدد عدد الأعمدة: 1 في الموبايل، 2 في التابلت، 3 في الشاشات الكبيرة
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 4, // المسافة بين الكروت (تساوي spacing={4})
                  alignItems: "stretch", // يضمن أن كل العناصر في نفس الصف لها نفس الارتفاع
                }}>
                {newlaunch.map((itm) => (
                  <Link
                    key={itm.id}
                    to={`/newlaunches/${itm.id}`}
                    style={{
                      textDecoration: "none",
                      display: "flex", // ضروري جداً لجعل الرابط يمتد
                      flexDirection: "column",
                    }}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%", // سيجبر الكارت على أخذ كامل ارتفاع الخلية في CSS Grid
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease-in-out",
                        border: "1px solid #f0f0f0",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                        },
                      }}>
                      {/* حاوي الصورة */}
                      <Box sx={{ height: "240px", position: "relative" }}>
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={itm.img[0]}
                          alt={itm.launchName[lang]}
                        />
                        <Chip
                          label={isAr ? "جديد" : "New Launch"}
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            bgcolor: "rgba(30, 65, 100, 0.9)",
                            color: "white",
                            fontWeight: "bold",
                            backdropFilter: "blur(4px)",
                          }}
                        />
                      </Box>

                      {/* محتوى الكارت */}
                      <CardContent
                        sx={{
                          p: 3,
                          flexGrow: 1, // يجعل المحتوى يملأ المساحة المتبقية
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              color: "#1e4164",
                              mb: 1,
                              // توحيد ارتفاع العنوان لضمان توازي باقي العناصر
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              minHeight: "2.8em",
                            }}>
                            {itm.launchName[lang]}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{
                              alignItems: "center",
                              mb: 2,
                              color: "text.secondary",
                            }}>
                            <LocationOnIcon
                              sx={{ fontSize: "1rem", color: "#ff6e19" }}
                            />
                            <Typography variant="body2" noWrap>
                              {itm.Location[lang]}
                            </Typography>
                          </Stack>
                        </Box>

                        {itm.price && (
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.disabled",
                                  display: "block",
                                }}>
                                {isAr ? "يبدأ من" : "Starting Price"}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 900, color: "#ff6e19" }}>
                                {Number(itm.price).toLocaleString()}{" "}
                                <Typography component="span" variant="caption">
                                  EGP
                                </Typography>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                border: "1px solid #eee",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}>
                              →
                            </Box>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </Box>
            </>
          ) : (
            <Stack sx={{ py: 10, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                {lang === "en"
                  ? `No Projects in ${country.en}`
                  : `لا يوجد مشاريع في ${country.ar}`}
              </Typography>
            </Stack>
          )}

          {/* SEO Content Section */}
          <Box
            sx={{
              mt: 12,
              p: { xs: 4, md: 8 },
              bgcolor: "#1e4164",
              borderRadius: "40px",
              color: "white",
              boxShadow: "0 20px 50px rgba(30, 65, 100, 0.2)",
            }}>
            {/* العنوان الرئيسي للقسم */}
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, mb: 4, color: "#ff6e19" }}>
              {isAr ? "ما يجب أن تعرفه" : "You Need To Know"}
            </Typography>

            <Grid container spacing={6}>
              {/* العمود الأول */}
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                      Real Estate Egypt Launches
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        opacity: 0.85,
                        lineHeight: 1.8,
                        fontSize: "1.05rem",
                      }}>
                      Whether searching for a new home or looking for the next
                      lucrative investment opportunity, new launches in the
                      Egyptian real estate market are the right choice for you.
                      The market has been booming for decades with no signs of
                      slowing down.
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.85, lineHeight: 1.8 }}>
                    This is clearly seen in the abundance of new launches all
                    over the country. In fact, most real estate companies in
                    Egypt have added new projects and compounds to their
                    portfolios in the past couple of years.
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.85, lineHeight: 1.8 }}>
                    Purchasing a property in a newly launched project may seem
                    like a risk, however, with the array of advantages they
                    offer, it is a smart choice.
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: "#ff6e19", fontWeight: "bold" }}>
                    Through Nawy, you can learn more about newly launched
                    projects in the Egyptian real estate market and effortlessly
                    buy your future home.
                  </Typography>
                </Stack>
              </Grid>

              {/* العمود الثاني */}
              <Grid item xs={12} md={6}>
                <Stack spacing={4}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, mb: 2, color: "#ff6e19" }}>
                      What are the Advantages of Getting a Home in a Newly
                      Launched Compound?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                      Benefits of buying a property in a new launch in one of
                      the compounds include:
                    </Typography>
                    <Stack spacing={1.5}>
                      {[
                        "Having access to better prices and deals",
                        "Picking the most suitable location",
                        "Being the first to move in",
                      ].map((text, i) => (
                        <Stack
                          key={i}
                          direction="row"
                          spacing={2}
                          alignItems="center">
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor: "#ff6e19",
                              borderRadius: "50%",
                            }}
                          />
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {text}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderRadius: "20px",
                      borderLeft: "4px solid #ff6e19",
                    }}>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", opacity: 0.8 }}>
                      Usually, real estate companies start by collecting
                      expressions of interest (EOI) on the first phase of a
                      project before they start selling the properties listed.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, mb: 1.5, color: "#ff6e19" }}>
                      What are Real Estate Expressions of Interest (EOI)?
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.85, lineHeight: 1.7 }}>
                      An expression of interest (EOI) is an amount of money, set
                      by the real estate developer of the gated community, that
                      shows a customer is interested in purchasing a property.
                      Generally, each property type has its own EOI and they are
                      collected before the construction commences.
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      pt: 2,
                    }}>
                    Here arises the question of where you should consider
                    purchasing a home. In other words, which areas in Egypt are
                    the best to live in?
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </Box>
  );
}

export default NewLaunches;