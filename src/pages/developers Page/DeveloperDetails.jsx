import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/config";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import ContactUsIcon from "../../comp/Contact Us/ContactUsIcon";
import MavLoading from "../../comp/Loading/MavLoading";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import ReactMarkdown from "react-markdown";
import ReactLoading from "react-loading";

export default function DeveloperDetails() {
  const { devId } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();
  // console.log(country);
  // console.log(devId);
  const [developer, setDeveloper] = useState({});
  const [compounds, setCompounds] = useState([]);
  console.log(developer);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingcompound, setLoadingcompound] = useState(true);
  const [errorcompound, setErrorcompound] = useState(null);
  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const docRef = doc(db, "developer", devId);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);
        setDeveloper({ id: docSnap.id, ...docSnap.data() });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeveloper();
  }, []);
  useEffect(() => {
    const fetchcompounds = async () => {
      try {
        const q = query(
          collection(db, "compound"),
          where("countryKey", "==", country.en),
          where("devId", "==", devId)
        );
        const snapshot = await getDocs(q);
        // console.log(snapshot);
        const compoundsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompounds(compoundsData);
      } catch (err) {
        setErrorcompound(err.message);
      } finally {
        setLoadingcompound(false);
      }
    };
    fetchcompounds();
  }, [devId, country]);
  if (error) return <p>حدث خطأ: {error}</p>;
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
    <Box sx={{ padding: "80px 0 0 0", minHeight: "calc(100vh - 100px)" }}>
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
      ) : developer ? (
        <Container>
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
              gap: 3,
            }}
          >
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <img
                style={{
                  width: "70px",
                  boxShadow: "0 -1px 15px -3px rgba(0, 0, 0, 0.2)",
                  borderRadius: "50%",
                  height: "70px",
                }}
                src={developer.img}
                alt={developer.devName[lang]}
              />
              <Typography
                sx={{ fontWeight: "bold", color: "#1e4164 " }}
                variant="h5"
                component="h2"
              >
                {developer.devName[lang]}
              </Typography>
            </Stack>
            <span className="text-2" data-test="entity-type">
              {lang === "ar" ? "مطور" : "Developer"}
            </span>
          </Stack>
          <Divider sx={{ borderWidth: "1px" }} />
          <Box sx={{ padding: "20px 0 0 0" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#1e4164 ",
                padding: "10px 0",
              }}
            >
              {`${lang === "ar" ? "عن" : "About"} ${developer.devName[lang]}`}
            </Typography>
            <ReactMarkdown
              children={developer.devDis[lang]}
              components={{
                p: ({ node, ...props }) => (
                  <p style={{ whiteSpace: "pre-line" }} {...props} />
                ),
                h6: ({ node, ...props }) => (
                  <h6 style={{ margin: "10px 0" }} {...props} />
                ),
              }}
            />
            <Stack>
              <Typography
                sx={{
                  padding: "10px 0",
                  fontWeight: "bold",
                  color: "#1e4164 ",
                }}
              >
                {`${
                  lang === "ar" ? "استكشاف المشاريع في" : "Explore projects In"
                } ${developer.devName[lang]}`}
              </Typography>
              {loadingcompound ? (
                <Stack
                  sx={{
                    height: "100px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ReactLoading
                    color="black"
                    type={"spin"}
                    height={"50px"}
                    width={"50px"}
                  />
                </Stack>
              ) : compounds && compounds.length > 0 ? (
                <Row>
                  {compounds.map((project, index) => {
                    return (
                      <Col
                        key={index}
                        className="col-md-6 col-12 col-lg-4"
                        style={{ marginBottom: "15px", position: "relative" }}
                      >
                        <Card
                          sx={{
                            position: "relative",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Link
                            to={`/developers/${devId}/${project.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Box sx={{ height: "216px" }}>
                              <img
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                                src={project.compoundImgs[0]}
                                alt={project.compoundName[lang]}
                              />
                            </Box>
                            <CardContent
                              style={{ padding: "15px 15px 0 15px" }}
                            >
                              <Stack>
                                <Typography
                                  sx={{
                                    lineHeight: "1.3",
                                    fontWeight: "bold",
                                    color: "rgb(30, 65, 100)",
                                  }}
                                  variant="body1"
                                >
                                  {project.compoundName[lang]}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: " rgb(100, 100, 100) ",
                                    lineHeight: "1",
                                    padding: "0 0 0 5px",
                                  }}
                                >
                                  {project.Location[lang]}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Link>
                          <Stack sx={{ padding: "0 10px 10px 0" }}>
                            <ContactUsIcon
                              sectionName="Developer"
                              sectionData={project}
                            />
                          </Stack>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <Stack
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "150px",
                  }}
                >
                  <Typography>No Data in {country[lang]}</Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        </Container>
      ) : (
        <Stack sx={{ height: "calc(100vh - 100px)", justifyContent: "center" }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Oops, Data not Found
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
