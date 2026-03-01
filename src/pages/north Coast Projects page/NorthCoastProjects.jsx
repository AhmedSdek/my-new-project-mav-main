import {
  Badge,
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
  Paper,
  Slider,
  Button,
  Collapse,
} from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase/config";
import { useTranslation } from "react-i18next";
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BathroomOutlined,
  BedroomParentOutlined,
  GroupsOutlined,
  CalendarMonth,
  RestartAlt,
  LocationOn,
  Business,
  Tune, // أيقونة الفلتر
} from "@mui/icons-material";
import MavLoading from "../../comp/Loading/MavLoading";

function NorthCoastProjects() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [northCoast, setNorthCoast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false); // حالة إظهار الفلتر

  // --- حالات الفلترة ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [rooms, setRooms] = useState("all");
  const [baths, setBaths] = useState("all");
  const [unitType, setUnitType] = useState("all");
  const [developer, setDeveloper] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);

  useEffect(() => {
    const fetchnorthCoast = async () => {
      try {
        const q = query(collection(db, "northcoast"));
        const snapshot = await getDocs(q);
        const northCoastData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNorthCoast(northCoastData);

        if (northCoastData.length > 0) {
          const maxPrice = Math.max(...northCoastData.map((p) => p.price || 0));
          setPriceRange([0, maxPrice + 1000]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchnorthCoast();
  }, []);

  const filteredProjects = useMemo(() => {
    return northCoast.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.compoundName[lang]?.toLowerCase().includes(searchLower) ||
        item.Location[lang]?.toLowerCase().includes(searchLower);

      let matchesDate = true;
      if (selectedDate) {
        const picked = new Date(selectedDate);
        matchesDate =
          picked >= new Date(item.startDate) &&
          picked <= new Date(item.endDate);
      }

      const matchesRooms = rooms === "all" || item.Bed.en === rooms;
      const matchesBaths = baths === "all" || item.Bath.en === baths;
      const matchesType = unitType === "all" || item.Type.en === unitType;
      const matchesDev =
        developer === "all" || item.developer.devName.en === developer;
      const matchesPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];

      return (
        matchesSearch &&
        matchesDate &&
        matchesRooms &&
        matchesBaths &&
        matchesType &&
        matchesDev &&
        matchesPrice
      );
    });
  }, [
    northCoast,
    searchTerm,
    selectedDate,
    rooms,
    baths,
    unitType,
    developer,
    priceRange,
    lang,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setRooms("all");
    setBaths("all");
    setUnitType("all");
    setDeveloper("all");
    setPriceRange([0, 100000]);
  };

  const formatNum = (num) =>
    num?.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  if (error)
    return <Box sx={{ p: 5, textAlign: "center" }}>حدث خطأ: {error}</Box>;

  return (
    <Stack sx={{ minHeight: "100vh", bgcolor: "#f4f7f9", py: 10 }}>
      <Container>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e4164" }}>
              {lang === "ar" ? "استكشف " : "EXPLORE "}
              <span style={{ color: "#ff6e19" }}>
                {lang === "ar" ? "الساحل الشمالي" : "NORTH COAST"}
              </span>
            </Typography>
          </Box>
          <ContactUsBtn sectionName="North-Coast-Filter-Page" />
        </Stack>

        {/* --- Modern Filter Section --- */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 1 }, // تقليل البادينج في الشاشات الكبيرة لجعله أنحف
            mb: 6,
            borderRadius: { xs: "20px", md: "100px" }, // شكل دائري (Pill shape) في الديسكتوب
            border: "1px solid #eef2f6",
            boxShadow: "0 10px 30px rgba(30, 65, 100, 0.08)",
            bgcolor: "#fff",
          }}>
          <Grid container spacing={1} alignItems="center" sx={{ p: { md: 1 } }}>
            {/* 1. السيرش الأساسي - أخذ مساحة أكبر */}
            <Grid item xs={12} md={5} lg={6}>
              <TextField
                fullWidth
                placeholder={
                  lang === "ar"
                    ? "إلى أين تريد الذهاب؟"
                    : "Where are you going?"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="standard" // تغيير الاستايل ليكون أخف
                InputProps={{
                  disableUnderline: true, // إلغاء الخط السفلي التقليدي
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 2 }}>
                      <LocationOn
                        sx={{ color: "#ff6e19", fontSize: "1.5rem" }}
                      />
                    </InputAdornment>
                  ),
                  sx: {
                    height: "50px",
                    fontSize: "1.1rem",
                    fontWeight: "500",
                    px: 1,
                  },
                }}
              />
            </Grid>

            {/* فاصل مرئي في الديسكتوب فقط */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                width: "1px",
                height: "30px",
                bgcolor: "#e0e6ed",
                mx: 1,
              }}
            />

            {/* 2. تاريخ التوافر */}
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: "#1e4164" }} />
                      <Typography
                        sx={{
                          ml: 1,
                          color: "#9e9e9e",
                          fontSize: "0.8rem",
                          display: { xs: "none", lg: "block" },
                        }}>
                        {lang === "ar" ? "التاريخ" : "Date"}
                      </Typography>
                    </InputAdornment>
                  ),
                  sx: { height: "50px", px: 1 },
                }}
              />
            </Grid>

            {/* 3. زر الفلاتر والبحث */}
            <Grid item xs={12} md={3} lg={2}>
              <Stack direction="row" spacing={1} sx={{ height: "50px" }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  sx={{
                    borderRadius: { xs: "12px", md: "50px" },
                    bgcolor: "#1e4164",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#122a41",
                      boxShadow: "0 4px 12px rgba(30,65,100,0.2)",
                    },
                  }}
                  startIcon={<Tune />}>
                  {lang === "ar" ? "تخصيص" : "Filters"}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* الجزء المخفي (Advanced Filters) بتصميم أكثر أناقة */}
          <Collapse in={showAdvanced}>
            <Box
              sx={{
                mt: 2,
                p: { xs: 2, md: 4 },
                borderTop: "1px solid #f0f3f7",
                bgcolor: "#fafbfc",
                borderRadius: "0 0 40px 40px",
              }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#748ba7",
                      fontWeight: 700,
                      mb: 1,
                      display: "block",
                    }}>
                    {lang === "ar" ? "نوع الوحدة" : "UNIT TYPE"}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: "#fff",
                      },
                    }}>
                    <MenuItem value="all">
                      {lang === "ar" ? "كل الأنواع" : "All Types"}
                    </MenuItem>
                    <MenuItem value="Chalet">
                      {lang === "ar" ? "شاليه" : "Chalet"}
                    </MenuItem>
                    <MenuItem value="Villa">
                      {lang === "ar" ? "فيلا" : "Villa"}
                    </MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#748ba7",
                      fontWeight: 700,
                      mb: 1,
                      display: "block",
                    }}>
                    {lang === "ar" ? "غرف النوم" : "BEDROOMS"}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: "#fff",
                      },
                    }}>
                    <MenuItem value="all">Any</MenuItem>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <MenuItem key={n} value={n.toString()}>
                        {n}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#748ba7",
                      fontWeight: 700,
                      mb: 1,
                      display: "block",
                    }}>
                    {lang === "ar" ? "المطور" : "DEVELOPER"}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: "#fff",
                      },
                    }}>
                    <MenuItem value="all">All Developers</MenuItem>
                    {[
                      ...new Set(northCoast.map((i) => i.developer.devName.en)),
                    ].map((dev) => (
                      <MenuItem key={dev} value={dev}>
                        {dev}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#748ba7",
                      fontWeight: 700,
                      mb: 1,
                      display: "block",
                    }}>
                    {lang === "ar" ? "نطاق السعر (جنيه)" : "PRICE RANGE"}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={200000}
                    sx={{ color: "#ff6e19", py: 2 }}
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" fontWeight="bold">
                      {formatNum(priceRange[0])} ج.م
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {formatNum(priceRange[1])} ج.م
                    </Typography>
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    startIcon={<RestartAlt />}
                    onClick={resetFilters}
                    sx={{
                      color: "#ff4d4d",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}>
                    {lang === "ar" ? "إعادة تعيين" : "Reset All"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Paper>

        {/* Results Section */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
            <MavLoading />
          </Box>
        ) : (
          <Row>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((itm) => (
                <Col
                  key={itm.id}
                  className="col-md-6 col-12 col-lg-4"
                  style={{ marginBottom: "30px" }}>
                  <Link
                    to={`/northCoast/${itm.id}`}
                    style={{ textDecoration: "none" }}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: "15px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        },
                      }}>
                      <Box sx={{ height: "220px", position: "relative" }}>
                        <img
                          src={itm.img[0]}
                          alt={itm.compoundName[lang]}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Badge
                          badgeContent={itm.Type[lang]}
                          sx={{
                            position: "absolute",
                            top: 20,
                            right: 40,
                            "& .MuiBadge-badge": {
                              backgroundColor: "#ff6e19",
                              color: "white",
                              padding: "12px",
                              borderRadius: "5px",
                            },
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#1e4164", mb: 1 }}>
                          {itm.compoundName[lang]}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 2, color: "text.secondary" }}>
                          <LocationOn fontSize="small" />
                          <Typography variant="body2">
                            {itm.Location[lang]}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}>
                            <BedroomParentOutlined
                              fontSize="small"
                              color="primary"
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {itm.Bed[lang]}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}>
                            <BathroomOutlined
                              fontSize="small"
                              color="primary"
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {itm.Bath[lang]}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}>
                            <GroupsOutlined fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="bold">
                              {formatNum(itm.peopleNumber)}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Box
                          sx={{
                            bgcolor: "#f0f7ff",
                            p: 1.5,
                            borderRadius: "8px",
                            mb: 2,
                          }}>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "#1e4164",
                              fontSize: "1.1rem",
                            }}>
                            {formatNum(itm.price)}{" "}
                            {lang === "ar" ? "ج.م" : "EGP"}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Business
                            fontSize="small"
                            sx={{ color: "#ff6e19" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold" }}>
                            {itm.developer.devName[lang]}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Link>
                </Col>
              ))
            ) : (
              <Box sx={{ textAlign: "center", width: "100%", py: 10 }}>
                <Typography variant="h5" color="textSecondary">
                  {lang === "ar"
                    ? "لا توجد مشاريع تطابق هذه الفلاتر"
                    : "No projects match these filters"}
                </Typography>
              </Box>
            )}
          </Row>
        )}
      </Container>
    </Stack>
  );
}

export default NorthCoastProjects;