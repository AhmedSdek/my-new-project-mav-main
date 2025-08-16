import "./developers.css";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import MavLoading from "../../comp/Loading/MavLoading";
import { Box, Container, Stack, TextField } from "@mui/material";
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
        setFilteredData(developersData); // تخزين نسخة مبدئية
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, [country]);
  // تصفية البيانات عند تحديث نص البحث
  useEffect(() => {
    const results = developers.filter((item) =>
      item.devName[lang].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [searchTerm, developers]);
  if (error) return <p>حدث خطأ: {error}</p>;

  return (
    <Box sx={{ minHeight: "calc(100vh - 100px)", padding: "70px 0" }}>
      <h1 className="developers-title">
        {lang === "ar" ? "قائمة المطورين" : "DEVELOPERS FULL LIST"}
      </h1>
      <Container>
        <Stack
          component="form"
          sx={{
            flexDirection: "column",
            width: "70%",
            alignItems: "center",
            paddingTop: "10px",
            position: "relative",
            margin: "15px auto",
          }}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <TextField
            color="warning"
            sx={{
              backgroundColor: "white",
              width: "100%",
              borderRadius: "20px",
            }}
            id="outlined-search"
            placeholder="Developers Search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // تحديث نص البحث
          />
        </Stack>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 100px)",
            }}
          >
            <MavLoading />
          </div>
        ) : (
          <Stack
            sx={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                console.log(item);
                return (
                  <Stack
                    className="colDev"
                    key={index}
                    sx={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                    }}
                  >
                    <Link
                      style={{
                        width: "120px",
                        height: "120px",
                        padding: "0",
                        borderRadius: "50%",
                      }}
                      className="logo hoveredLogo d-flex align-items-center flex-column  inner"
                      to={`/developers/${item.id}`}
                    >
                      <img
                        style={{ height: "100%", width: "100%" }}
                        className="img-fluid img shadow-filter rounded-circle"
                        src={item.img}
                        alt={item.devName[lang]}
                      ></img>
                    </Link>
                  </Stack>
                );
              })
            ) : (
              <p>No results found</p>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
export default Developers;
