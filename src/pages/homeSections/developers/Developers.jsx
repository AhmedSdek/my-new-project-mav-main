import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./slider.css";
// import required modules
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Container, Stack, Typography } from "@mui/material";
import { useGlobal } from "../../../context/GlobalContext";
import ReactLoading from "react-loading";
import { useTranslation } from "react-i18next";
import Skeltoon from "../../../comp/skeltoon/Skeltoon";

export default function Developers() {
  const [developers, setDevelopers] = useState([]);
  // console.log(developers);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { country } = useGlobal();
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const q = query(
          collection(db, "developer"),
          where("country.en", "==", country.en)
        );
        const snapshot = await getDocs(q);
        const developersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevelopers(developersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, [country]);
  if (error) return <p>حدث خطأ: {error}</p>;
  return (
    <section className="slider-section">
      <Container>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>
            {lang === "ar" ? "المطورين" : "Developers"}
          </Typography>
          <Link to="/developers">
            <Typography sx={{ fontWeight: "bold" }}>
              {lang === "ar" ? "استكشف الكل" : "Explore All"}
            </Typography>
          </Link>
        </Stack>
        {loading ? (
          <Skeltoon
            Xs={2}
            Sm={2}
            Md={3}
            lg={4}
            height={126}
            width={126}
            variant="circular"
          />
        ) : developers && developers.length > 0 ? (
          <Swiper
            slidesPerView={7}
            freeMode={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Autoplay, Pagination, Navigation, FreeMode]}
            className="mySwiper1"
            breakpoints={{
              200: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              // when window width is >= 480px
              767: {
                slidesPerView: 5,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 6,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 8,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              1400: {
                slidesPerView: 8,
                spaceBetween: 20,
              },
            }}
          >
            {developers.map((item, index) => {
              return (
                <SwiperSlide
                  className="swiper-slide1"
                  key={index}
                  style={{ borderRadius: "50%" }}
                >
                  <Link
                    style={{
                      display: "block",
                      width: "126px",
                      height: "126px",
                    }}
                    aria-label={
                      lang === "ar" ? item.devName.ar : item.devName.en
                    }
                    to={`/developers/${item.id}`}
                  >
                    <img
                      className="slidImg sm-shadow w-shadow mx-auto bg-white rounded-circle p-md-2 p-1 img-fluid"
                      src={item.img[0]}
                      alt={lang === "ar" ? item.devName.ar : item.devName.en}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover", // يحافظ على aspect ratio بدون تشويه
                      }}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              minHeight: "150px",
            }}
          >
            <Typography>No Data in {country[lang]}</Typography>
          </Stack>
        )}
      </Container>
    </section>
  );
}
