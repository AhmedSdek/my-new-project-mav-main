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
  Tooltip,
  Typography,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import MavLoading from "../../comp/Loading/MavLoading";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
function CityscapeProjects() {
  const [hiden, setHiden] = useState("hiden");
  const [projectName, setProjectName] = useState("");
  const [devName, setDevName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = React.useState("eg");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = useState("");
  const [city, setCity] = useState([]);
  console.log(city);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { country } = useGlobal();
  useEffect(() => {
    const fetchCity = async () => {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [country]);
  if (loading) {
    return (
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
    );
  }
  return (
    <Stack
      sx={{ minHeight: "100vh ", position: "relative", marginTop: "58px" }}
    >
      <Container>
        <Stack>
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              padding: "10px 0",
            }}
          >
            <div className="header">
              <h1
                style={{
                  // letterSpacing: '0px',
                  fontFamily: "materialBold",
                  fontSize: "20px",
                  color: "rgb(30, 65, 100)",
                  textTransform: "uppercase",
                  letterSpacing: "4.14px",
                }}
              >
                Explore all
                <span
                  style={{
                    color: "rgb(255 110 25)",
                    fontSize: "40px",
                    verticalAlign: "middle",
                    letterSpacing: "0px",
                  }}
                >
                  market offers
                </span>
              </h1>
              <h2
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "2.34px",
                  color: "rgb(100, 100, 100)",
                  fontSize: "18px",
                }}
              >
                Be The First One To Get Offers
              </h2>
            </div>
            <Stack
              sx={{
                backgroundColor: "#edf0f0",
                gap: 1,
                color: "#1e4164",
                padding: "10px",
                borderRadius: "10px",
                alignItems: "center",
                margin: "10px 0",
                width: { lg: "30%", md: "40%" },
              }}
            >
              <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
                Get Offer
              </Typography>
              <ContactUsBtn sectionName="Market-Offers" />
            </Stack>
          </Stack>
          <Row>
            {city.map((project, index) => {
              return (
                <Col
                  className=" col-sm-6 col-12 col-lg-4 col-md-6"
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                    maxHeight: "300px",
                  }}
                  key={index}
                >
                  <Card
                    sx={{
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f6f7f7",
                      position: "relative",
                      overflow: "initial",
                      gap: 2,
                      height: "100%",
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
                      <Link to={`/developers/${project.devId}`}>
                        <img
                          className=" img shadow-filter "
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                          }}
                          src={project.devIcon}
                          alt={project.developer.devName[lang]}
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
                        <Stack
                          sx={{ padding: "5px 10px ", alignItems: "center" }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "#ff914d",
                              fontSize: "20px",
                            }}
                          >
                            {`${project.downPayment}%`}
                          </Typography>
                          <Typography>Downpayment</Typography>
                        </Stack>

                        <Stack
                          sx={{ padding: "5px 10px ", alignItems: "center" }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "#ff914d",
                              fontSize: "20px",
                            }}
                          >
                            {`${project.years} Years`}
                          </Typography>
                          <Typography>Installments</Typography>
                        </Stack>
                      </Stack>
                      {project.cashDiscount ? (
                        <Stack sx={{ flexDirection: "row", gap: 1 }}>
                          <Typography
                            sx={{ fontWeight: "bold", fontSize: "20px" }}
                          >
                            Cash Discount
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "#ff914d",
                              fontSize: "20px",
                            }}
                          >
                            {`${project.cashDiscount}%`}
                          </Typography>
                        </Stack>
                      ) : (
                        <ReactMarkdown>
                          {project.discription[lang]}
                        </ReactMarkdown>
                      )}
                    </Stack>
                    <Divider
                      sx={{
                        borderColor: "white",
                        opacity: "1",
                        borderWidth: "1px",
                        width: "100%",
                        borderStyle: "dashed",
                      }}
                    />
                    <Stack sx={{ width: "100%", flexDirection: "row", gap: 1 }}>
                      <Button
                        onClick={() => {
                          setProjectName(project.cityscapeName);
                          setDevName(project.developer.devName);
                          setHiden("show");
                        }}
                        sx={{
                          width: "100%",
                          backgroundColor: "#ff914d",
                          fontWeight: "bold",
                        }}
                        variant="contained"
                      >
                        Get Offer
                      </Button>
                    </Stack>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <Divider sx={{ opacity: "1", borderWidth: "1px" }} />
        </Stack>
      </Container>

      <Stack
        sx={{
          width: "100%",
          height: "calc(100vh - 58px)",
          position: "fixed",
          display: "flex",
          alignItems: "center",
          zIndex: "100000",
          justifyContent: "center",
          backgroundColor: "rgb(0 0 0 / 59%)",
        }}
        className={hiden}
      >
        <Card
          sx={{
            width: { sm: "80%", xs: "95%" },
            position: "relative",
            padding: "20px",
            flexDirection: "column",
            borderRadius: "10px",
            overflow: "auto",
            height: "80%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Complete the Form
          </Typography>
          <Divider
            sx={{
              borderColor: "black",
              width: "40%",
              margin: "10px auto",
              opacity: "1",
            }}
          />
          <Stack
            component="form"
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <TextField
              sx={{ margin: "10px", width: "100%" }}
              id="ProjectName"
              label=" Project Name"
              variant="outlined"
              type="text"
              value={projectName[lang]}
              disabled
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              sx={{ margin: "10px", width: "100%" }}
              id="devname"
              label="Developer Name"
              variant="outlined"
              type="text"
              value={devName[lang]}
              InputLabelProps={{ shrink: true }}
              disabled
            />

            <TextField
              sx={{ margin: "10px", width: "100%" }}
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
              id="name"
              label="Your Name"
              variant="outlined"
              type="text"
              value={name}
            />

            <Box sx={{ width: { xs: "100%", md: "100%" }, padding: "5px" }}>
              <PhoneInput
                inputProps={{ required: true }}
                country={countryCode}
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                }}
                countryCodeEditable={false}
              />
            </Box>
            <TextField
              id="message"
              label="message"
              multiline
              value={message}
              rows={4}
              sx={{ margin: "10px", width: "100%" }}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              type="submit"
              disabled={name.length <= 0 || phone.length <= 2}
            >
              <a
                style={{ width: "100%" }}
                target="_blank"
                href={`https://wa.me/+201008582515?text=Section%20Name%20:%20Market-Offers%0AProject%20Name%20:%20${projectName}%0ADeveloper%20Name%20:%20${devName}%0AName%20:%20${name}${
                  email && `%0AEmail%20:%20${email}`
                }%0APhone%20Number%20:%20${phone}${
                  message && `%0AMessage%20:%20${message}`
                }`}
              >
                Send
              </a>
            </Button>
          </Stack>
          <IconButton
            sx={{ position: "absolute", top: "10px", right: "10px" }}
            onClick={() => {
              setHiden("hiden");
              setName("");
              setPhone("+20");
              setMessage("");
              setEmail("");
            }}
          >
            <Close />
          </IconButton>
        </Card>
      </Stack>
    </Stack>
  );
}

export default CityscapeProjects;
