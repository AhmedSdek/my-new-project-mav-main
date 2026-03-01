import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../../context/GlobalContext";
import ContactUsIcon from "../../../comp/Contact Us/ContactUsIcon";

// استيراد الـ CSS الخاص بـ Swiper
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

function Deals() {
  const [deals, setDeals] = useState([]);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === "ar";
  const [loading, setLoading] = useState(true);
  const { country } = useGlobal();

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "deals"),
          where("countryKey", "==", country.en)
        );
        const snapshot = await getDocs(q);
        const dealsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeals(dealsData);
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [country]);

  // دالة موحدة لتنسيق الأرقام بناءً على اللغة
  const formatNumber = (num) => {
    return new Intl.NumberFormat(isAr ? "ar-EG" : "en-US").format(num);
  };

  // مكون فرعي لعرض حالة التحميل
  const SkeletonCard = () => (
    <Card sx={{ height: 430, borderRadius: 4 }}>
      <Skeleton variant="rectangular" height={215} />
      <CardContent>
        <Skeleton width="60%" height={30} />
        <Skeleton width="40%" />
        <Stack direction="row" spacing={1} sx={{ my: 2 }}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
        </Stack>
        <Skeleton width="50%" height={40} />
      </CardContent>
    </Card>
  );

  return (
    <Box component="section" sx={{ py: 6, direction: isAr ? "rtl" : "ltr" }}>
      <Container>
        {/* Header Section */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1e4164",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}>
            {isAr ? "صفقات مافريك" : "Maverick Deals"}
          </Typography>
          <Link to="/maverickdeals" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#ff914d",
                "&:hover": { textDecoration: "underline" },
              }}>
              {isAr ? "← استكشف الكل" : "Explore All →"}
            </Typography>
          </Link>
        </Stack>

        <Swiper
          modules={[FreeMode, Pagination, Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          freeMode={true}
          loop={deals.length > 3}
          breakpoints={{
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
          }}
          className="mydealSwiper">
          {loading ? (
            [1, 2, 3].map((_, i) => (
              <SwiperSlide key={i}>
                <SkeletonCard />
              </SwiperSlide>
            ))
          ) : deals.length > 0 ? (
            deals.map((col) => (
              <SwiperSlide key={col.id} style={{ paddingBottom: "20px" }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                    },
                  }}>
                  <Link
                    to={`/maverickdeals/${col.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}>
                    {/* Image Box */}
                    <Box sx={{ position: "relative", height: "230px" }}>
                      <img
                        src={col.img[0]}
                        alt={col.compoundName[lang]}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

                      {/* Sale Tag */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 15,
                          left: isAr ? "auto" : 15,
                          right: isAr ? 15 : "auto",
                          backgroundColor: "#ff914d",
                          color: "#1e4164",
                          fontWeight: "bold",
                          px: 2,
                          py: 0.5,
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          boxShadow: 2,
                          zIndex: 3,
                        }}>
                        {col.Sale[lang]}
                      </Box>

                      {/* Sold Out Overlay */}
                      {col.sold?.en === "SOLD OUT" && (
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 2,
                          }}>
                          <Typography
                            sx={{
                              border: "3px solid #ff4d4d",
                              color: "#ff4d4d",
                              fontWeight: "bold",
                              px: 3,
                              py: 1,
                              borderRadius: 2,
                              backgroundColor: "white",
                              transform: isAr
                                ? "rotate(15deg)"
                                : "rotate(-15deg)",
                            }}>
                            {col.sold[lang]}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ pt: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5, color: "#1e4164" }}>
                        {`${col.Type[lang]} ${isAr ? "في" : "in"} ${
                          col.compoundName[lang]
                        }`}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}>
                        📍 {col.Location[lang]}
                      </Typography>

                      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}>
                            {formatNumber(col.Bed.en)} 🛏️
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}>
                            {formatNumber(col.Bath.en)} 🚿
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}>
                            {formatNumber(col.Area)} {isAr ? "م²" : "m²"} 📐
                          </Typography>
                        </Stack>
                      </Stack>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: "#1e4164",
                          display: "flex",
                          alignItems: "baseline",
                          gap: 1,
                        }}>
                        {formatNumber(col.price)}
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "1rem",
                            color: "#ff914d",
                            fontWeight: 600,
                          }}>
                          {col.monyType[lang]}
                        </Typography>
                      </Typography>
                    </CardContent>
                  </Link>

                  <Stack
                    direction="row"
                    justifyContent={isAr ? "flex-start" : "flex-end"}
                    sx={{ p: 2, pt: 0 }}>
                    <ContactUsIcon
                      sectionName={isAr ? "صفقات مافريك" : "Maverick deals"}
                      sectionData={col}
                    />
                  </Stack>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <Stack sx={{ py: 10, textAlign: "center", width: "100%" }}>
              <Typography variant="h6" color="text.secondary">
                {isAr
                  ? `لا توجد صفقات حالياً في ${country[lang]}`
                  : `No deals available in ${country[lang]}`}
              </Typography>
            </Stack>
          )}
        </Swiper>
      </Container>
    </Box>
  );
}

export default Deals;
