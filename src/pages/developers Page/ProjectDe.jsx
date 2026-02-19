import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  Grid,
  Modal,
  IconButton,
  Chip,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import {
  KingBed,
  Bathtub,
  SquareFoot,
  LocationOn,
  ChevronRight,
  Close,
  ZoomIn,
  ZoomOut,
  RestartAlt,
  LocalOffer,
  Info,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

// Components
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import ContactUsIcon from "../../comp/Contact Us/ContactUsIcon";
import MavLoading from "../../comp/Loading/MavLoading";

// Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        position: "absolute",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        bgcolor: "rgba(0,0,0,0.6)",
        borderRadius: "30px",
        px: 2,
        py: 0.5,
        backdropFilter: "blur(4px)",
      }}>
      <IconButton onClick={() => zoomIn()} sx={{ color: "white" }}>
        <ZoomIn />
      </IconButton>
      <IconButton onClick={() => zoomOut()} sx={{ color: "white" }}>
        <ZoomOut />
      </IconButton>
      <IconButton onClick={() => resetTransform()} sx={{ color: "white" }}>
        <RestartAlt />
      </IconButton>
    </Stack>
  );
};

function ProjectDe() {
  const { devId, projId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "compound", projId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompound({ id: docSnap.id, ...docSnap.data() });
        }

        const q = query(
          collection(db, "inventory"),
          where("compoundId", "==", projId)
        );
        const snapshot = await getDocs(q);
        setRelatedProjects(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projId]);

  const handleOpenImg = (url) => {
    if (url) {
      setActiveImg(url);
      setOpen(true);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}>
        <MavLoading />
      </Box>
    );

  return (
    <Box sx={{ mt: "80px", pb: 10, backgroundColor: "#fdfdfd" }}>
      <Container>
        {/* 1. Image Gallery */}
        <Swiper
          spaceBetween={15}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2.5 } }}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Navigation, Pagination]}
          style={{
            marginBottom: "30px",
            borderRadius: "16px",
            overflow: "hidden",
          }}>
          {compound?.compoundImgs?.map((img, index) => (
            <SwiperSlide key={index}>
              <Box
                component="img"
                src={img}
                onClick={() => handleOpenImg(img)}
                sx={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  cursor: "zoom-in",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 2. Header Info */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}>
              <Box
                component="img"
                src={compound?.devIcon}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "12px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  p: 0.5,
                }}
              />
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#1a237e",
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                  }}>
                  {compound?.compoundName[lang]}
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  color="text.secondary">
                  <LocationOn fontSize="small" />
                  <Typography variant="body1">
                    {compound?.Location[lang]}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Offers Section */}
            {compound?.offers?.map((off, i) => (
              <Chip
                key={i}
                icon={<LocalOffer sx={{ color: "white !important" }} />}
                label={`${off.offer} - ${off.pers}% DP - ${off.year} Years`}
                sx={{
                  bgcolor: "#d32f2f",
                  color: "white",
                  fontWeight: "bold",
                  mb: 2,
                  px: 1,
                }}
              />
            ))}
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#ff914d" }}>
              {Intl.NumberFormat().format(compound?.price)}
              <Typography component="span" variant="h6" sx={{ ml: 1 }}>
                {compound?.monyType[lang]}
              </Typography>
            </Typography>
            <Box sx={{ mt: 2 }}>
              <ContactUsBtn sectionName="Compound" sectionData={compound} />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* 3. Detailed Description & Masterplan Button */}
        <Grid container spacing={5}>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}>
              <Info color="primary" />{" "}
              {lang === "ar" ? "عن المشروع" : "About Project"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: "#444",
                whiteSpace: "pre-line",
                mb: 4,
              }}>
              {compound?.compoundDes[lang]}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {lang === "ar" ? "المرافق والخدمات" : "Amenities"}
            </Typography>
            <Grid container spacing={1}>
              {compound?.aminatis?.map((ami, i) => (
                <Grid item key={i}>
                  <Chip
                    label={ami[lang]}
                    variant="outlined"
                    sx={{ borderRadius: "8px", bgcolor: "#f0f4f8" }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: "#1a237e",
                color: "white",
                position: "sticky",
                top: 100,
              }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Master Plan
              </Typography>
              <Box
                component="img"
                src={compound?.masterplanImg?.[0]}
                sx={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  mb: 2,
                  opacity: 0.8,
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleOpenImg(compound?.masterplanImg?.[0])}
                sx={{
                  bgcolor: "#ff914d",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#e87e3c" },
                }}>
                View Master Plan
              </Button>

              <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>
                Property Types
              </Typography>
              <Stack spacing={1}>
                {compound?.type?.map((t, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ChevronRight fontSize="small" /> {t[lang]}
                  </Typography>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* 4. Properties List */}
        {relatedProjects.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 4, textAlign: "center" }}>
              Available Units in {compound?.compoundName[lang]}
            </Typography>
            <Grid container spacing={3}>
              {relatedProjects.map((item) => (
                <Grid item xs={12} sm={6} lg={4} key={item.id}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}>
                    <Link
                      to={`/developers/${devId}/${projId}/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}>
                      <Box
                        component="img"
                        src={item.img[0]}
                        sx={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1 }}>
                          {item.Type[lang]}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ mb: 2, color: "text.secondary" }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}>
                            <KingBed fontSize="small" />
                            <Typography variant="caption">
                              {item.Bed[lang]}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}>
                            <Bathtub fontSize="small" />
                            <Typography variant="caption">
                              {item.Bath[lang]}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}>
                            <SquareFoot fontSize="small" />
                            <Typography variant="caption">
                              {item.Area} m²
                            </Typography>
                          </Stack>
                        </Stack>
                        <Divider />
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: 2 }}>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: 800 }}>
                            {Intl.NumberFormat().format(item.price)}{" "}
                            <Typography component="span" variant="caption">
                              {item.monyType?.en === "dollar" ? "$" : "EGP"}
                            </Typography>
                          </Typography>
                          <ContactUsIcon
                            sectionName="inventory"
                            sectionData={item}
                          />
                        </Stack>
                      </CardContent>
                    </Link>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Fullscreen Zoom Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0,0,0,0.9)",
        }}>
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "white",
              zIndex: 20,
              bgcolor: "rgba(255,255,255,0.1)",
            }}>
            <Close fontSize="large" />
          </IconButton>
          <TransformWrapper initialScale={1} centerOnInit>
            <Controls />
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}>
              <Box
                component="img"
                src={activeImg}
                sx={{ width: "100vw", height: "100vh", objectFit: "contain" }}
              />
            </TransformComponent>
          </TransformWrapper>
        </Box>
      </Modal>
    </Box>
  );
}

export default ProjectDe;