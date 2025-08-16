import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../../../firebase/config";
import MavLoading from "../../../Loading/MavLoading";
import {
  Box,
  Card,
  CardMedia,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function EditCompound() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [compound, setCompound] = useState([]);
  console.log(compound);
  const [deletLoading, setDeletLoading] = useState(false);
  const [compoundLoading, setCompoundLoading] = useState(true);

  useEffect(() => {
    const fetchcompound = async () => {
      try {
        const snapshot = await getDocs(collection(db, "compound"));
        const comp = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompound(comp);
      } catch (err) {
        console.error("خطأ أثناء جلب الديل:", err);
      } finally {
        setCompoundLoading(false);
      }
    };
    fetchcompound();
  }, []);
  const handleDelete = async (id) => {
    try {
      setDeletLoading(true);
      await deleteDoc(doc(db, "compound", id));
      setCompound((prev) => prev.filter((deal) => deal.id !== id));
      setDeletLoading(false);
      toast.success("The modification has been made.", { autoClose: 2000 }); // عرض إشعار أنيق
      console.log("✅ تم الحذف بنجاح");
    } catch (error) {
      setDeletLoading(false);
      toast.error(`Oops! Something went wrong. ${error}`, { autoClose: 2000 });
      console.error("❌ خطأ أثناء الحذف:", error);
    }
  };
  if (compoundLoading) {
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
      <h2>{lang === "ar" ? "كل الكومبوننت" : "All Comp page"}</h2>
      <Container>
        {compound.length > 0 ? (
          <Stack
            style={{
              gap: 2,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              padding: "30px 0",
            }}
          >
            {compound.map((product) => {
              console.log(product);
              return (
                <Card
                  key={product.id}
                  className="col-xl-4 col-sm-6 col-12"
                  style={{
                    backgroundColor: "rgb(228 228 228)",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100px",
                  }}
                >
                  <CardMedia>
                    <img
                      src={product.img}
                      alt={product.developer.devName[lang]}
                    />
                  </CardMedia>
                  <Stack sx={{ p: "10px" }}>
                    <Typography>{`${product.developer.devName[lang]}`}</Typography>
                    <Typography variant="caption">
                      {`${product.developer.country[lang]}`}
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Link to={`${product.id}`}>
                      <IconButton sx={{ width: "50px", height: "50px" }}>
                        <Edit />
                      </IconButton>
                    </Link>
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
                            handleDelete(product.id);
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
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Typography>no Data !</Typography>
        )}
      </Container>
    </Box>
  );
}

export default EditCompound;
