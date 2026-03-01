import React, { useEffect, useState, useMemo, forwardRef } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useTranslation } from "react-i18next";

// UI Components (MUI)
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Avatar,
  Chip,
  Dialog,
  DialogContent,
  Slide,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Col, Row } from "react-bootstrap";

// Icons & Plugins
import {
  ArrowCircleRight,
  Close,
  LocationOn,
  Share,
  Calculate,
  CurrencyExchange,
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillTransfer,
  faMoneyCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import ReactMarkdown from "react-markdown";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";

// Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";

// Internal Components
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import MavLoading from "../../comp/Loading/MavLoading";

// --- Styled Components ---
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "20px",
  border: "1px solid #f0f0f0",
  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
  overflow: "hidden",
}));

const FeatureCard = styled(StyledPaper)({
  padding: "24px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 30px rgba(30,65,100,0.08)",
  },
});

const PriceSidebar = styled(StyledPaper)(({ theme }) => ({
  padding: "32px",
  position: "sticky",
  top: "100px",
  background: "#fff",
  zIndex: 10,
}));

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

// --- Helper Components ---
const Controls = ({ isRtl }) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
      }}>
      <Button
        variant="contained"
        onClick={() => zoomIn()}
        sx={{ bgcolor: "rgba(30,65,100,0.9)" }}>
        +
      </Button>
      <Button
        variant="contained"
        onClick={() => resetTransform()}
        sx={{ bgcolor: "rgba(30,65,100,0.9)" }}>
        {isRtl ? "إعادة" : "Reset"}
      </Button>
      <Button
        variant="contained"
        onClick={() => zoomOut()}
        sx={{ bgcolor: "rgba(30,65,100,0.9)" }}>
        -
      </Button>
    </Stack>
  );
};

function DealDetails() {
  const { dealId } = useParams();
  const { i18n, t } = useTranslation();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("EGP");
  const [modalState, setModalState] = useState({
    master: false,
    layout: false,
    img: false,
    src: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isRtl = i18n.language === "ar";
  const lang = i18n.language;
  const exchangeRate = 50; // يمكن جلبها من API مستقبلاً

  // --- Logic ---
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const docSnap = await getDoc(doc(db, "deals", dealId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDeal({ id: docSnap.id, ...data });
          if (data.monyType?.en === "dollar") setCurrency("USD");
        }
      } catch (err) {
        console.error("Error fetching deal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [dealId]);

  const monthlyInstallment = useMemo(() => {
    if (deal?.remaining && deal?.month) {
      const remaining = parseFloat(deal.remaining.replace(/,/g, ""));
      return Math.round(remaining / parseInt(deal.month));
    }
    return null;
  }, [deal]);

  const formatCurrency = (amount, type = "EGP") => {
    return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleShare = async () => {
    const shareData = {
      title: deal?.compoundName?.[lang],
      url: window.location.href,
    };
    try {
      if (
        navigator.share &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      ) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({
          open: true,
          message: isRtl ? "تم نسخ الرابط!" : "Link copied!",
          severity: "success",
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <MavLoading />
      </Box>
    );
  if (!deal)
    return (
      <Typography textAlign="center" mt={10} variant="h5" color="error">
        {isRtl ? "العرض غير موجود" : "Deal not found"}
      </Typography>
    );

  return (
    <Box
      sx={{ bgcolor: "#fafafa", pb: 10, minHeight: "100vh" }}
      dir={isRtl ? "rtl" : "ltr"}>
      {/* 1. Hero Gallery */}
      <Box sx={{ mt: "80px", mb: 6 }}>
        <Container>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2.2 } }}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Navigation, Pagination]}
            style={{ borderRadius: "24px" }}>
            {deal.img?.map((el, index) => (
              <SwiperSlide key={index}>
                <Box
                  component="img"
                  src={el}
                  onClick={() =>
                    setModalState({ ...modalState, img: true, src: el })
                  }
                  sx={{
                    width: "100%",
                    height: "450px",
                    objectFit: "cover",
                    cursor: "zoom-in",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Row className="gy-5">
          <Col lg={8}>
            {/* 2. Header Info */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems="center"
              sx={{ mb: 4 }}>
              <Avatar
                src={deal.devIcon}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid #fff",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                }}
              />
              <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "inherit" } }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent={{ xs: "center", sm: "flex-start" }}>
                  <Typography variant="h4" fontWeight="800" color="#1e4164">
                    {isRtl
                      ? `${deal.Type?.ar} في ${deal.compoundName?.ar}`
                      : `${deal.Type?.en} in ${deal.compoundName?.en}`}
                  </Typography>
                  <IconButton onClick={handleShare} sx={{ bgcolor: "#f0f0f0" }}>
                    <Share fontSize="small" />
                  </IconButton>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  sx={{ mt: 1, color: "text.secondary" }}>
                  <LocationOn color="warning" />
                  <Typography variant="subtitle1">
                    {deal.Location?.[lang]}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* 3. Specifications Table */}
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              color="#1e4164">
              {isRtl ? "تفاصيل الوحدة" : "Unit Details"}
            </Typography>
            <TableContainer component={StyledPaper} sx={{ mb: 5 }}>
              <Table>
                <TableBody>
                  {[
                    {
                      label: isRtl ? "رقم المرجع" : "Ref No.",
                      value: deal.refNum,
                    },
                    {
                      label: isRtl ? "المطور" : "Developer",
                      value: (
                        <Link
                          to={`/developers/${deal.devId}`}
                          style={{
                            color: "#ff914d",
                            textDecoration: "none",
                            fontWeight: "bold",
                          }}>
                          {deal.developer?.devName?.[lang]}{" "}
                          <ArrowCircleRight
                            sx={{
                              fontSize: 16,
                              transform: isRtl ? "rotate(180deg)" : "none",
                            }}
                          />
                        </Link>
                      ),
                    },
                    {
                      label: isRtl ? "المساحة" : "Area",
                      value: `${deal.Area} m²`,
                    },
                    {
                      label: isRtl ? "الدور" : "Floor",
                      value: deal.floor?.[lang],
                    },
                    {
                      label: isRtl ? "الغرف" : "Beds",
                      value: deal.Bed?.[lang],
                    },
                    {
                      label: isRtl ? "الحمامات" : "Baths",
                      value: deal.Bath?.[lang],
                    },
                    {
                      label: isRtl ? "الاستلام" : "Delivery",
                      value: deal.delivery?.[lang],
                    },
                  ].map(
                    (row, i) =>
                      row.value && (
                        <TableRow
                          key={i}
                          sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}>
                          <TableCell sx={{ fontWeight: 600, color: "#666" }}>
                            {row.label}
                          </TableCell>
                          <TableCell
                            align={isRtl ? "right" : "left"}
                            sx={{ fontWeight: 700 }}>
                            {row.value}
                          </TableCell>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 4. Payment Plan */}
            {deal.Sale?.en === "Resale" && (
              <Box sx={{ mb: 5 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "#1e4164" }}>
                  {isRtl ? "خطة الدفع" : "Payment Plan"}
                </Typography>
                <FeatureCard>
                  <Row className="text-center gy-4">
                    <Col xs={4}>
                      <FontAwesomeIcon
                        icon={faMoneyBillTransfer}
                        color="#ff914d"
                        size="lg"
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}>
                        {isRtl ? "المقدم" : "Down Payment"}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(deal.downPayment)}
                      </Typography>
                    </Col>
                    <Col
                      xs={4}
                      style={{
                        borderLeft: "1px solid #eee",
                        borderRight: "1px solid #eee",
                      }}>
                      <FontAwesomeIcon
                        icon={faMoneyCheck}
                        color="#1e4164"
                        size="lg"
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}>
                        {isRtl ? "المتبقي" : "Remaining"}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(deal.remaining)}
                      </Typography>
                    </Col>
                    <Col xs={4}>
                      <Calculate sx={{ color: "#4caf50" }} />
                      <Typography variant="caption" display="block">
                        {isRtl ? "قسط شهري" : "Monthly"}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="green">
                        {formatCurrency(monthlyInstallment)}
                      </Typography>
                      <Chip
                        label={`${deal.month} M`}
                        size="small"
                        sx={{ mt: 0.5, fontSize: "10px" }}
                      />
                    </Col>
                  </Row>
                </FeatureCard>
              </Box>
            )}

            {/* 5. Plans Buttons */}
            <Stack direction="row" spacing={2} sx={{ mb: 5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setModalState({ ...modalState, master: true })}
                sx={{
                  borderRadius: "12px",
                  p: 1.5,
                  borderColor: "#1e4164",
                  color: "#1e4164",
                }}>
                {isRtl ? "المخطط العام" : "Master Plan"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setModalState({ ...modalState, layout: true })}
                sx={{
                  borderRadius: "12px",
                  p: 1.5,
                  borderColor: "#ff914d",
                  color: "#ff914d",
                }}>
                {isRtl ? "تقسيم الوحدة" : "Unit Layout"}
              </Button>
            </Stack>
            {console.log(deal.Dis)}
            {/* 6. Description - لن يظهر إلا إذا كان هناك نص باللغة المختارة */}
            {deal.Dis?.[lang] && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="#1e4164">
                  {isRtl ? "وصف العقار" : "Description"}
                </Typography>
                <StyledPaper sx={{ p: 3, bgcolor: "#fff" }}>
                  <Box
                    className="markdown-body"
                    sx={{
                      lineHeight: 1.8,
                      color: "#444",
                      textAlign: isRtl ? "right" : "left", // لضمان اتجاه النص حسب اللغة
                    }}>
                    <ReactMarkdown>{deal.Dis[lang]}</ReactMarkdown>
                  </Box>
                </StyledPaper>
              </Box>
            )}
          </Col>

          {/* 7. Sidebar (Desktop) */}
          <Col lg={4}>
            <PriceSidebar>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {isRtl ? "السعر الإجمالي" : "Total Price"}
                </Typography>
                <Button
                  size="small"
                  startIcon={<CurrencyExchange />}
                  onClick={() =>
                    setCurrency(currency === "EGP" ? "USD" : "EGP")
                  }
                  sx={{ color: "#ff914d" }}>
                  {currency === "EGP" ? "USD" : "EGP"}
                </Button>
              </Stack>
              <Typography
                variant="h3"
                fontWeight="900"
                color="#1e4164"
                sx={{ mb: 2 }}>
                {currency === "EGP"
                  ? formatCurrency(deal.price)
                  : formatCurrency(deal.price / exchangeRate)}
                <Typography component="span" variant="h5" sx={{ ml: 1 }}>
                  {currency === "USD" ? "$" : isRtl ? "ج.م" : "EGP"}
                </Typography>
              </Typography>

              <ContactUsBtn sectionName="Maverick-Deals" sectionData={deal} />

              <Typography
                variant="caption"
                sx={{
                  mt: 3,
                  display: "block",
                  textAlign: "center",
                  color: "text.secondary",
                }}>
                {isRtl
                  ? "أسعارنا محدثة وتنافسية"
                  : "Our prices are updated & competitive"}
              </Typography>
            </PriceSidebar>
          </Col>
        </Row>
      </Container>

      {/* --- Modals & Dialogs --- */}
      <Dialog
        open={modalState.master}
        onClose={() => setModalState({ ...modalState, master: false })}
        TransitionComponent={Transition}
        maxWidth="lg"
        fullWidth>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setModalState({ ...modalState, master: false })}
            sx={{ position: "absolute", right: 10, top: 10, bgcolor: "#fff" }}>
            <Close />
          </IconButton>
          <img
            src={deal.Masterimg}
            alt="Master Plan"
            style={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }}
          />
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Zoom */}
      <Dialog
        fullScreen
        open={modalState.img}
        onClose={() => setModalState({ ...modalState, img: false })}
        TransitionComponent={Transition}>
        <Box sx={{ bgcolor: "#000", height: "100vh", position: "relative" }}>
          <IconButton
            onClick={() => setModalState({ ...modalState, img: false })}
            sx={{
              position: "absolute",
              right: 20,
              top: 20,
              zIndex: 100,
              bgcolor: "rgba(255,255,255,0.2)",
            }}>
            <Close sx={{ color: "#fff" }} />
          </IconButton>
          <TransformWrapper>
            <Controls isRtl={isRtl} />
            <TransformComponent
              wrapperStyle={{ width: "100vw", height: "100vh" }}>
              <img
                src={modalState.src}
                alt="Zoom"
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "contain",
                }}
              />
            </TransformComponent>
          </TransformWrapper>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DealDetails;
