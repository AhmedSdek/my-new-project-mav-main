import { Container, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./styles.css";
import ReactLoading from "react-loading";
// import required modules
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";
import MavLoading from "../../../comp/Loading/MavLoading";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useGlobal } from "../../../context/GlobalContext";
import Skeltoon from "../../../comp/skeltoon/Skeltoon";
function NewLaunches() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [newlaunch, setNewlaunch] = useState([]);
  // console.log(newlaunch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { country } = useGlobal();

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
  return (
    <section style={{ margin: "25px 0" }}>
      <Container>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>
            {lang === "ar" ? "يطرح الآن" : "Launches Now"}
          </Typography>
          <Link to="/newlaunches">
            <Typography sx={{ fontWeight: "bold" }}>
              {lang === "ar" ? "استكشف الكل" : "Explore All"}
            </Typography>
          </Link>
        </Stack>
        {loading ? (
          <Skeltoon
            Xs={1}
            Sm={2}
            Md={3}
            lg={3}
            height={225}
            width={393}
            variant="rounded"
          />
        ) : newlaunch && newlaunch.length > 0 ? (
          <Stack>
            <Swiper
              spaceBetween={10}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              breakpoints={{
                600: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                900: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
              }}
              freeMode={true}
              loop={true}
              modules={[FreeMode, Pagination, Autoplay]}
              className="myLaunchSwiper"
            >
              {newlaunch.map((item, index) => {
                console.log(item);
                return (
                  <div key={item}>
                    <SwiperSlide key={index} style={{ height: "100%" }}>
                      <Link
                        aria-label={item.launchName[lang]}
                        style={{ width: "393px", height: "225px" }}
                        to={`/newlaunches/${item.id}`}
                      >
                        <picture>
                          <img
                            style={{ borderRadius: "8px" }}
                            src={item.img[0]}
                            sizes="(min-width: 600px) 50vw, 100vw"
                            alt={item.launchName[lang]}
                          />
                        </picture>
                      </Link>
                    </SwiperSlide>
                  </div>
                );
              })}
            </Swiper>
          </Stack>
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

export default NewLaunches;
