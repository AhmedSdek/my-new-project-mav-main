import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import ReactLoading from "react-loading";
import ContactUsBtn from "../../comp/Contact Us/ContactUsBtn";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BathroomOutlined,
  BedroomParentOutlined,
  BedroomParentTwoTone,
  Groups,
  Groups2Outlined,
  GroupsOutlined,
} from "@mui/icons-material";
import MavLoading from "../../comp/Loading/MavLoading";

function NorthCoastProjects() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();
  const [northCoast, setNorthCoast] = useState([]);
  console.log(northCoast);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchnorthCoast = async () => {
      try {
        const q = query(collection(db, "northcoast"));
        const snapshot = await getDocs(q);
        const northCoastData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNorthCoast(northCoastData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchnorthCoast();
  }, []);
  if (error) return <p>حدث خطأ: {error}</p>;

  return (
    <>
      <Stack
        sx={{
          minHeight: "calc(100vh - 100px)",
          justifyContent: "center",
          alignItems: "center",
          // paddingTop: "60px",
        }}
      >
        <Box sx={{ height: "100%", width: "100%" }}>
          {true ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: {
                  xs: "calc(100vh - 160px)",
                  sm: "calc(100vh - 100px)",
                },
              }}
            >
              <MavLoading />
            </Box>
          ) : northCoast && northCoast.length > 0 ? (
            <Stack sx={{ paddingTop: "60px" }}>
              <Container>
                <Stack
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div className="header">
                    <h1
                      style={{
                        letterSpacing: "0px",
                        fontFamily: "materialBold",
                        fontSize: "20px",
                        color: "rgb(30, 65, 100)",
                        textTransform: "uppercase",
                        letterSpacing: "4.14px",
                      }}
                    >
                      Explore
                      <span
                        style={{
                          color: "rgb(255 110 25)",
                          fontSize: "40px",
                          verticalAlign: "middle",
                          letterSpacing: "0px",
                        }}
                      >
                        North Coast
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
                      Be the first one to Reserve your Unit
                    </h2>
                  </div>
                  <ContactUsBtn sectionName="New-Launch" />
                </Stack>
                <hr />
                {/* <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Launching Soon
                </Typography> */}
                <Row>
                  {northCoast.map((itm, index) => {
                    return (
                      <Col
                        key={index}
                        className="col-md-6 col-12 col-lg-4"
                        style={{
                          marginBottom: "15px",
                          position: "relative",
                        }}
                      >
                        <Link
                          to={`/northCoast/${itm.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Card sx={{ position: "relative", height: "100%" }}>
                            <Box sx={{ height: "216px" }}>
                              <img
                                style={{ height: "100%", width: "100%" }}
                                src={itm.img[0]}
                                alt={itm.compoundName[lang]}
                              />
                            </Box>
                            <CardContent>
                              <Stack sx={{ marginBottom: "10px" }}>
                                <Typography
                                  sx={{
                                    lineHeight: "1.3",
                                    fontWeight: "bold",
                                    color: "rgb(30, 65, 100)",
                                  }}
                                  variant="body1"
                                >
                                  {itm.compoundName[lang]}
                                </Typography>
                                <Stack
                                  sx={{
                                    margin: "10px 0",
                                    flexDirection: "row",
                                    gap: 2,
                                  }}
                                >
                                  <Badge
                                    badgeContent={itm.Bed[lang]}
                                    sx={{ width: "fit-content" }}
                                    color="primary"
                                  >
                                    <BedroomParentOutlined />
                                  </Badge>
                                  <Badge
                                    badgeContent={itm.Bath[lang]}
                                    sx={{ width: "fit-content" }}
                                    color="primary"
                                  >
                                    <BathroomOutlined />
                                  </Badge>
                                  <Badge
                                    badgeContent={itm.peopleNumber}
                                    sx={{ width: "fit-content" }}
                                    color="primary"
                                  >
                                    <GroupsOutlined />
                                  </Badge>
                                </Stack>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: " rgb(100, 100, 100) ",
                                    lineHeight: "1",
                                    padding: "0 0 0 5px",
                                  }}
                                >
                                  {itm.Location[lang]}
                                </Typography>
                              </Stack>
                              {itm.price && (
                                <Typography sx={{ fontWeight: "bold" }}>
                                  {`${itm.price} EGP`}
                                </Typography>
                              )}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgb(100, 100, 100)",
                                  paddingTop: "4px",
                                  fontSize: "14px",
                                }}
                              >
                                {`
                                ${lang === "ar" ? "متاح" : "Available"}
                          ${
                            lang === "ar"
                              ? `من ${new Date(
                                  itm.startDate
                                ).toLocaleDateString("ar-EG", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })} إلى ${new Date(
                                  itm.endDate
                                ).toLocaleDateString("ar-EG", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}`
                              : `From ${new Date(
                                  itm.startDate
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })} to ${new Date(
                                  itm.endDate
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}`
                          }`}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      </Col>
                    );
                  })}
                </Row>
              </Container>
            </Stack>
          ) : (
            <Typography>
              {lang === "en" ? `No Projects` : `لا يوجد مشاريع`}
            </Typography>
          )}
        </Box>
      </Stack>
    </>
  );
}

export default NorthCoastProjects;
