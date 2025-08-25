import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import "./min.css";
import logoPhoto from "./log.webp";
import { Link, NavLink } from "react-router-dom";
import { db } from "../firebase/config";
import { Button, Stack, ToggleButton, Tooltip } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FavoriteBorder, FormatBold } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../context/GlobalContext";
function Navs() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country, setCountry } = useGlobal();
  const [loadingcompound, setLoadingcompound] = useState(true);
  const [errorcompound, setErrorcompound] = useState(null);
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    const fetchcompounds = async () => {
      try {
        const q = query(
          collection(db, "compound"),
          where("countryKey", "==", country.en)
        );
        const snapshot = await getDocs(q);
        const compoundsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const allDistricts = compoundsData.map((item) => item.district);

        // إزالة التكرارات بناءً على القيمة `en` مثلاً
        const uniqueDistricts = allDistricts.filter(
          (district, index, self) =>
            index ===
            self.findIndex(
              (d) =>
                d.en.toLowerCase() === district.en.toLowerCase() &&
                d.ar === district.ar
            )
        );
        setDistricts(uniqueDistricts);
      } catch (err) {
        setErrorcompound(err.message);
      } finally {
        setLoadingcompound(false);
      }
    };

    fetchcompounds();
  }, [country]);

  const handleToggleLanguage = () => {
    window.location.reload();
    const newLang = lang === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };
  const handleToggleCountry = () => {
    const newCountry =
      country.en === "egypt"
        ? { en: "uae", ar: "الامارات" }
        : { en: "egypt", ar: "مصر" };
    setCountry(newCountry);
    localStorage.setItem("selectedCountry", JSON.stringify(newCountry));
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        fixed="top"
        expand="lg"
        data-bs-theme="dark"
        id="navs"
      >
        <Container>
          <Link aria-label="Home" to="/" style={{ width: "150px" }}>
            <img
              style={{ height: "42px", width: "150px" }}
              src={logoPhoto}
              alt=""
            />
          </Link>
          <Navbar.Toggle id="navbar-toggler" aria-controls="navbarScroll" />
          <Navbar.Collapse
            id="navbarScroll"
            style={{ justifyContent: "center" }}
          >
            <Nav style={{ fontSize: "15px" }}>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {lang === "ar" ? "الصفحه الرئيسيه " : "Home"}
              </NavLink>
              <NavDropdown
                title={lang === "ar" ? "المناطق" : "Districts"}
                id="navbarScrollingDropdown"
              >
                {districts.map((link, index) => {
                  return (
                    <NavDropdown.Item
                      as={Link}
                      key={index}
                      className="dropdown-item"
                      to={`/${link.en}`}
                      eventKey="0"
                    >
                      {link[lang]}
                    </NavDropdown.Item>
                  );
                })}
              </NavDropdown>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/sell"
                eventKey="0"
              >
                {lang === "ar" ? "بيع-إيجار" : "Sell-Rent"}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/newlaunches"
                eventKey="0"
              >
                {lang === "ar" ? "وحدات جديده" : "New Launches"}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/contact"
                eventKey="0"
              >
                {lang === "ar" ? "اتصل بنا" : "Contact Us"}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/about"
                eventKey="0"
              >
                {lang === "ar" ? "عنا" : "About"}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/maverickdeals"
                eventKey="0"
              >
                {lang === "ar" ? "عروض مافريك" : "Maverick Deals"}
              </NavLink>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse
            id="navbarScroll2"
            style={{ justifyContent: "end", flexGrow: 0 }}
          >
            <Nav
              style={{
                gap: "10px",
              }}
            >
              <Stack sx={{ flexDirection: "row" }}>
                <ToggleButton
                  sx={{
                    color: "white",
                    p: 1,
                    width: "100%",
                    border: "none",
                    "&.Mui-selected": {
                      color: "white",
                      backgroundColor: "#1976d2",
                      p: 1,
                    },
                  }}
                  onClick={handleToggleLanguage}
                  value={lang}
                  aria-label="language toggle"
                >
                  {lang === "en" ? "عربي" : "English"}
                </ToggleButton>
                <ToggleButton
                  sx={{
                    color: "white",
                    p: 1,
                    width: "100%",
                    border: "none",
                    "&.Mui-selected": {
                      color: "white",
                      backgroundColor: "#1976d2",
                      p: 1,
                    },
                  }}
                  onClick={handleToggleCountry}
                  value={country}
                  aria-label="language toggle"
                >
                  {lang === "en"
                    ? country.en === "egypt"
                      ? "UAE"
                      : "Egypt"
                    : country.en === "egypt"
                    ? "الامارات"
                    : "مصر"}
                </ToggleButton>
              </Stack>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
export default Navs;
