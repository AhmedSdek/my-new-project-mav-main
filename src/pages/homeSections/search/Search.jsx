import { Paper, Stack, TextField, Typography } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useTranslation } from "react-i18next";

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

        const allData = [
          ...compounds,
          ...deals,
          ...newLaunches,
          ...inventorys,
          ...developers,
        ];
        setAdminData(allData);
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
      switch (item._type) {
        case "compound": {
          const compoundNameMatch =
            item.compoundName?.en?.toLowerCase().includes(searchTerm) ||
            item.compoundName?.ar?.toLowerCase().includes(searchTerm);
          const districtMatch =
            item.district?.en?.toLowerCase().includes(searchTerm) ||
            item.district?.ar?.toLowerCase().includes(searchTerm);

          if (compoundNameMatch || districtMatch) {
            firebasedata.push({
              label: item.compoundName[currentLang] || item.compoundName.en,
              subLabel: item.district?.[currentLang] || item.district?.en,
              type: "Compound",
              link: `developers/${item.devId}/${item.id}`,
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
              link: `maverickdeals/${item.id}`,
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
              link: ` newlaunches/${item.id}`,
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
              link: `developers/${item.devId}/${item.compoundId}/${item.id}`,
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
              link: `developers/${item.id}`,
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
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        paddingTop: "10px",
        position: "relative",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <TextField
        className="header-search"
        size="small"
        sx={{
          backgroundColor: "white",
          width: "100%",
          borderRadius: "10px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            height: "40px",
            padding: "0 12px",
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "10px 14px",
          },
        }}
        id="search"
        placeholder="Developers Or Area Or Compounds"
        type="search"
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
      />
      <Stack className="searchBox" sx={{ display: !menu && "none" }}>
        <Stack sx={{ width: "100%", gap: 1 }}>
          {adminLoading ? (
            <Typography>Loading...</Typography>
          ) : firebasedata.length > 0 ? (
            firebasedata.map((filter, index) => (
              <a
                className="searchLink"
                key={index}
                onClick={() => setSerch(null)}
                href={filter.link}
              >
                <Paper
                  sx={{
                    padding: "10px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                  elevation={3}
                >
                  {filter.icon && (
                    <img
                      src={filter.icon}
                      alt=""
                      style={{
                        width: "50px",
                        filter: "drop-shadow(0 0 10px rgba(0, 0, 0, .15))",
                      }}
                    />
                  )}
                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {filter.label}
                    </Typography>
                    {filter.subLabel && (
                      <Typography variant="caption" color="text.secondary">
                        {filter.subLabel}
                      </Typography>
                    )}
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: "rgb(240, 240, 240)",
                      padding: "1px 7px",
                      borderRadius: "10px",
                      color: "rgb(33, 36, 39)",
                      fontWeight: "bold",
                    }}
                  >
                    {filter.type}
                  </Typography>
                </Paper>
              </a>
            ))
          ) : (
            <Typography>Data Not Found!</Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default memo(Search);
