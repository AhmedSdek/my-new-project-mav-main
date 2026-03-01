import {
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Box,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";

function Search() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [serch, setSerch] = useState(null);
  const [menu, setMenu] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          compoundSnap,
          dealsSnap,
          newLaunchSnap,
          inventorySnap,
          developerSnap,
        ] = await Promise.all([
          getDocs(collection(db, "compound")),
          getDocs(collection(db, "deals")),
          getDocs(collection(db, "newlaunch")),
          getDocs(collection(db, "inventory")),
          getDocs(collection(db, "developer")),
        ]);

        const compounds = compoundSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          _type: "compound",
        }));
        const deals = dealsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          _type: "deals",
        }));
        const newLaunches = newLaunchSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          _type: "newLaunch",
        }));
        const inventorys = inventorySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          _type: "inventory",
        }));
        const developers = developerSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          _type: "developer",
        }));

        setAdminData([
          ...compounds,
          ...deals,
          ...newLaunches,
          ...inventorys,
          ...developers,
        ]);
      } catch (err) {
        console.error("خطأ أثناء تحميل البيانات:", err);
        setAdminError("فشل في تحميل البيانات.");
      } finally {
        setAdminLoading(false);
      }
    };
    fetchAllData();
  }, []);

  let firebasedata = [];
  if (serch && adminData.length) {
    const searchTerm = serch.toLowerCase();
    adminData.forEach((item) => {
      // نفس المنطق الخاص بك للفنلرة
      switch (item._type) {
        case "compound": {
          if (
            item.compoundName?.en?.toLowerCase().includes(searchTerm) ||
            item.compoundName?.ar?.toLowerCase().includes(searchTerm) ||
            item.district?.en?.toLowerCase().includes(searchTerm)
          ) {
            firebasedata.push({
              label: item.compoundName[currentLang] || item.compoundName.en,
              subLabel: item.district?.[currentLang] || item.district?.en,
              type: "Compound",
              link: `/developers/${item.devId}/${item.id}`,
            });
          }
          break;
        }
        case "deals":
          if (
            item.compoundName?.en?.toLowerCase().includes(searchTerm) ||
            item.compoundName?.ar?.toLowerCase().includes(searchTerm)
          ) {
            firebasedata.push({
              label: item.compoundName[currentLang] || item.compoundName.en,
              type: "Deal",
              link: `/maverickdeals/${item.id}`,
            });
          }
          break;
        case "newLaunch":
          if (
            item.launchName?.en?.toLowerCase().includes(searchTerm) ||
            item.launchName?.ar?.toLowerCase().includes(searchTerm)
          ) {
            firebasedata.push({
              label: item.launchName[currentLang] || item.launchName.en,
              type: "New Launch",
              link: `/newlaunches/${item.id}`,
            });
          }
          break;
        case "inventory":
          if (
            item.compoundName?.en?.toLowerCase().includes(searchTerm) ||
            item.compoundName?.ar?.toLowerCase().includes(searchTerm)
          ) {
            firebasedata.push({
              label: item.compoundName[currentLang] || item.compoundName.en,
              type: "Inventory",
              link: `/developers/${item.devId}/${item.compoundId}/${item.id}`,
            });
          }
          break;
        case "developer":
          if (
            item.devName?.en?.toLowerCase().includes(searchTerm) ||
            item.devName?.ar?.toLowerCase().includes(searchTerm)
          ) {
            firebasedata.push({
              label: item.devName[currentLang] || item.devName.en,
              icon: item.devIcon,
              type: "Developer",
              link: `/developers/${item.id}`,
            });
          }
          break;
        default:
          break;
      }
    });
  }

  return (
    <Stack
      component="form"
      sx={{
        width: "100%",
        maxWidth: "600px", // تحديد عرض البحث ليكون متناسقاً
        margin: "0 auto",
        position: "relative",
        zIndex: 1000,
      }}
      onSubmit={(e) => e.preventDefault()}>
      <TextField
        fullWidth
        placeholder={
          currentLang === "ar"
            ? "ابحث عن مطورين، مناطق، أو مشاريع..."
            : "Search for developers, areas, or compounds..."
        }
        variant="outlined"
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") {
            setSerch(null);
            setMenu(false);
          } else {
            setSerch(val.toLowerCase());
            setMenu(true);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "30px",
            backgroundColor: "#fff",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              "& fieldset": { borderColor: "#1976d2", borderWidth: "1px" },
            },
            "& fieldset": { border: "1px solid #eee" },
          },
        }}
      />

      {menu && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            maxHeight: "400px",
            overflowY: "auto",
            borderRadius: "15px",
            padding: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
          }}>
          {adminLoading ? (
            <Typography sx={{ p: 2, textAlign: "center" }}>
              Loading...
            </Typography>
          ) : firebasedata.length > 0 ? (
            firebasedata.map((item, index) => (
              <Box
                component="a"
                href={item.link}
                key={index}
                onClick={() => setMenu(false)}
                sx={{
                  textDecoration: "none",
                  display: "block",
                  mb: 0.5,
                  borderRadius: "10px",
                  transition: "0.2s",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ p: 1.5 }}>
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        bgcolor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <SearchIcon fontSize="small" sx={{ color: "#ccc" }} />
                    </Box>
                  )}

                  <Stack sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: "0.95rem",
                      }}>
                      {item.label}
                    </Typography>
                    {item.subLabel && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}>
                        {item.subLabel}
                      </Typography>
                    )}
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                    }}>
                    {item.type}
                  </Typography>
                </Stack>
              </Box>
            ))
          ) : (
            <Typography sx={{ p: 2, textAlign: "center", color: "gray" }}>
              No results found
            </Typography>
          )}
        </Paper>
      )}
    </Stack>
  );
}

export default memo(Search);
