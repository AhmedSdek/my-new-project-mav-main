import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../../../firebase/config";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import MavLoading from "../../../Loading/MavLoading";

function EditCity() {
  // const [value, loading, error] = useCollection(
  //     collection(db, 'cityscape')
  // );
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [cityscape, setCityscape] = useState([]);
  console.log(cityscape);
  const [cityscapeLoading, setCityscapeLoading] = useState(true);
  const [deletLoading, setDeletLoading] = useState(false);

  useEffect(() => {
    const fetchcityscape = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cityscape"));
        const city = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCityscape(city);
      } catch (err) {
        console.error("خطأ أثناء جلب الديل:", err);
      } finally {
        setCityscapeLoading(false);
      }
    };
    fetchcityscape();
  }, []);
  const handleDelete = async (id) => {
    try {
      setDeletLoading(true);
      await deleteDoc(doc(db, "cityscape", id));
      setCityscape((prev) => prev.filter((deal) => deal.id !== id));
      setDeletLoading(false);
      console.log("✅ تم الحذف بنجاح");
    } catch (error) {
      setDeletLoading(false);
      console.error("❌ خطأ أثناء الحذف:", error);
    }
  };
  if (cityscapeLoading) {
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
    <Box sx={{ minHeight: "calc(100vh - 100px)", padding: "70px 0" }}>
      <h2> {lang === "ar" ? "تعديل السيتي سكيب" : "cityscape Edit page"} </h2>
      <Container>
        <Stack
          sx={{
            flexDirection: "row",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {cityscape.map((project, index) => {
            // console.log(project.data())
            return (
              <Card
                key={index}
                sx={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f6f7f7",
                  gap: 2,
                }}
              >
                <Stack
                  className="colDev"
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Link to={`/developers/${project.developer.devName[lang]}`}>
                    <img
                      className="img shadow-filter "
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                      }}
                      src={project.developer.img}
                      alt={project.developer.devName.en}
                    />
                  </Link>
                  <Stack>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {project.cityscapeName[lang]}
                    </Typography>
                    <Typography variant="caption">
                      {project.developer.devName[lang]}
                    </Typography>
                    <Typography variant="caption">
                      {project.Location[lang]}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack sx={{ gap: 2, alignItems: "center", width: "100%" }}>
                  <Stack
                    divider={
                      <Divider
                        sx={{
                          borderColor: "black",
                          opacity: "1",
                          borderWidth: "1px",
                          height: "100%",
                        }}
                      />
                    }
                    sx={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack sx={{ padding: "5px 10px ", alignItems: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: "#ff914d",
                          fontSize: "20px",
                        }}
                      >
                        {`${project.downPayment}%`}
                      </Typography>
                      <Typography>
                        {lang === "ar" ? "مقدم" : "Downpayment"}
                      </Typography>
                    </Stack>

                    <Stack sx={{ padding: "5px 10px ", alignItems: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: "#ff914d",
                          fontSize: "20px",
                        }}
                      >
                        {`${project.years} ${
                          lang === "ar" ? "عدد السنين" : "Years"
                        }`}
                      </Typography>
                      <Typography>
                        {lang === "ar" ? "أقساط" : "Installments"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Divider
                  sx={{
                    // borderColor: "white",
                    opacity: "1",
                    borderWidth: "1px",
                    width: "100%",
                    borderStyle: "dashed",
                  }}
                />
                <Stack sx={{ flexDirection: "row" }}>
                  <IconButton
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleDelete(project.id);
                          Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success",
                          });
                        }
                      });
                    }}
                    sx={{ width: "50px", height: "50px" }}
                  >
                    <Delete color="error" />
                  </IconButton>
                  <Link to={`${project.id}`}>
                    <IconButton sx={{ width: "50px", height: "50px" }}>
                      <Edit />
                    </IconButton>
                  </Link>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}

export default EditCity;
