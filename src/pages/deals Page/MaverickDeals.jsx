import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Badge,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Slider,
  IconButton,
  Collapse,
  SwipeableDrawer,
  Grid,
} from "@mui/material";
import {
  BedroomParentOutlined,
  BathroomOutlined,
  AspectRatio,
  Tune,
  Close,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase/config";
import { useGlobal } from "../../context/GlobalContext";
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import ContactUsIcon from "../../comp/Contact Us/ContactUsIcon";
import MavLoading from "../../comp/Loading/MavLoading";
import im from "./2238332.png";
import Filter from "../../comp/filter/Filter";
function MaverickDeals() {
  const [deals, setDeals] = useState([]);
  // console.log(deals);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [loading, setLoading] = useState(true);
  const { country } = useGlobal();
  const [filters, setFilters] = useState({
    price: [0, 10000000],
    area: [0, 10000],
    type: "",
    bed: "",
    bath: "",
    Finsh: "",
    sale: "",
    monyType: "",
    compoundName: "",
    search: "", // 🔍 هنا السيرش
  });
  const defaultFilters = useMemo(() => {
    return {
      price: [0, 10000000],
      area: [0, 10000],
      type: "",
      bed: "",
      bath: "",
      Finsh: "",
      sale: "",
      monyType: "",
      compoundName: "",
      search: "", // 🔍 هنا السيرش
    };
  }, []);
  useEffect(() => {
    const fetchDeals = async () => {
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

  // const handleSliderChange = (type) => (event, newValue) => {
  //   setFilters((prev) => ({ ...prev, [type]: newValue }));
  // };

  const filteredDeals = deals.filter((deal) => {
    const price = Number(deal.price);
    const area = Number(deal.Area);
    const type = deal.Type?.[lang]?.toLowerCase() || "";
    const bed = deal.Bed?.[lang];
    const bath = deal.Bath?.[lang];
    const Finsh = deal.Finsh?.[lang];
    const sale = deal.Sale?.[lang];
    const monyType = deal.monyType?.[lang];
    const compoundName = deal.compoundName?.[lang];
    const devName = deal.developer.devName?.[lang]?.toLowerCase() || "";
    const Location = deal.Location?.[lang]?.toLowerCase() || "";

    const searchLower = filters.search.toLowerCase();

    const matchesSearch =
      !filters.search ||
      devName.includes(searchLower) ||
      compoundName?.toLowerCase().includes(searchLower) ||
      Location?.toLowerCase().includes(searchLower) ||
      type.includes(searchLower);

    return (
      price >= filters.price[0] &&
      price <= filters.price[1] &&
      area >= filters.area[0] &&
      area <= filters.area[1] &&
      (filters.type === "" || type.includes(filters.type.toLowerCase())) &&
      (filters.bed === "" || filters.bed == bed) &&
      (filters.bath === "" || filters.bath == bath) &&
      (filters.Finsh === "" || filters.Finsh == Finsh) &&
      (filters.sale === "" || filters.sale == sale) &&
      (filters.monyType === "" || filters.monyType == monyType) &&
      (filters.compoundName === "" || filters.compoundName == compoundName) &&
      matchesSearch // ✅ شرط السيرش
    );
  });
  const label = useMemo(() => {
    return {
      ar: "البحث بالكمبوند، الموقع،المطور",
      en: "Search by Compound, Location, Developer",
    };
  }, [lang]);
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 100px)",
        }}
      >
        <MavLoading />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "70px 0 0",
        minHeight: "calc(100vh - 100px)",
        position: "relative",
      }}
    >
      <Container>
        <Stack sx={{ gap: 2 }}>
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div className="header">
              <h1
                style={{
                  fontFamily: "materialBold",
                  fontSize: "20px",
                  color: "rgb(30, 65, 100)",
                  textTransform: "uppercase",
                  letterSpacing: "4.14px",
                }}
              >
                Explore All
                <span
                  style={{
                    color: "rgb(255 110 25)",
                    fontSize: "40px",
                    verticalAlign: "middle",
                    letterSpacing: "0px",
                  }}
                >
                  Deals
                </span>
              </h1>
              <h2
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "2.34px",
                  color: "rgb(100, 100, 100)",
                  fontSize: "18px",
                }}
              >
                Be the first one to Reserve your Unit
              </h2>
            </div>
            <ContactUsBtn sectionName="Maverick-Deals" />
          </Stack>

          <Filter
            data={deals}
            filters={filters}
            lang={lang}
            setFilters={setFilters}
            label={label}
            length={filteredDeals}
            defaultFilters={defaultFilters}
          />

          {/* <Stack
            sx={{
              flexDirection: "row",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label={`${
                lang === "ar"
                  ? "البحث بالكمبوند، الموقع،المطور"
                  : "Search by Compound, Location, Developer"
              }`}
              variant="outlined"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <IconButton
              onClick={() => setOpenFilterDrawer(true)}
              sx={{
                borderRadius: 1,
                width: 40,
                height: 40,
                backgroundColor: "#f5f5f5", // اختياري
                "&:hover": {
                  backgroundColor: "#e0e0e0", // اختياري
                },
              }}
            >
              <Tune />
            </IconButton>
          </Stack> */}
          {/* ✅ الفلاتر */}
          {/* <SwipeableDrawer
            anchor="bottom"
            open={openFilterDrawer}
            onClose={() => setOpenFilterDrawer(false)}
            onOpen={() => setOpenFilterDrawer(true)}
          >
            <Container>
              <Stack sx={{ padding: "10px" }}>
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: 2,
                    padding: "15px",
                  }}
                >
                  <IconButton
                    onClick={() => setOpenFilterDrawer(false)}
                    sx={{
                      borderRadius: 1, // 0 للمربع التام، أو 1 (يعني 4px) لمربع بزوايا خفيفة
                      width: 40,
                      height: 40,
                      backgroundColor: "#f5f5f5", // اختياري
                      "&:hover": {
                        backgroundColor: "#e0e0e0", // اختياري
                      },
                    }}
                  >
                    <Close color="error" />
                  </IconButton>
                  <Typography
                    sx={{
                      fontFamily: "materialBold",
                      fontSize: "20px",
                      color: "rgb(30, 65, 100)",
                      textTransform: "uppercase",
                      letterSpacing: "4.14px",
                    }}
                  >
                    {lang === "ar" ? "خيارات البحث" : "Filter options"}
                  </Typography>
                </Stack>
                <Grid
                  container
                  spacing={4}
                  sx={{
                    px: 4,
                    justifyContent: { xs: "center", md: "initial" },
                  }}
                >

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        label="Type"
                        value={filters.type}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(
                          new Set(deals.map((d) => d.Type?.[lang]))
                        ).map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel>Bedrooms</InputLabel>
                      <Select
                        label="Bedrooms"
                        value={filters.bed}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            bed: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {[...new Set(deals.map((d) => d.Bed?.[lang]))].map(
                          (bed, index) => (
                            <MenuItem key={index} value={bed}>
                              {bed}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel>Bath</InputLabel>
                      <Select
                        label="Bath"
                        value={filters.bath}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            bath: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {[...new Set(deals.map((d) => d.Bath?.[lang]))].map(
                          (bath, index) => (
                            <MenuItem key={index} value={bath}>
                              {bath}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel>Finishing</InputLabel>
                      <Select
                        label="Finishing"
                        value={filters.Finsh}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            Finsh: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(
                          new Set(deals.map((d) => d.Finsh?.[lang]))
                        ).map((Finsh) => (
                          <MenuItem key={Finsh} value={Finsh}>
                            {Finsh}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel>Sale</InputLabel>
                      <Select
                        label="Sale"
                        value={filters.sale}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            sale: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(
                          new Set(deals.map((d) => d.Sale?.[lang]))
                        ).map((sale) => (
                          <MenuItem key={sale} value={sale}>
                            {sale}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel>Money Type</InputLabel>
                      <Select
                        label="Money Type"
                        value={filters.monyType}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            monyType: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(
                          new Set(deals.map((d) => d.monyType?.[lang]))
                        ).map((mony) => (
                          <MenuItem key={mony} value={mony}>
                            {mony}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel>Compound</InputLabel>
                      <Select
                        label="Compound"
                        value={filters.compoundName}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            compoundName: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(
                          new Set(deals.map((d) => d.compoundName?.[lang]))
                        ).map((compound, index) => (
                          <MenuItem key={index} value={compound}>
                            {compound}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>
                <Grid container spacing={4} sx={{ p: "20px" }}>
                  <Grid item size={{ xs: 12, sm: 6 }} sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom>Price Range</Typography>
                    <Slider
                      value={filters.price}
                      onChange={handleSliderChange("price")}
                      valueLabelDisplay="auto"
                      step={100000}
                      min={0}
                      max={10000000}
                    />
                  </Grid>

                  <Grid item size={{ xs: 12, sm: 6 }} sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom>Area Range (m²)</Typography>
                    <Slider
                      value={filters.area}
                      onChange={handleSliderChange("area")}
                      valueLabelDisplay="auto"
                      step={10}
                      min={0}
                      max={10000}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Container>
          </SwipeableDrawer> */}

          {/* ✅ عرض الكروت */}
          <Row>
            {filteredDeals.length > 0 ? (
              filteredDeals.map((item, index) => (
                <Col
                  className="col-sm-6 col-12 col-lg-4 col-md-6"
                  key={index}
                  style={{ marginBottom: "15px" }}
                >
                  <Card
                    sx={{
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Link
                      to={`/maverickdeals/${item.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Stack>
                        <Box sx={{ height: "215px" }}>
                          <img
                            src={item.img[0]}
                            alt={item.Type[lang]}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <CardContent sx={{ padding: "15px" }}>
                          <Stack>
                            <Typography variant="h6" fontWeight="bold">
                              {`${item.Type[lang]} in ${item.compoundName[lang]}`}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "gray" }}
                            >
                              {item.Location[lang]}
                            </Typography>
                          </Stack>
                          <Typography sx={{ pt: 1 }}>
                            <img
                              style={{ width: "25px", height: "25px" }}
                              src={im}
                              alt=""
                            />
                            {` ${item.delivery[lang]}`}
                          </Typography>
                          <Stack direction="row" sx={{ gap: 2 }} mt={2}>
                            <Badge
                              badgeContent={item.Bed[lang]}
                              color="primary"
                            >
                              <BedroomParentOutlined />
                            </Badge>
                            <Badge
                              badgeContent={item.Bath[lang]}
                              color="primary"
                            >
                              <BathroomOutlined />
                            </Badge>
                            <Stack sx={{ flexDirection: "row" }}>
                              <Badge
                                badgeContent={item.Area}
                                max={99999}
                                color="primary"
                              >
                                <AspectRatio />
                              </Badge>
                              &nbsp;m²
                            </Stack>
                          </Stack>
                          <Box
                            sx={{
                              position: "absolute",
                              top: 16,
                              backgroundColor: "rgb(255 145 77)",
                              color: "white",
                              borderRadius: "50%",
                              width: "50px",
                              height: "50px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography fontWeight="bold" color="#1e4164">
                              {`${item.Sale[lang]}`}
                            </Typography>
                          </Box>
                          {item.sold.en === "SOLD OUT" && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: "20px",
                                right: "5px",
                                backgroundColor: "white",
                                color: "red",
                                borderRadius: " 5px ",
                                border: "2px solid red",
                                width: "100px",
                                height: "30px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  color: "white",
                                  backgroundColor: "red",
                                  width: "95%",
                                  textAlign: "center",
                                }}
                              >
                                {`${item.sold[lang]}`}
                              </Typography>
                            </Box>
                          )}
                          <Typography fontWeight="bold">
                            {`${Intl.NumberFormat("en-US").format(
                              item.price
                            )} ${
                              item.monyType.en === "dollar"
                                ? lang === "ar"
                                  ? "دولار"
                                  : "$"
                                : lang === "ar"
                                ? "جم"
                                : "EGP"
                            }`}
                          </Typography>
                        </CardContent>
                      </Stack>
                    </Link>
                    <Stack
                      sx={{
                        p: "0 10px 10px 0",
                        flexDirection: "row",
                        justifyContent: "end",
                      }}
                    >
                      <ContactUsIcon
                        sectionName="Maverick-Deals"
                        sectionData={item}
                      />
                    </Stack>
                  </Card>
                </Col>
              ))
            ) : (
              <Stack alignItems="center" justifyContent="center" height="100%">
                <Typography>No Deals Found!</Typography>
              </Stack>
            )}
          </Row>
        </Stack>
      </Container>
    </Box>
  );
}

export default MaverickDeals;
