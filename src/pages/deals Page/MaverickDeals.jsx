import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  CardMedia,
} from "@mui/material";
import {
  BedroomParentOutlined,
  BathroomOutlined,
  AspectRatio,
  LocationOnOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
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
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === "ar";
  const [loading, setLoading] = useState(true);
  const { country } = useGlobal();

  const [filters, setFilters] = useState({
    price: [0, 100000000],
    area: [0, 10000],
    type: "",
    bed: "",
    bath: "",
    Finsh: "",
    sale: "",
    monyType: "",
    compoundName: "",
    search: "",
  });

  const defaultFilters = useMemo(
    () => ({
      price: [0, 100000000],
      area: [0, 10000],
      type: "",
      bed: "",
      bath: "",
      Finsh: "",
      sale: "",
      monyType: "",
      compoundName: "",
      search: "",
    }),
    []
  );

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

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const price = Number(deal.price);
      const area = Number(deal.Area);
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        deal.developer?.devName?.[lang]?.toLowerCase().includes(searchLower) ||
        deal.compoundName?.[lang]?.toLowerCase().includes(searchLower) ||
        deal.Location?.[lang]?.toLowerCase().includes(searchLower);

      return (
        price >= filters.price[0] &&
        price <= filters.price[1] &&
        area >= filters.area[0] &&
        area <= filters.area[1] &&
        (filters.type === "" || deal.Type?.[lang]?.includes(filters.type)) &&
        (filters.bed === "" || filters.bed == deal.Bed?.[lang]) &&
        (filters.bath === "" || filters.bath == deal.Bath?.[lang]) &&
        matchesSearch
      );
    });
  }, [deals, filters, lang]);

  const formatNum = (num) =>
    new Intl.NumberFormat(isAr ? "ar-EG" : "en-US").format(num);

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
    <Box
      sx={{
        py: 6,
        bgcolor: "#F8FAFC",
        minHeight: "100vh",
        direction: isAr ? "rtl" : "ltr",
      }}>
      <Container maxWidth="lg">
        {/* Compact Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
          spacing={2}>
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0A2540" }}>
              Maverick <span style={{ color: "#ff6e19" }}>Deals</span>
            </Typography>
          </Box>
          <ContactUsBtn sectionName="Maverick-Deals" />
        </Stack>

        {/* Filter Box */}
        <Box
          sx={{
            mb: 4,
            p: 0.5,
            bgcolor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}>
          <Filter
            data={deals}
            filters={filters}
            lang={lang}
            setFilters={setFilters}
            length={filteredDeals}
            defaultFilters={defaultFilters}
            label={{ ar: "بحث عن عقار...", en: "Search properties..." }}
          />
        </Box>

        <Grid container spacing={2.5}>
          {filteredDeals.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  transition: "0.3s",
                  position: "relative",
                  overflow: "visible", // للسماح لبعض العناصر بالخروج قليلاً إذا لزم الأمر
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  },
                }}>
                {/* Image Section */}
                <Box
                  sx={{
                    position: "relative",
                    height: 210,
                    m: 1,
                    borderRadius: "16px",
                    overflow: "hidden",
                    // إضافة ظل خفيف للصورة نفسها
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  }}>
                  <Link to={`/maverickdeals/${item.id}`}>
                    <CardMedia
                      component="img"
                      image={item.img[0]}
                      sx={{
                        height: "100%",
                        transition: "0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                  </Link>

                  {/* Overlay للتدرج اللوني - يجعل النصوص واضحة */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Top Badges: Sale & Delivery */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      right: 12,
                      width: "calc(100% - 24px)",
                    }}>
                    <Chip
                      label={item.Sale[lang]}
                      size="small"
                      sx={{
                        bgcolor: "#ff6e19",
                        color: "white",
                        fontWeight: 800,
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        height: 24,
                        boxShadow: "0 4px 10px rgba(255,110,25,0.4)",
                      }}
                    />

                    {item.delivery && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(8px)",
                          color: "white",
                          px: 1.2,
                          py: 0.4,
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}>
                        <AccessTimeOutlined sx={{ fontSize: 13 }} />
                        <Typography
                          sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
                          {item.delivery[lang]}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Bottom Price Section - Modern Glass Style */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: isAr ? "auto" : 12,
                      left: isAr ? 12 : "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isAr ? "flex-start" : "flex-end",
                    }}>
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: "1.2rem",
                        fontWeight: 900,
                        textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "baseline",
                        gap: 0.5,
                      }}>
                      {formatNum(item.price)}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#ff6e19",
                          bgcolor: "white",
                          px: 0.8,
                          py: 0.2,
                          borderRadius: "4px",
                          ml: isAr ? 0 : 0.5,
                          mr: isAr ? 0.5 : 0,
                        }}>
                        {item.monyType.en === "dollar"
                          ? isAr
                            ? "دولار"
                            : "$"
                          : isAr
                          ? "ج.م"
                          : "EGP"}
                      </Typography>
                    </Typography>
                  </Box>

                  {/* Sold Out Overlay */}
                  {item.sold.en === "SOLD OUT" && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backdropFilter: "blur(2px)",
                      }}>
                      <Typography
                        sx={{
                          border: "2px solid #ff4d4d",
                          color: "#ff4d4d",
                          fontWeight: 900,
                          px: 2,
                          py: 0.5,
                          bgcolor: "white",
                          transform: "rotate(-10deg)",
                          boxShadow: "0 0 20px rgba(255,77,77,0.3)",
                        }}>
                        {item.sold[lang]}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ p: "12px 16px !important" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "#0A2540",
                      mb: 0.5,
                      height: 28,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                    {item.Type[lang]} {isAr ? "في" : "in"}{" "}
                    {item.compoundName[lang]}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mb: 1.5, opacity: 0.7 }}>
                    <LocationOnOutlined
                      sx={{ fontSize: 14, color: "#ff6e19" }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {item.Location[lang]}
                    </Typography>
                  </Stack>

                  <Divider sx={{ mb: 1.5, opacity: 0.5 }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Stack direction="row" spacing={1.5}>
                      <Box sx={{ textAlign: "center" }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.3}>
                          <BedroomParentOutlined
                            sx={{ fontSize: 14, color: "#0A2540" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700 }}>
                            {item.Bed[lang]}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.3}>
                          <BathroomOutlined
                            sx={{ fontSize: 14, color: "#0A2540" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700 }}>
                            {item.Bath[lang]}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.3}>
                          <AspectRatio
                            sx={{ fontSize: 14, color: "#0A2540" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700 }}>
                            {formatNum(item.Area)} m²
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    <ContactUsIcon
                      sectionName="Maverick-Deals"
                      sectionData={item}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredDeals.length === 0 && (
            <Grid item xs={12} sx={{ textAlign: "center", py: 10 }}>
              <Box
                component="img"
                src={im}
                sx={{ width: 80, opacity: 0.3, mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No Units Found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default MaverickDeals;