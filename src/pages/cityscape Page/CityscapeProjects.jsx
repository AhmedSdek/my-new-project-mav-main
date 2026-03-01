import { Close } from "@mui/icons-material";
import "./developers.css";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import MavLoading from "../../comp/Loading/MavLoading";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // تأكد من استيراد الـ CSS الخاص بالمكتبة
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function CityscapeProjects() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState({
    name: "",
    developer: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    email: "",
  });

  const [city, setCity] = useState([]);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === "ar";
  const [loading, setLoading] = useState(true);
  const { country } = useGlobal();

  useEffect(() => {
    const fetchCity = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "cityscape"),
          where("countryKey", "==", country.en)
        );
        const snapshot = await getDocs(q);
        const dealsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCity(dealsData);
      } catch (err) {
        console.error("Error fetching cityscape:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [country]);

  const handleOpenForm = (project) => {
    setSelectedProject({
      name: project.cityscapeName,
      developer: project.developer.devName,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: "", phone: "", message: "", email: "" });
  };

  if (loading) {
    return (
      <Stack
        sx={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <MavLoading />
      </Stack>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9", pt: "80px", pb: 5 }}>
      <Container>
        {/* Header Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 6, textAlign: { xs: "center", md: "left" } }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e4164",
                letterSpacing: 3,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}>
              {isAr ? "استكشف كل" : "Explore all"}
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: "#ff6e19", fontWeight: 900, lineHeight: 1 }}>
              {isAr ? "عروض السوق" : "market offers"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
              {isAr
                ? "كن أول من يحصل على العروض الحصرية"
                : "Be The First One To Get Exclusive Offers"}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: "20px",
              border: "1px solid #eee",
              mt: { xs: 3, md: 0 },
              minWidth: { md: "300px" },
              textAlign: "center",
            }}>
            <Typography sx={{ fontWeight: "bold", mb: 2, color: "#1e4164" }}>
              {isAr ? "احصل على العرض العام" : "Get General Offer"}
            </Typography>
            <ContactUsBtn sectionName="Market-Offers" />
          </Paper>
        </Stack>

        {/* Projects Grid */}
        <Row>
          {city.map((project, index) => (
            <Col
              key={index}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              style={{ marginBottom: "30px" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "24px",
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #eee",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 15px 30px rgba(0,0,0,0.05)",
                    transform: "translateY(-5px)",
                  },
                }}>
                {/* Dev Info */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 3 }}>
                  <Link to={`/developers/${project.devId}`}>
                    <Avatar
                      src={project.devIcon}
                      sx={{
                        width: 60,
                        height: 60,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Link>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#1e4164",
                        fontSize: "1.1rem",
                      }}>
                      {project.cityscapeName[lang]}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ color: "text.secondary", fontWeight: 600 }}>
                      {project.developer.devName[lang]}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LocationOnIcon
                        sx={{ fontSize: "0.9rem", color: "#ff6e19" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}>
                        {project.Location[lang]}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Offer Details */}
                <Box
                  sx={{
                    bgcolor: "#f0f4f8",
                    borderRadius: "16px",
                    p: 2,
                    mb: 3,
                  }}>
                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    divider={<Divider orientation="vertical" flexItem />}>
                    <Box textAlign="center">
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: "#ff6e19",
                          fontSize: "1.2rem",
                        }}>
                        {project.downPayment}%
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {isAr ? "مقدم" : "Downpayment"}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: "#ff6e19",
                          fontSize: "1.2rem",
                        }}>
                        {project.years}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {isAr ? "سنين" : "Years"}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ flexGrow: 1, mb: 3 }}>
                  {project.cashDiscount ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        color: "#2e7d32",
                        bgcolor: "#e8f5e9",
                        py: 1,
                        borderRadius: "8px",
                      }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {isAr ? "خصم الكاش" : "Cash Discount"}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        {project.cashDiscount}%
                      </Typography>
                    </Stack>
                  ) : (
                    <Box sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                      <ReactMarkdown>{project.discription[lang]}</ReactMarkdown>
                    </Box>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleOpenForm(project)}
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    fontWeight: "bold",
                    bgcolor: "#1e4164",
                    "&:hover": { bgcolor: "#ff6e19" },
                  }}>
                  {isAr ? "احصل على العرض" : "Get Offer"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Form Overlay Popup */}
      {showForm && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.7)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(4px)",
          }}>
          <Card
            sx={{
              width: { xs: "90%", sm: "500px" },
              borderRadius: "24px",
              position: "relative",
              p: 4,
            }}>
            <IconButton
              onClick={handleCloseForm}
              sx={{ position: "absolute", top: 15, right: 15 }}>
              <Close />
            </IconButton>

            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontWeight: 800, color: "#1e4164", mb: 1 }}>
              {isAr ? "أكمل البيانات للحصول على العرض" : "Complete the Form"}
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 3 }}>
              {selectedProject.name[lang]} - {selectedProject.developer[lang]}
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label={isAr ? "الاسم" : "Your Name"}
                variant="filled"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Box>
                <PhoneInput
                  country={"eg"}
                  value={formData.phone}
                  onChange={(val) => setFormData({ ...formData, phone: val })}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{
                    width: "100%",
                    height: "55px",
                    background: "#f0f2f5",
                  }}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={isAr ? "رسالة إضافية (اختياري)" : "Message (Optional)"}
                variant="filled"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <Button
                variant="contained"
                size="large"
                disabled={!formData.name || formData.phone.length < 10}
                href={`https://wa.me/+201008582515?text=Section%20Name%20:%20Market-Offers%0AProject%20Name%20:%20${selectedProject.name[lang]}%0ADeveloper%20Name%20:%20${selectedProject.developer[lang]}%0AName%20:%20${formData.name}%0APhone%20Number%20:%20${formData.phone}%0AMessage%20:%20${formData.message}`}
                target="_blank"
                sx={{
                  bgcolor: "#ff6e19",
                  py: 2,
                  borderRadius: "12px",
                  fontWeight: "bold",
                }}>
                {isAr ? "إرسال عبر واتساب" : "Send via WhatsApp"}
              </Button>
            </Stack>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default CityscapeProjects;