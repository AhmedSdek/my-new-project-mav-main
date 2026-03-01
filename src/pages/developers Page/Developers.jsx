import "./developers.css";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import MavLoading from "../../comp/Loading/MavLoading";
import {
  Box,
  Container,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";

function Developers() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
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
        setFilteredData(developersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (country?.en) fetchDevelopers();
  }, [country]);

  useEffect(() => {
    const results = developers.filter((item) =>
      item.devName[lang]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [searchTerm, developers, lang]);

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={5}>
        حدث خطأ: {error}
      </Typography>
    );

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", pb: 5 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}>
          <MavLoading />
        </Box>
      ) : (
        <Stack
          sx={{
            marginTop: { xs: "60px", md: "80px" },
            alignItems: "center",
          }}>
          {/* العنوان */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              mb: 4,
              fontFamily: lang === "ar" ? "'Cairo', sans-serif" : "inherit",
              textAlign: "center",
            }}>
            {lang === "ar" ? "قائمة المطورين" : "DEVELOPERS FULL LIST"}
          </Typography>

          <Container>
            {/* حقل البحث */}
            <Box
              sx={{
                width: { xs: "100%", md: "60%" },
                margin: "0 auto 40px auto",
              }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={
                  lang === "ar" ? "بحث عن مطور..." : "Search for a developer..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "orange" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "30px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                    "& fieldset": { border: "none" },
                    "&:hover": { boxShadow: "0px 6px 15px rgba(0,0,0,0.1)" },
                  },
                }}
              />
            </Box>

            {/* شبكة المطورين */}
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              spacing={{ xs: 2, sm: 4 }}
              justifyContent="center"
              sx={{ width: "100%" }}>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <Stack
                    key={item.id}
                    component={Link}
                    to={`/developers/${item.id}`}
                    spacing={1}
                    alignItems="center"
                    sx={{
                      textDecoration: "none",
                      width: { xs: "110px", sm: "140px" },
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        "& .MuiAvatar-root": {
                          boxShadow: "0px 10px 20px rgba(255, 165, 0, 0.3)",
                        },
                        "& .dev-name": {
                          color: "orange",
                        },
                      },
                    }}>
                    <Avatar
                      src={item.img}
                      alt={item.devName[lang]}
                      sx={{
                        width: { xs: 90, sm: 120 },
                        height: { xs: 90, sm: 120 },
                        border: "3px solid white",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Typography
                      className="dev-name"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#444",
                        textAlign: "center",
                        transition: "0.3s",
                        mt: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                      {item.devName[lang]}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Typography sx={{ mt: 4, color: "#888" }}>
                  {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                </Typography>
              )}
            </Stack>
          </Container>
        </Stack>
      )}
    </Box>
  );
}

export default Developers;