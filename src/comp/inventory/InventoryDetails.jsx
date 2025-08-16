import { doc, getDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { db } from "../../firebase/config";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./styles.css";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import ContactUsBtn from "../Contact Us/ContactUsBtn";
import { useEffect, useState } from "react";
import { ArrowCircleRight, Close } from "@mui/icons-material";
import MavLoading from "../Loading/MavLoading";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillTransfer,
  faMoneyCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";

function InventoryDetails() {
  const [open, setOpen] = useState(false);
  const [openlay, setOpenLay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();
  const [inventory, setInventory] = useState({});
  console.log(inventory);
  let { compId } = useParams();
  console.log(compId);
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const docRef = doc(db, "inventory", compId);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap);
        setInventory({ id: docSnap.id, ...docSnap.data() });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [compId]);
  const [imgsrc, setImgsrc] = useState("");
  const [imgopen, setImgopen] = useState(false);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
      <Stack
        sx={{ flexDirection: "row", gap: 2, position: "absolute", top: "60px" }}
        className="tools"
      >
        <Button
          variant="contained"
          sx={{ minWidth: "initial" }}
          onClick={() => zoomIn()}
        >
          +
        </Button>
        <Button
          variant="contained"
          sx={{ minWidth: "initial" }}
          onClick={() => zoomOut()}
        >
          -
        </Button>
        <Button
          variant="contained"
          sx={{ minWidth: "initial" }}
          onClick={() => resetTransform()}
        >
          x
        </Button>
      </Stack>
    );
  };
  // if (loading) return <p className="text-blue-600">جاري التحميل...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <MavLoading />
      </div>
    );
  }
  return (
    <Box
      sx={{
        marginTop: "40px",
        padding: "15px 0",
        position: "relative",
        minHeight: "calc(100vh - 100px)",
      }}
    >
      <Container>
        <Stack sx={{ flexDirection: "row", gap: "10px" }}>
          <Swiper
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            centeredSlides={true}
            loop={true}
            breakpoints={{
              200: {
                slidesPerView: 1,
                // slidesPerGroup: 1,
                // spaceBetween: 20,
              },
              // when window width is >= 480px
              767: {
                slidesPerView: 3,
                // slidesPerGroup: 1,
                // spaceBetween: 300,
              },
              992: {
                slidesPerView: 3,
                // slidesPerView: 8,
                // slidesPerGroup: 1,
                // spaceBetween: 20
              },
              1200: {
                // slidesPerView: 8,
                // slidesPerGroup: 1,
                // spaceBetween: 20
              },
              1400: {
                // slidesPerView: 8,
                // spaceBetween: 20
              },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[FreeMode, Pagination, Navigation, Autoplay]}
            className="mySwiper2"
          >
            {inventory.img.map((el, index) => {
              return (
                <SwiperSlide key={index}>
                  <img
                    onClick={() => {
                      setImgsrc(el);
                      setImgopen(true);
                    }}
                    style={{ cursor: "pointer" }}
                    src={el}
                    alt={inventory.compoundName[lang]}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
      </Container>
      <Container>
        <Row>
          <Col>
            <Stack
              sx={{
                lineHeight: "1",
                margin: "10px 0 40px",
                position: "relative",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Stack>
                <img
                  style={{
                    width: "100px",
                    boxShadow: "0 -1px 15px -3px rgba(0, 0, 0, 0.2)",
                    borderRadius: "50%",
                  }}
                  src={inventory.icon}
                  alt=""
                />
              </Stack>
              <Stack sx={{ width: "100%", gap: 2 }}>
                <Stack
                  sx={{
                    flexDirection: {
                      lg: "row",
                      md: "row",
                      sm: "column",
                      xs: "column",
                    },
                    justifyContent: {
                      lg: "space-between",
                      md: "space-between",
                      sm: "center",
                      xs: "center",
                    },
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Stack sx={{ gap: 1 }}>
                    <Typography
                      component="h2"
                      variant="h5"
                      sx={{
                        color: "rgb(30, 65, 100)",
                        lineHeight: "1",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {`${inventory.Type[lang]} in ${inventory.compoundName[lang]}`}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      backgroundColor: " rgb(255 145 77)",
                      color: "#1e4164",
                      borderRadius: "8px",
                      padding: "3px 8px",
                      lineHeight: "1",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontWeight: "bold", padding: "8px" }}>
                      {`${inventory.Sale[lang]}`}
                    </p>
                  </Box>
                </Stack>

                <Stack
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      margin: "10px 0 !important",
                      color: "black",
                    }}
                  >
                    {`${Intl.NumberFormat("en-US").format(inventory.price)} ${
                      inventory.monyType.en === "dollar"
                        ? lang === "ar"
                          ? "دولار"
                          : "$"
                        : lang === "ar"
                        ? "جم"
                        : "EGP"
                    }`}

                    {inventory.status === "Rent" && (
                      <Typography
                        variant="caption"
                        sx={{ lineHeight: "1", color: "#1E4164" }}
                      >
                        Per month
                      </Typography>
                    )}
                  </Typography>
                  <ContactUsBtn
                    sectionName="Maverick-Deals"
                    sectionData={inventory}
                  />
                </Stack>
              </Stack>
            </Stack>
            <hr />

            <Stack sx={{ marginBottom: "15px" }}>
              <TableContainer
                sx={{ width: { lg: "60%", md: "100%" } }}
                component={Paper}
              >
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#1e4164 !important",
                        }}
                        colSpan={2}
                      ></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow sx={{ color: "#1e4164" }}>
                      <StyledTableCell component="th" scope="row">
                        Reference N0.
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {inventory.refNum}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Compound
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {inventory.compoundName[lang]}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Developer
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Link to={`/developers/${inventory.devId}`}>
                          {inventory.developer.devName[lang]}
                          <ArrowCircleRight sx={{ fontSize: "18px" }} />
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>

                    {inventory.floor && (
                      <StyledTableRow>
                        <StyledTableCell component="th" scope="row">
                          Floor
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {inventory.floor[lang]}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                    {inventory.landArea != null &&
                      inventory.landArea !== "" && (
                        <StyledTableRow>
                          <StyledTableCell component="th" scope="row">
                            Land Area
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {inventory.landArea} m²
                          </StyledTableCell>
                        </StyledTableRow>
                      )}

                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Area
                      </StyledTableCell>
                      <StyledTableCell align="left">{`${inventory.Area} m²`}</StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Bedrooms
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {inventory.Bed[lang]}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Bathrooms
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {inventory.Bath[lang]}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Delivery in
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {inventory.delivery[lang]}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Sale type
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {inventory.Sale[lang]}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        Finishing
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {inventory.Finsh[lang]}
                      </StyledTableCell>
                    </StyledTableRow>

                    {inventory.downPayment != null &&
                      inventory.downPayment !== "" && (
                        <StyledTableRow>
                          <StyledTableCell component="th" scope="row">
                            Down Payment
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {inventory.downPayment}
                          </StyledTableCell>
                        </StyledTableRow>
                      )}

                    {inventory.remaining != null &&
                      inventory.remaining !== "" && (
                        <StyledTableRow>
                          <StyledTableCell component="th" scope="row">
                            Remaining
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {inventory.remaining}
                          </StyledTableCell>
                        </StyledTableRow>
                      )}

                    {inventory.rental != null && inventory.rental !== "" && (
                      <StyledTableRow>
                        <StyledTableCell component="th" scope="row">
                          Minimum rental period
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {inventory.rental}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

            {inventory.Sale.en === "Resale" && (
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xs: "100%", sm: "70%", md: "60%", lg: "50%" },
                }}
              >
                <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Payment Plan
                </Typography>
                <Stack
                  sx={{
                    backgroundColor: "#f8f8f8",
                    margin: "10px 0",
                    borderRadius: "10px",
                    padding: "30px 1px",
                    alignItems: "center",
                    width: "100%",
                    border: "1px solid black",
                  }}
                >
                  <Stack>
                    {!inventory.downPayment && (
                      <Stack
                        sx={{
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faWallet}
                          style={{ fontSize: "30px" }}
                        />
                        <Typography>
                          {`${Intl.NumberFormat("en-US").format(
                            inventory.price
                          )} ${
                            inventory.monyType.en === "dollar"
                              ? lang === "ar"
                                ? "دولار"
                                : "$"
                              : lang === "ar"
                              ? "جم"
                              : "EGP"
                          } Total Cash`}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  <Stack sx={{ width: "100%" }}>
                    {inventory.downPayment !== 0 && (
                      <Stack
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "baseline",
                          width: "100%",
                          gap: 2,
                        }}
                      >
                        <Stack
                          sx={{
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            height: "120px",
                            gap: { sm: 2 },
                          }}
                        >
                          <Stack sx={{ height: "45px", width: "45px" }}>
                            <FontAwesomeIcon
                              style={{ fontSize: "35px" }}
                              icon={faMoneyBillTransfer}
                            />
                          </Stack>
                          <Stack>
                            <Typography sx={{ fontWeight: "bold" }}>
                              DownPayment
                            </Typography>
                            <Typography>
                              {`${inventory.downPayment} ${
                                inventory.monyType.en === "dollar"
                                  ? lang === "ar"
                                    ? "دولار"
                                    : "$"
                                  : lang === "ar"
                                  ? "جم"
                                  : "EGP"
                              }  `}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack
                          sx={{
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            height: "120px",
                            gap: { sm: 2 },
                          }}
                        >
                          <Stack sx={{ height: "45px", width: "45px" }}>
                            <FontAwesomeIcon
                              style={{ fontSize: "35px" }}
                              icon={faMoneyCheck}
                            />
                          </Stack>
                          <Stack>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Remaining
                            </Typography>
                            <Typography>
                              {`
                            ${inventory.remaining}
                              ${
                                inventory.monyType.en === "dollar"
                                  ? lang === "ar"
                                    ? "دولار"
                                    : "$"
                                  : lang === "ar"
                                  ? "جم"
                                  : "EGP"
                              }
                              
                              `}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ marginLeft: "10px" }}
                            >
                              Over {inventory.month} Month
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            )}

            <Stack sx={{ flexDirection: "column", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Details
              </Typography>
              <Stack sx={{ flexDirection: "row", gap: 2 }}>
                <Stack>
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    sx={{
                      width: "150px",
                      borderColor: "black",
                      padding: "5px",
                    }}
                    variant="outlined"
                  >
                    <div className="sc-6c7c04b6-0 hehFCg">
                      <svg
                        width="42"
                        height="38"
                        viewBox="0 0 42 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="path-1-outside-1_7869_2283"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="42"
                          height="38"
                          fill="black"
                        >
                          <rect fill="white" width="42" height="38"></rect>
                          <path d="M18.1785 36.8954C12.7119 36.8954 7.24528 36.8954 1.77869 36.8954C1.01573 36.8954 1 36.8793 1 36.1236C1 27.6582 1 19.2008 1 10.7353C1 9.97964 1.01573 9.96357 1.73937 9.96357C6.0969 9.96357 10.4544 9.96357 14.8041 9.96357C15.3154 9.96357 15.6379 9.42493 15.394 8.95865C14.458 7.14175 15.0794 5.10779 16.8649 4.13503C17.0694 4.02248 17.1402 3.89385 17.1402 3.66875C17.1402 3.14619 17.1166 2.62363 17.1717 2.10911C17.266 1.24086 18.2414 0.726338 18.9493 1.15242C19.2875 1.35341 19.4841 1.6589 19.4841 2.06891C19.492 2.59147 19.4684 3.11403 19.4999 3.62855C19.5077 3.77326 19.6257 3.97424 19.7516 4.03856C21.6708 5.01132 22.3158 7.03724 21.3326 9.00688C21.128 9.40885 21.4505 9.95553 21.891 9.95553C25.6586 9.95553 29.4262 9.95553 33.1939 9.96357C33.5321 9.96357 33.6107 9.85101 33.6029 9.52944C33.5871 7.75274 33.595 5.97604 33.595 4.1913C33.595 3.60443 33.6973 3.50796 34.2636 3.54012C38.0233 3.75718 40.8943 6.86037 40.8943 10.7112C40.8943 17.1025 40.8943 23.4938 40.8943 29.8851C40.8943 33.2375 38.7627 35.9789 35.5771 36.7105C34.9715 36.8472 34.3344 36.8793 33.7051 36.8874C28.5374 36.9035 23.3619 36.8954 18.1785 36.8954ZM4.74402 33.1491C14.5917 33.1491 24.3923 33.1491 34.2164 33.1491C34.2164 32.9481 34.2164 32.7873 34.2164 32.6265C34.2164 30.689 34.2164 28.7516 34.2164 26.806C34.2164 26.6613 34.1928 26.4925 34.2557 26.3719C34.3108 26.2674 34.4602 26.1388 34.5703 26.1468C34.6726 26.1468 34.7985 26.2835 34.8692 26.396C34.9164 26.4764 34.9007 26.605 34.9007 26.7096C34.9007 28.8882 34.9007 31.0669 34.9007 33.2456C34.9007 33.7922 34.822 33.8646 34.2793 33.8646C24.4159 33.8646 14.5524 33.8646 4.68896 33.8646C4.13051 33.8646 4.06758 33.8003 4.06758 33.2134C4.06758 26.9588 4.06758 20.6961 4.06758 14.4415C4.06758 13.8305 4.11477 13.7903 4.72042 13.7903C7.52058 13.7903 10.3207 13.7903 13.1209 13.7983C13.4119 13.7983 13.5613 13.726 13.6793 13.4446C14.0097 12.6487 14.3715 11.8609 14.7255 11.073C14.7805 10.9604 14.812 10.8399 14.867 10.6951C10.4387 10.6951 6.06544 10.6951 1.69217 10.6951C1.69217 19.2088 1.69217 27.6904 1.69217 36.204C1.90454 36.204 2.09332 36.204 2.27423 36.204C6.31714 36.204 10.3601 36.204 14.403 36.204C20.9471 36.204 27.4834 36.2121 34.0276 36.204C36.5289 36.204 38.3694 35.0464 39.5807 32.8114C40.0212 31.9914 40.1313 31.1553 39.9583 30.2228C39.4077 27.3205 36.9615 25.1017 34.0984 24.9891C33.7209 24.9731 33.6107 24.7962 33.6107 24.4344C33.6186 21.2749 33.6186 18.1235 33.6186 14.964C33.6186 14.8113 33.6029 14.6586 33.5871 14.4897C30.2364 14.4897 26.9329 14.4897 23.5664 14.4897C23.9439 15.3339 24.2979 16.1539 24.6676 16.9578C24.7069 17.0382 24.8799 17.0945 24.9901 17.0945C25.5878 17.1106 26.1935 17.1025 26.7991 17.1025C27.0508 17.1025 27.2947 17.1025 27.5464 17.1025C27.7745 17.1106 27.9711 17.1829 27.9711 17.4643C27.9711 17.7296 27.7823 17.7859 27.5621 17.7939C27.4048 17.8019 27.2475 17.7939 27.0902 17.7939C26.4295 17.7939 25.7609 17.7939 25.0608 17.7939C25.108 17.9386 25.1316 18.027 25.1631 18.1155C26.1227 20.2781 27.0744 22.4487 28.0419 24.6113C28.1048 24.756 28.2464 24.8846 28.3801 24.9731C28.8521 25.2866 29.1903 25.6966 29.3161 26.2594C29.5128 27.1598 29.2139 27.8833 28.4981 28.4541C28.7105 28.9365 28.915 29.4108 29.1274 29.8851C29.2217 30.1022 29.2611 30.3192 29.0172 30.4318C28.7734 30.5443 28.624 30.3996 28.5296 30.1745C28.3644 29.7967 28.1756 29.4269 28.034 29.041C27.9397 28.7917 27.8059 28.7435 27.5621 28.7596C26.3036 28.848 25.3833 27.9396 25.3991 26.6372C25.3991 26.4362 25.3597 26.2111 25.2732 26.0262C24.1091 23.3813 22.9371 20.7444 21.7809 18.0994C21.6708 17.8502 21.5528 17.7215 21.2618 17.7457C20.8842 17.7778 20.5067 17.7537 20.1213 17.7537C19.8853 17.7537 19.6886 17.6894 19.6886 17.408C19.6965 17.1266 19.901 17.0704 20.1291 17.0784C20.4988 17.0784 20.8764 17.0784 21.2854 17.0784C21.2303 16.9257 21.1988 16.8211 21.1595 16.7327C20.3258 14.8435 19.492 12.9622 18.6504 11.081C18.5953 10.9604 18.4773 10.872 18.3908 10.7675C18.2964 10.872 18.1549 10.9604 18.0998 11.0891C17.3368 12.7854 16.5817 14.4897 15.8345 16.1941C15.7087 16.4674 15.5907 16.7488 15.457 17.0543C16.3379 17.0543 17.1638 17.0543 18.0369 17.0543C18.0369 16.5398 18.0369 16.0494 18.0369 15.559C18.0369 15.3258 18.0919 15.1088 18.3594 15.1007C18.6583 15.0927 18.7054 15.3258 18.7054 15.575C18.7054 16.2584 18.7054 16.9417 18.7054 17.617C18.7054 18.2039 18.7212 18.7988 18.6897 19.3777C18.6819 19.5063 18.4773 19.6188 18.3672 19.7394C18.265 19.6269 18.1234 19.5224 18.0605 19.3857C18.0054 19.2731 18.0447 19.1204 18.0447 18.9918C18.0447 18.5818 18.0447 18.1718 18.0447 17.7537C17.1481 17.7537 16.33 17.7617 15.5042 17.7457C15.2446 17.7376 15.1109 17.818 15.0008 18.0672C13.8288 20.7444 12.6332 23.4215 11.4534 26.0986C11.3983 26.2272 11.359 26.3799 11.359 26.5166C11.4298 27.8833 10.5095 28.84 9.15662 28.7516C8.92852 28.7355 8.82626 28.7998 8.73974 29.0008C8.58243 29.3867 8.40939 29.7565 8.24421 30.1343C8.14196 30.3675 8.00038 30.5443 7.73295 30.4157C7.48911 30.2951 7.52844 30.078 7.62283 29.861C7.79587 29.4831 7.94532 29.1053 8.13409 28.7355C8.24421 28.5184 8.20488 28.3978 8.03184 28.229C7.06437 27.3045 7.19809 25.8493 8.2914 25.0936C8.47231 24.965 8.64536 24.7721 8.73188 24.5711C9.68361 22.4487 10.6275 20.3183 11.5635 18.1878C11.6185 18.0592 11.6657 17.9225 11.7365 17.7537C10.9657 17.7537 10.2499 17.7537 9.5263 17.7537C9.29033 17.7537 9.09369 17.6894 9.09369 17.4161C9.09369 17.1347 9.30607 17.0784 9.53417 17.0864C10.1398 17.0864 10.7455 17.0382 11.3354 17.1025C11.9017 17.1588 12.177 16.9578 12.3658 16.4192C12.586 15.776 12.9085 15.157 13.1917 14.5058C10.3365 14.5058 7.54417 14.5058 4.73616 14.5058C4.74402 20.7202 4.74402 26.9266 4.74402 33.1491ZM40.2493 28.7998C40.2493 28.1486 40.2493 27.618 40.2493 27.0874C40.2493 21.6608 40.2493 16.2343 40.2493 10.8077C40.2493 8.7657 39.5021 7.06136 37.984 5.72682C37.8818 5.63839 37.7716 5.56603 37.5986 5.44544C37.5986 5.69466 37.5986 5.84741 37.5986 6.0082C37.5986 8.06628 37.5986 10.1244 37.5986 12.1824C37.5986 12.3271 37.6143 12.496 37.5593 12.6166C37.5042 12.7211 37.3469 12.8417 37.2446 12.8417C37.1424 12.8336 37.0087 12.6969 36.9615 12.5844C36.9064 12.4718 36.9379 12.3191 36.9379 12.1905C36.9379 10.1163 36.9379 8.0502 36.9379 5.97604C36.9379 4.89073 36.9458 4.87465 35.9232 4.56111C35.412 4.40837 34.8771 4.32797 34.3265 4.21542C34.3265 10.9926 34.3265 17.6412 34.3265 24.2897C37.1267 24.6032 39.0301 26.1468 40.2493 28.7998ZM33.5793 13.7742C33.5872 13.6215 33.6029 13.4928 33.6029 13.3642C33.6029 12.6166 33.5871 11.8689 33.6107 11.1212C33.6265 10.7514 33.5006 10.6469 33.1467 10.6469C29.5364 10.655 25.9339 10.655 22.3236 10.655C22.1899 10.655 22.0562 10.671 21.8753 10.6871C22.3 11.6438 22.7012 12.5362 23.0787 13.4446C23.1967 13.726 23.3461 13.7983 23.6372 13.7983C26.8149 13.7903 29.9847 13.7903 33.1624 13.7903C33.2961 13.7903 33.422 13.7823 33.5793 13.7742ZM11.0129 25.4313C13.1759 20.5434 15.3626 15.6152 17.5335 10.7193C16.9986 10.4218 16.5109 10.1404 15.9997 9.85101C13.813 14.7872 11.6107 19.7555 9.44765 24.6354C9.99037 24.9168 10.4859 25.166 11.0129 25.4313ZM19.2403 10.7193C21.4112 15.6152 23.59 20.5353 25.7373 25.3831C26.2564 25.1097 26.7519 24.8444 27.2868 24.563C25.1316 19.6992 22.945 14.7631 20.7741 9.85905C20.2471 10.1565 19.7673 10.4218 19.2403 10.7193ZM18.3908 10.06C19.9167 10.06 21.128 8.83002 21.1359 7.27038C21.1438 5.7027 19.901 4.43248 18.3751 4.44856C16.8728 4.4566 15.63 5.73486 15.6379 7.27038C15.6379 8.8059 16.8649 10.06 18.3908 10.06ZM28.7183 26.7256C28.7105 25.986 28.1127 25.375 27.3891 25.3831C26.6497 25.3831 26.0598 26.0101 26.0676 26.7739C26.0834 27.5296 26.6654 28.1004 27.4127 28.0923C28.1442 28.0762 28.7183 27.4733 28.7183 26.7256ZM9.38472 28.0843C10.1162 28.0843 10.6904 27.5055 10.6983 26.7739C10.7061 26.0503 10.0926 25.4393 9.35326 25.4474C8.63749 25.4554 8.05544 26.0664 8.0633 26.7819C8.07117 27.5135 8.66109 28.0923 9.38472 28.0843ZM18.8234 3.74914C18.8234 3.20246 18.8234 2.71206 18.8234 2.21362C18.8234 1.94028 18.7526 1.73126 18.4537 1.6991C18.1313 1.66694 17.8717 1.83577 17.8481 2.13323C17.8009 2.67186 17.8324 3.2105 17.8324 3.7411C18.1863 3.74914 18.4852 3.74914 18.8234 3.74914Z"></path>
                        </mask>
                        <path
                          d="M18.1785 36.8954C12.7119 36.8954 7.24528 36.8954 1.77869 36.8954C1.01573 36.8954 1 36.8793 1 36.1236C1 27.6582 1 19.2008 1 10.7353C1 9.97964 1.01573 9.96357 1.73937 9.96357C6.0969 9.96357 10.4544 9.96357 14.8041 9.96357C15.3154 9.96357 15.6379 9.42493 15.394 8.95865C14.458 7.14175 15.0794 5.10779 16.8649 4.13503C17.0694 4.02248 17.1402 3.89385 17.1402 3.66875C17.1402 3.14619 17.1166 2.62363 17.1717 2.10911C17.266 1.24086 18.2414 0.726338 18.9493 1.15242C19.2875 1.35341 19.4841 1.6589 19.4841 2.06891C19.492 2.59147 19.4684 3.11403 19.4999 3.62855C19.5077 3.77326 19.6257 3.97424 19.7516 4.03856C21.6708 5.01132 22.3158 7.03724 21.3326 9.00688C21.128 9.40885 21.4505 9.95553 21.891 9.95553C25.6586 9.95553 29.4262 9.95553 33.1939 9.96357C33.5321 9.96357 33.6107 9.85101 33.6029 9.52944C33.5871 7.75274 33.595 5.97604 33.595 4.1913C33.595 3.60443 33.6973 3.50796 34.2636 3.54012C38.0233 3.75718 40.8943 6.86037 40.8943 10.7112C40.8943 17.1025 40.8943 23.4938 40.8943 29.8851C40.8943 33.2375 38.7627 35.9789 35.5771 36.7105C34.9715 36.8472 34.3344 36.8793 33.7051 36.8874C28.5374 36.9035 23.3619 36.8954 18.1785 36.8954ZM4.74402 33.1491C14.5917 33.1491 24.3923 33.1491 34.2164 33.1491C34.2164 32.9481 34.2164 32.7873 34.2164 32.6265C34.2164 30.689 34.2164 28.7516 34.2164 26.806C34.2164 26.6613 34.1928 26.4925 34.2557 26.3719C34.3108 26.2674 34.4602 26.1388 34.5703 26.1468C34.6726 26.1468 34.7985 26.2835 34.8692 26.396C34.9164 26.4764 34.9007 26.605 34.9007 26.7096C34.9007 28.8882 34.9007 31.0669 34.9007 33.2456C34.9007 33.7922 34.822 33.8646 34.2793 33.8646C24.4159 33.8646 14.5524 33.8646 4.68896 33.8646C4.13051 33.8646 4.06758 33.8003 4.06758 33.2134C4.06758 26.9588 4.06758 20.6961 4.06758 14.4415C4.06758 13.8305 4.11477 13.7903 4.72042 13.7903C7.52058 13.7903 10.3207 13.7903 13.1209 13.7983C13.4119 13.7983 13.5613 13.726 13.6793 13.4446C14.0097 12.6487 14.3715 11.8609 14.7255 11.073C14.7805 10.9604 14.812 10.8399 14.867 10.6951C10.4387 10.6951 6.06544 10.6951 1.69217 10.6951C1.69217 19.2088 1.69217 27.6904 1.69217 36.204C1.90454 36.204 2.09332 36.204 2.27423 36.204C6.31714 36.204 10.3601 36.204 14.403 36.204C20.9471 36.204 27.4834 36.2121 34.0276 36.204C36.5289 36.204 38.3694 35.0464 39.5807 32.8114C40.0212 31.9914 40.1313 31.1553 39.9583 30.2228C39.4077 27.3205 36.9615 25.1017 34.0984 24.9891C33.7209 24.9731 33.6107 24.7962 33.6107 24.4344C33.6186 21.2749 33.6186 18.1235 33.6186 14.964C33.6186 14.8113 33.6029 14.6586 33.5871 14.4897C30.2364 14.4897 26.9329 14.4897 23.5664 14.4897C23.9439 15.3339 24.2979 16.1539 24.6676 16.9578C24.7069 17.0382 24.8799 17.0945 24.9901 17.0945C25.5878 17.1106 26.1935 17.1025 26.7991 17.1025C27.0508 17.1025 27.2947 17.1025 27.5464 17.1025C27.7745 17.1106 27.9711 17.1829 27.9711 17.4643C27.9711 17.7296 27.7823 17.7859 27.5621 17.7939C27.4048 17.8019 27.2475 17.7939 27.0902 17.7939C26.4295 17.7939 25.7609 17.7939 25.0608 17.7939C25.108 17.9386 25.1316 18.027 25.1631 18.1155C26.1227 20.2781 27.0744 22.4487 28.0419 24.6113C28.1048 24.756 28.2464 24.8846 28.3801 24.9731C28.8521 25.2866 29.1903 25.6966 29.3161 26.2594C29.5128 27.1598 29.2139 27.8833 28.4981 28.4541C28.7105 28.9365 28.915 29.4108 29.1274 29.8851C29.2217 30.1022 29.2611 30.3192 29.0172 30.4318C28.7734 30.5443 28.624 30.3996 28.5296 30.1745C28.3644 29.7967 28.1756 29.4269 28.034 29.041C27.9397 28.7917 27.8059 28.7435 27.5621 28.7596C26.3036 28.848 25.3833 27.9396 25.3991 26.6372C25.3991 26.4362 25.3597 26.2111 25.2732 26.0262C24.1091 23.3813 22.9371 20.7444 21.7809 18.0994C21.6708 17.8502 21.5528 17.7215 21.2618 17.7457C20.8842 17.7778 20.5067 17.7537 20.1213 17.7537C19.8853 17.7537 19.6886 17.6894 19.6886 17.408C19.6965 17.1266 19.901 17.0704 20.1291 17.0784C20.4988 17.0784 20.8764 17.0784 21.2854 17.0784C21.2303 16.9257 21.1988 16.8211 21.1595 16.7327C20.3258 14.8435 19.492 12.9622 18.6504 11.081C18.5953 10.9604 18.4773 10.872 18.3908 10.7675C18.2964 10.872 18.1549 10.9604 18.0998 11.0891C17.3368 12.7854 16.5817 14.4897 15.8345 16.1941C15.7087 16.4674 15.5907 16.7488 15.457 17.0543C16.3379 17.0543 17.1638 17.0543 18.0369 17.0543C18.0369 16.5398 18.0369 16.0494 18.0369 15.559C18.0369 15.3258 18.0919 15.1088 18.3594 15.1007C18.6583 15.0927 18.7054 15.3258 18.7054 15.575C18.7054 16.2584 18.7054 16.9417 18.7054 17.617C18.7054 18.2039 18.7212 18.7988 18.6897 19.3777C18.6819 19.5063 18.4773 19.6188 18.3672 19.7394C18.265 19.6269 18.1234 19.5224 18.0605 19.3857C18.0054 19.2731 18.0447 19.1204 18.0447 18.9918C18.0447 18.5818 18.0447 18.1718 18.0447 17.7537C17.1481 17.7537 16.33 17.7617 15.5042 17.7457C15.2446 17.7376 15.1109 17.818 15.0008 18.0672C13.8288 20.7444 12.6332 23.4215 11.4534 26.0986C11.3983 26.2272 11.359 26.3799 11.359 26.5166C11.4298 27.8833 10.5095 28.84 9.15662 28.7516C8.92852 28.7355 8.82626 28.7998 8.73974 29.0008C8.58243 29.3867 8.40939 29.7565 8.24421 30.1343C8.14196 30.3675 8.00038 30.5443 7.73295 30.4157C7.48911 30.2951 7.52844 30.078 7.62283 29.861C7.79587 29.4831 7.94532 29.1053 8.13409 28.7355C8.24421 28.5184 8.20488 28.3978 8.03184 28.229C7.06437 27.3045 7.19809 25.8493 8.2914 25.0936C8.47231 24.965 8.64536 24.7721 8.73188 24.5711C9.68361 22.4487 10.6275 20.3183 11.5635 18.1878C11.6185 18.0592 11.6657 17.9225 11.7365 17.7537C10.9657 17.7537 10.2499 17.7537 9.5263 17.7537C9.29033 17.7537 9.09369 17.6894 9.09369 17.4161C9.09369 17.1347 9.30607 17.0784 9.53417 17.0864C10.1398 17.0864 10.7455 17.0382 11.3354 17.1025C11.9017 17.1588 12.177 16.9578 12.3658 16.4192C12.586 15.776 12.9085 15.157 13.1917 14.5058C10.3365 14.5058 7.54417 14.5058 4.73616 14.5058C4.74402 20.7202 4.74402 26.9266 4.74402 33.1491ZM40.2493 28.7998C40.2493 28.1486 40.2493 27.618 40.2493 27.0874C40.2493 21.6608 40.2493 16.2343 40.2493 10.8077C40.2493 8.7657 39.5021 7.06136 37.984 5.72682C37.8818 5.63839 37.7716 5.56603 37.5986 5.44544C37.5986 5.69466 37.5986 5.84741 37.5986 6.0082C37.5986 8.06628 37.5986 10.1244 37.5986 12.1824C37.5986 12.3271 37.6143 12.496 37.5593 12.6166C37.5042 12.7211 37.3469 12.8417 37.2446 12.8417C37.1424 12.8336 37.0087 12.6969 36.9615 12.5844C36.9064 12.4718 36.9379 12.3191 36.9379 12.1905C36.9379 10.1163 36.9379 8.0502 36.9379 5.97604C36.9379 4.89073 36.9458 4.87465 35.9232 4.56111C35.412 4.40837 34.8771 4.32797 34.3265 4.21542C34.3265 10.9926 34.3265 17.6412 34.3265 24.2897C37.1267 24.6032 39.0301 26.1468 40.2493 28.7998ZM33.5793 13.7742C33.5872 13.6215 33.6029 13.4928 33.6029 13.3642C33.6029 12.6166 33.5871 11.8689 33.6107 11.1212C33.6265 10.7514 33.5006 10.6469 33.1467 10.6469C29.5364 10.655 25.9339 10.655 22.3236 10.655C22.1899 10.655 22.0562 10.671 21.8753 10.6871C22.3 11.6438 22.7012 12.5362 23.0787 13.4446C23.1967 13.726 23.3461 13.7983 23.6372 13.7983C26.8149 13.7903 29.9847 13.7903 33.1624 13.7903C33.2961 13.7903 33.422 13.7823 33.5793 13.7742ZM11.0129 25.4313C13.1759 20.5434 15.3626 15.6152 17.5335 10.7193C16.9986 10.4218 16.5109 10.1404 15.9997 9.85101C13.813 14.7872 11.6107 19.7555 9.44765 24.6354C9.99037 24.9168 10.4859 25.166 11.0129 25.4313ZM19.2403 10.7193C21.4112 15.6152 23.59 20.5353 25.7373 25.3831C26.2564 25.1097 26.7519 24.8444 27.2868 24.563C25.1316 19.6992 22.945 14.7631 20.7741 9.85905C20.2471 10.1565 19.7673 10.4218 19.2403 10.7193ZM18.3908 10.06C19.9167 10.06 21.128 8.83002 21.1359 7.27038C21.1438 5.7027 19.901 4.43248 18.3751 4.44856C16.8728 4.4566 15.63 5.73486 15.6379 7.27038C15.6379 8.8059 16.8649 10.06 18.3908 10.06ZM28.7183 26.7256C28.7105 25.986 28.1127 25.375 27.3891 25.3831C26.6497 25.3831 26.0598 26.0101 26.0676 26.7739C26.0834 27.5296 26.6654 28.1004 27.4127 28.0923C28.1442 28.0762 28.7183 27.4733 28.7183 26.7256ZM9.38472 28.0843C10.1162 28.0843 10.6904 27.5055 10.6983 26.7739C10.7061 26.0503 10.0926 25.4393 9.35326 25.4474C8.63749 25.4554 8.05544 26.0664 8.0633 26.7819C8.07117 27.5135 8.66109 28.0923 9.38472 28.0843ZM18.8234 3.74914C18.8234 3.20246 18.8234 2.71206 18.8234 2.21362C18.8234 1.94028 18.7526 1.73126 18.4537 1.6991C18.1313 1.66694 17.8717 1.83577 17.8481 2.13323C17.8009 2.67186 17.8324 3.2105 17.8324 3.7411C18.1863 3.74914 18.4852 3.74914 18.8234 3.74914Z"
                          fill="#666666"
                        ></path>
                        <path
                          d="M18.1785 36.8954C12.7119 36.8954 7.24528 36.8954 1.77869 36.8954C1.01573 36.8954 1 36.8793 1 36.1236C1 27.6582 1 19.2008 1 10.7353C1 9.97964 1.01573 9.96357 1.73937 9.96357C6.0969 9.96357 10.4544 9.96357 14.8041 9.96357C15.3154 9.96357 15.6379 9.42493 15.394 8.95865C14.458 7.14175 15.0794 5.10779 16.8649 4.13503C17.0694 4.02248 17.1402 3.89385 17.1402 3.66875C17.1402 3.14619 17.1166 2.62363 17.1717 2.10911C17.266 1.24086 18.2414 0.726338 18.9493 1.15242C19.2875 1.35341 19.4841 1.6589 19.4841 2.06891C19.492 2.59147 19.4684 3.11403 19.4999 3.62855C19.5077 3.77326 19.6257 3.97424 19.7516 4.03856C21.6708 5.01132 22.3158 7.03724 21.3326 9.00688C21.128 9.40885 21.4505 9.95553 21.891 9.95553C25.6586 9.95553 29.4262 9.95553 33.1939 9.96357C33.5321 9.96357 33.6107 9.85101 33.6029 9.52944C33.5871 7.75274 33.595 5.97604 33.595 4.1913C33.595 3.60443 33.6973 3.50796 34.2636 3.54012C38.0233 3.75718 40.8943 6.86037 40.8943 10.7112C40.8943 17.1025 40.8943 23.4938 40.8943 29.8851C40.8943 33.2375 38.7627 35.9789 35.5771 36.7105C34.9715 36.8472 34.3344 36.8793 33.7051 36.8874C28.5374 36.9035 23.3619 36.8954 18.1785 36.8954ZM4.74402 33.1491C14.5917 33.1491 24.3923 33.1491 34.2164 33.1491C34.2164 32.9481 34.2164 32.7873 34.2164 32.6265C34.2164 30.689 34.2164 28.7516 34.2164 26.806C34.2164 26.6613 34.1928 26.4925 34.2557 26.3719C34.3108 26.2674 34.4602 26.1388 34.5703 26.1468C34.6726 26.1468 34.7985 26.2835 34.8692 26.396C34.9164 26.4764 34.9007 26.605 34.9007 26.7096C34.9007 28.8882 34.9007 31.0669 34.9007 33.2456C34.9007 33.7922 34.822 33.8646 34.2793 33.8646C24.4159 33.8646 14.5524 33.8646 4.68896 33.8646C4.13051 33.8646 4.06758 33.8003 4.06758 33.2134C4.06758 26.9588 4.06758 20.6961 4.06758 14.4415C4.06758 13.8305 4.11477 13.7903 4.72042 13.7903C7.52058 13.7903 10.3207 13.7903 13.1209 13.7983C13.4119 13.7983 13.5613 13.726 13.6793 13.4446C14.0097 12.6487 14.3715 11.8609 14.7255 11.073C14.7805 10.9604 14.812 10.8399 14.867 10.6951C10.4387 10.6951 6.06544 10.6951 1.69217 10.6951C1.69217 19.2088 1.69217 27.6904 1.69217 36.204C1.90454 36.204 2.09332 36.204 2.27423 36.204C6.31714 36.204 10.3601 36.204 14.403 36.204C20.9471 36.204 27.4834 36.2121 34.0276 36.204C36.5289 36.204 38.3694 35.0464 39.5807 32.8114C40.0212 31.9914 40.1313 31.1553 39.9583 30.2228C39.4077 27.3205 36.9615 25.1017 34.0984 24.9891C33.7209 24.9731 33.6107 24.7962 33.6107 24.4344C33.6186 21.2749 33.6186 18.1235 33.6186 14.964C33.6186 14.8113 33.6029 14.6586 33.5871 14.4897C30.2364 14.4897 26.9329 14.4897 23.5664 14.4897C23.9439 15.3339 24.2979 16.1539 24.6676 16.9578C24.7069 17.0382 24.8799 17.0945 24.9901 17.0945C25.5878 17.1106 26.1935 17.1025 26.7991 17.1025C27.0508 17.1025 27.2947 17.1025 27.5464 17.1025C27.7745 17.1106 27.9711 17.1829 27.9711 17.4643C27.9711 17.7296 27.7823 17.7859 27.5621 17.7939C27.4048 17.8019 27.2475 17.7939 27.0902 17.7939C26.4295 17.7939 25.7609 17.7939 25.0608 17.7939C25.108 17.9386 25.1316 18.027 25.1631 18.1155C26.1227 20.2781 27.0744 22.4487 28.0419 24.6113C28.1048 24.756 28.2464 24.8846 28.3801 24.9731C28.8521 25.2866 29.1903 25.6966 29.3161 26.2594C29.5128 27.1598 29.2139 27.8833 28.4981 28.4541C28.7105 28.9365 28.915 29.4108 29.1274 29.8851C29.2217 30.1022 29.2611 30.3192 29.0172 30.4318C28.7734 30.5443 28.624 30.3996 28.5296 30.1745C28.3644 29.7967 28.1756 29.4269 28.034 29.041C27.9397 28.7917 27.8059 28.7435 27.5621 28.7596C26.3036 28.848 25.3833 27.9396 25.3991 26.6372C25.3991 26.4362 25.3597 26.2111 25.2732 26.0262C24.1091 23.3813 22.9371 20.7444 21.7809 18.0994C21.6708 17.8502 21.5528 17.7215 21.2618 17.7457C20.8842 17.7778 20.5067 17.7537 20.1213 17.7537C19.8853 17.7537 19.6886 17.6894 19.6886 17.408C19.6965 17.1266 19.901 17.0704 20.1291 17.0784C20.4988 17.0784 20.8764 17.0784 21.2854 17.0784C21.2303 16.9257 21.1988 16.8211 21.1595 16.7327C20.3258 14.8435 19.492 12.9622 18.6504 11.081C18.5953 10.9604 18.4773 10.872 18.3908 10.7675C18.2964 10.872 18.1549 10.9604 18.0998 11.0891C17.3368 12.7854 16.5817 14.4897 15.8345 16.1941C15.7087 16.4674 15.5907 16.7488 15.457 17.0543C16.3379 17.0543 17.1638 17.0543 18.0369 17.0543C18.0369 16.5398 18.0369 16.0494 18.0369 15.559C18.0369 15.3258 18.0919 15.1088 18.3594 15.1007C18.6583 15.0927 18.7054 15.3258 18.7054 15.575C18.7054 16.2584 18.7054 16.9417 18.7054 17.617C18.7054 18.2039 18.7212 18.7988 18.6897 19.3777C18.6819 19.5063 18.4773 19.6188 18.3672 19.7394C18.265 19.6269 18.1234 19.5224 18.0605 19.3857C18.0054 19.2731 18.0447 19.1204 18.0447 18.9918C18.0447 18.5818 18.0447 18.1718 18.0447 17.7537C17.1481 17.7537 16.33 17.7617 15.5042 17.7457C15.2446 17.7376 15.1109 17.818 15.0008 18.0672C13.8288 20.7444 12.6332 23.4215 11.4534 26.0986C11.3983 26.2272 11.359 26.3799 11.359 26.5166C11.4298 27.8833 10.5095 28.84 9.15662 28.7516C8.92852 28.7355 8.82626 28.7998 8.73974 29.0008C8.58243 29.3867 8.40939 29.7565 8.24421 30.1343C8.14196 30.3675 8.00038 30.5443 7.73295 30.4157C7.48911 30.2951 7.52844 30.078 7.62283 29.861C7.79587 29.4831 7.94532 29.1053 8.13409 28.7355C8.24421 28.5184 8.20488 28.3978 8.03184 28.229C7.06437 27.3045 7.19809 25.8493 8.2914 25.0936C8.47231 24.965 8.64536 24.7721 8.73188 24.5711C9.68361 22.4487 10.6275 20.3183 11.5635 18.1878C11.6185 18.0592 11.6657 17.9225 11.7365 17.7537C10.9657 17.7537 10.2499 17.7537 9.5263 17.7537C9.29033 17.7537 9.09369 17.6894 9.09369 17.4161C9.09369 17.1347 9.30607 17.0784 9.53417 17.0864C10.1398 17.0864 10.7455 17.0382 11.3354 17.1025C11.9017 17.1588 12.177 16.9578 12.3658 16.4192C12.586 15.776 12.9085 15.157 13.1917 14.5058C10.3365 14.5058 7.54417 14.5058 4.73616 14.5058C4.74402 20.7202 4.74402 26.9266 4.74402 33.1491ZM40.2493 28.7998C40.2493 28.1486 40.2493 27.618 40.2493 27.0874C40.2493 21.6608 40.2493 16.2343 40.2493 10.8077C40.2493 8.7657 39.5021 7.06136 37.984 5.72682C37.8818 5.63839 37.7716 5.56603 37.5986 5.44544C37.5986 5.69466 37.5986 5.84741 37.5986 6.0082C37.5986 8.06628 37.5986 10.1244 37.5986 12.1824C37.5986 12.3271 37.6143 12.496 37.5593 12.6166C37.5042 12.7211 37.3469 12.8417 37.2446 12.8417C37.1424 12.8336 37.0087 12.6969 36.9615 12.5844C36.9064 12.4718 36.9379 12.3191 36.9379 12.1905C36.9379 10.1163 36.9379 8.0502 36.9379 5.97604C36.9379 4.89073 36.9458 4.87465 35.9232 4.56111C35.412 4.40837 34.8771 4.32797 34.3265 4.21542C34.3265 10.9926 34.3265 17.6412 34.3265 24.2897C37.1267 24.6032 39.0301 26.1468 40.2493 28.7998ZM33.5793 13.7742C33.5872 13.6215 33.6029 13.4928 33.6029 13.3642C33.6029 12.6166 33.5871 11.8689 33.6107 11.1212C33.6265 10.7514 33.5006 10.6469 33.1467 10.6469C29.5364 10.655 25.9339 10.655 22.3236 10.655C22.1899 10.655 22.0562 10.671 21.8753 10.6871C22.3 11.6438 22.7012 12.5362 23.0787 13.4446C23.1967 13.726 23.3461 13.7983 23.6372 13.7983C26.8149 13.7903 29.9847 13.7903 33.1624 13.7903C33.2961 13.7903 33.422 13.7823 33.5793 13.7742ZM11.0129 25.4313C13.1759 20.5434 15.3626 15.6152 17.5335 10.7193C16.9986 10.4218 16.5109 10.1404 15.9997 9.85101C13.813 14.7872 11.6107 19.7555 9.44765 24.6354C9.99037 24.9168 10.4859 25.166 11.0129 25.4313ZM19.2403 10.7193C21.4112 15.6152 23.59 20.5353 25.7373 25.3831C26.2564 25.1097 26.7519 24.8444 27.2868 24.563C25.1316 19.6992 22.945 14.7631 20.7741 9.85905C20.2471 10.1565 19.7673 10.4218 19.2403 10.7193ZM18.3908 10.06C19.9167 10.06 21.128 8.83002 21.1359 7.27038C21.1438 5.7027 19.901 4.43248 18.3751 4.44856C16.8728 4.4566 15.63 5.73486 15.6379 7.27038C15.6379 8.8059 16.8649 10.06 18.3908 10.06ZM28.7183 26.7256C28.7105 25.986 28.1127 25.375 27.3891 25.3831C26.6497 25.3831 26.0598 26.0101 26.0676 26.7739C26.0834 27.5296 26.6654 28.1004 27.4127 28.0923C28.1442 28.0762 28.7183 27.4733 28.7183 26.7256ZM9.38472 28.0843C10.1162 28.0843 10.6904 27.5055 10.6983 26.7739C10.7061 26.0503 10.0926 25.4393 9.35326 25.4474C8.63749 25.4554 8.05544 26.0664 8.0633 26.7819C8.07117 27.5135 8.66109 28.0923 9.38472 28.0843ZM18.8234 3.74914C18.8234 3.20246 18.8234 2.71206 18.8234 2.21362C18.8234 1.94028 18.7526 1.73126 18.4537 1.6991C18.1313 1.66694 17.8717 1.83577 17.8481 2.13323C17.8009 2.67186 17.8324 3.2105 17.8324 3.7411C18.1863 3.74914 18.4852 3.74914 18.8234 3.74914Z"
                          stroke="#666666"
                          strokeWidth="0.4"
                          mask="url(#path-1-outside-1_7869_2283)"
                        ></path>
                        <path
                          d="M20.9714 26.7676L21.0496 26.6877C21.075 26.6618 21.1012 26.6298 21.1298 26.5933C21.1368 26.5844 21.1441 26.5751 21.1515 26.5655C21.173 26.5379 21.1958 26.5085 21.2184 26.4815C21.249 26.445 21.2833 26.4075 21.321 26.3775C21.3585 26.3478 21.4058 26.32 21.4624 26.3128L21.4673 26.3122L21.4673 26.3123C21.9914 26.2717 22.5234 26.2717 23.0474 26.3122C23.0476 26.3123 23.0478 26.3123 23.048 26.3123L23.0403 26.412L20.9714 26.7676ZM20.9714 26.7676L21.0595 26.8365C21.0992 26.8675 21.1337 26.9005 21.1716 26.9366C21.1951 26.9591 21.2199 26.9828 21.248 27.008C21.313 27.0662 21.3938 27.1299 21.4908 27.1523L20.9714 26.7676Z"
                          fill="#666666"
                          stroke="#666666"
                          strokeWidth="0.2"
                        ></path>
                        <path
                          d="M18.6656 27.172V27.1721L18.6686 27.172C18.7548 27.1694 18.8403 27.1719 18.9294 27.1745C18.9758 27.1759 19.0232 27.1773 19.0722 27.178C19.2096 27.1801 19.3532 27.1763 19.4932 27.1464C19.5877 27.1325 19.6821 27.0644 19.7473 26.9988C19.7825 26.9634 19.8146 26.9234 19.8386 26.8825C19.8613 26.8438 19.8825 26.7943 19.8825 26.7424C19.8825 26.6896 19.8636 26.6379 19.8413 26.595C19.8182 26.5506 19.7871 26.5072 19.753 26.4689C19.719 26.4307 19.6799 26.3951 19.6393 26.3678C19.6007 26.3418 19.5515 26.3169 19.4988 26.3131L19.4988 26.313L19.4975 26.313C18.9587 26.2806 18.4198 26.2806 17.8809 26.313L17.8809 26.313L17.8797 26.3131C17.8232 26.3172 17.7769 26.3451 17.7426 26.3729C17.7077 26.4013 17.676 26.437 17.6481 26.4713C17.6287 26.4952 17.6086 26.5216 17.5897 26.5465C17.5818 26.5569 17.574 26.5671 17.5666 26.5768C17.5401 26.6111 17.5161 26.6408 17.493 26.6644L17.4222 26.7368L17.4954 26.8067C17.5215 26.8316 17.5481 26.8609 17.5769 26.8937C17.5823 26.8998 17.5878 26.906 17.5934 26.9124C17.6168 26.9391 17.6417 26.9675 17.6668 26.9941C17.7265 27.0571 17.805 27.1296 17.9029 27.1532L17.9031 27.1532C18.0336 27.1843 18.1677 27.1881 18.2954 27.1851C18.3529 27.1837 18.4061 27.1811 18.4579 27.1786C18.5278 27.1752 18.5949 27.172 18.6656 27.172ZM18.6656 27.072C18.5943 27.072 18.5216 27.0755 18.4485 27.0789C18.2719 27.0873 18.0932 27.0957 17.9263 27.0559C17.8326 27.0334 17.7505 26.9398 17.6691 26.8471C17.6392 26.813 17.6095 26.7791 17.5793 26.7489L18.6656 27.072ZM17.5746 26.7237C17.6071 26.6889 17.6389 26.647 17.6705 26.6054C17.7423 26.511 17.8128 26.4182 17.8869 26.4128C18.4218 26.3806 18.9567 26.3806 19.4915 26.4128L17.5746 26.7237Z"
                          fill="#666666"
                          stroke="#666666"
                          strokeWidth="0.2"
                        ></path>
                        <path
                          d="M14.2858 26.3123C14.2304 26.3163 14.1818 26.3437 14.1449 26.3721C14.1063 26.4018 14.0707 26.44 14.0403 26.4804C13.9811 26.5588 13.9291 26.6619 13.9185 26.7543L13.9185 26.7543L13.9183 26.756C13.9128 26.812 13.9401 26.8631 13.9609 26.8948C13.9848 26.9315 14.0171 26.9679 14.0516 27.0004C14.1171 27.0619 14.2104 27.1274 14.2967 27.1451L14.2967 27.1451L14.2979 27.1453C14.4337 27.1713 14.5714 27.1753 14.7046 27.1732C14.7659 27.1723 14.8231 27.1702 14.879 27.1682C14.9511 27.1657 15.0212 27.1632 15.0954 27.1632C15.1759 27.1632 15.252 27.1665 15.3301 27.1699C15.3865 27.1724 15.444 27.1749 15.5052 27.1762C15.6444 27.1793 15.7887 27.1754 15.9332 27.1451M14.2858 26.3123C14.8334 26.2717 15.3889 26.2717 15.9443 26.3122C15.998 26.3162 16.0476 26.3423 16.0859 26.3689C16.1264 26.3969 16.1653 26.4332 16.199 26.4717C16.2328 26.5103 16.2637 26.5536 16.2866 26.5972C16.3084 26.6388 16.328 26.6899 16.328 26.7416C16.328 26.7949 16.3052 26.8446 16.2815 26.8828C16.2565 26.9231 16.2231 26.9622 16.1871 26.9967C16.1185 27.0624 16.0234 27.1275 15.9332 27.1451M14.2858 26.3123C14.2858 26.3123 14.2858 26.3123 14.2858 26.3122L14.2931 26.412M14.2858 26.3123C14.2858 26.3123 14.2857 26.3123 14.2857 26.3123L14.2931 26.412M15.9332 27.1451C15.9329 27.1452 15.9326 27.1452 15.9322 27.1453L15.9134 27.0471M15.9332 27.1451C15.9335 27.1451 15.9338 27.145 15.934 27.1449L15.9134 27.0471M15.9134 27.0471C15.7248 27.0868 15.5324 27.0785 15.3387 27.0702C15.2577 27.0667 15.1766 27.0632 15.0954 27.0632C15.0213 27.0632 14.9466 27.0658 14.8718 27.0684C14.6845 27.075 14.4966 27.0816 14.3167 27.0471M15.9134 27.0471C16.0393 27.023 16.228 26.8461 16.228 26.7416C16.228 26.629 16.0471 26.42 15.937 26.412C15.3864 26.3718 14.8358 26.3718 14.2931 26.412M14.3167 27.0471L14.2931 26.412M14.3167 27.0471C14.1987 27.023 14.01 26.8461 14.0178 26.7657L14.3167 27.0471Z"
                          fill="#666666"
                          stroke="#666666"
                          strokeWidth="0.2"
                        ></path>
                        <path
                          d="M37.2716 18.4859L37.2716 18.4858C37.1955 18.5009 37.1246 18.4968 37.0616 18.4705C36.9984 18.4441 36.9518 18.3989 36.9188 18.3466C36.8555 18.2462 36.8375 18.1126 36.8375 17.9938C36.8375 17.8081 36.8365 17.6219 36.8356 17.4354C36.8326 16.8741 36.8296 16.31 36.8533 15.7466L36.8534 15.7454L36.8534 15.7454C36.8595 15.6327 36.9365 15.5405 37.0012 15.4734C37.0292 15.4444 37.0597 15.4154 37.0884 15.3882C37.0949 15.3819 37.1014 15.3758 37.1077 15.3698C37.1427 15.3364 37.174 15.3057 37.2001 15.2755L37.2784 15.1847L37.3536 15.2781C37.378 15.3083 37.4075 15.3395 37.4409 15.3739C37.4465 15.3797 37.4522 15.3855 37.458 15.3915C37.4858 15.42 37.5155 15.4504 37.543 15.4812C37.6067 15.5524 37.6783 15.6456 37.6898 15.7564M37.2716 18.4859L37.6898 15.7567C37.6898 15.7566 37.6898 15.7565 37.6898 15.7564M37.2716 18.4859L37.2755 18.485C37.3727 18.4616 37.4685 18.3824 37.5374 18.3022C37.6066 18.2216 37.6705 18.1149 37.6818 18.0137M37.2716 18.4859L37.6818 18.0137M37.6898 15.7564C37.7177 16.0131 37.7108 16.282 37.7041 16.5453C37.7011 16.6598 37.6982 16.7734 37.6982 16.8844C37.6982 16.9845 37.7007 17.0874 37.7032 17.192C37.7097 17.4613 37.7165 17.7415 37.6818 18.0137M37.6898 15.7564L37.6818 18.0137"
                          fill="#666666"
                          stroke="#666666"
                          strokeWidth="0.2"
                        ></path>
                        <path
                          d="M17.2673 7.27175L17.2673 7.27177C17.2759 7.8793 17.7748 8.38331 18.3741 8.38331C18.9723 8.38331 19.4805 7.87212 19.4809 7.27106C19.4891 6.64384 18.9711 6.13249 18.3491 6.14132L18.349 6.14132C17.7418 6.15019 17.2587 6.65523 17.2673 7.27175ZM18.2644 7.34594C18.2103 7.28773 18.1822 7.2452 18.1745 7.20917C18.1752 7.20664 18.1773 7.20057 18.1831 7.19C18.1947 7.16898 18.2146 7.14212 18.2445 7.10615C18.26 7.08753 18.278 7.06673 18.2976 7.04404C18.3247 7.01263 18.355 6.97758 18.3862 6.93959C18.416 6.97932 18.445 7.01604 18.471 7.04898C18.4897 7.07262 18.5068 7.09431 18.5216 7.11377C18.55 7.15124 18.5692 7.17946 18.5805 7.20167C18.5864 7.21314 18.5885 7.21993 18.5893 7.22307C18.5786 7.25741 18.5473 7.29779 18.489 7.35175C18.4681 7.37113 18.4467 7.38971 18.4238 7.4095C18.4138 7.41824 18.4034 7.42722 18.3927 7.43661C18.3857 7.44279 18.3785 7.44909 18.3714 7.45551C18.3537 7.43713 18.3359 7.41915 18.3191 7.40211C18.2988 7.3817 18.28 7.36266 18.2644 7.34594Z"
                          fill="#666666"
                          stroke="#666666"
                          strokeWidth="0.2"
                        ></path>
                      </svg>
                      <span className="text-2">Master Plan</span>
                    </div>
                  </Button>
                </Stack>
                <Stack>
                  <Button
                    onClick={() => {
                      setOpenLay(true);
                    }}
                    sx={{
                      width: "150px",
                      borderColor: "black",
                      padding: "5px",
                    }}
                    variant="outlined"
                  >
                    <div className="sc-6c7c04b6-0 hehFCg">
                      <span className="text-2">Layout</span>
                    </div>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            {inventory.Dis && (
              <>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", margin: "10px 0" }}
                >
                  Description
                </Typography>
                <ReactMarkdown>{inventory.Dis[lang]}</ReactMarkdown>
              </>
            )}
          </Col>
          <Divider />
        </Row>
        <Card
          sx={{
            position: "fixed",
            height: "100vh",
            zIndex: 100,
            top: "0",
            transition: "0.5s",
            right: open ? "0" : "-100%",
            padding: "100px 50px ",
            width: { sm: "90%", md: "50%", xs: "100%" },
          }}
        >
          <img
            style={{ width: "100%", maxHeight: "100%" }}
            src={inventory.Masterimg[0]}
            alt=""
          />
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            sx={{ position: "absolute", right: "25px", top: "55px" }}
          >
            <Close sx={{ color: "red" }} />
          </IconButton>
        </Card>
        <Card
          sx={{
            position: "fixed",
            height: "100vh",
            zIndex: 100,
            top: "0",
            transition: "0.5s",
            right: openlay ? "0" : "-100%",
            padding: "100px 50px ",
            width: { sm: "90%", md: "50%", xs: "100%" },
          }}
        >
          <img
            style={{ width: "100%", maxHeight: "100%" }}
            src={inventory.Layoutimg[0]}
            alt=""
          />
          <IconButton
            onClick={() => {
              setOpenLay(false);
            }}
            sx={{ position: "absolute", right: "25px", top: "55px" }}
          >
            <Close sx={{ color: "red" }} />
          </IconButton>
        </Card>
        <Card
          sx={{
            position: "fixed",
            height: "100vh",
            zIndex: 100,
            top: "0",
            transition: "0.5s",
            right: imgopen ? "0" : "-100%",
            padding: "100px 10px ",
            width: { sm: "90%", md: "70%", xs: "100%" },
          }}
        >
          <TransformWrapper initialScale={1}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <Controls />
                <TransformComponent>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={imgsrc}
                    alt=""
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
          <IconButton
            onClick={() => {
              setImgopen(false);
              setImgsrc("");
            }}
            sx={{ position: "absolute", right: "25px", top: "60px" }}
          >
            <Close sx={{ color: "red" }} />
          </IconButton>
        </Card>
      </Container>
    </Box>
  );
}

export default InventoryDetails;
