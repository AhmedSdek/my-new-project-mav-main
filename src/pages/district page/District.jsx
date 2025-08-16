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
import { useTranslation } from "react-i18next";
import { useGlobal } from "../../context/GlobalContext";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import MavLoading from "../../comp/Loading/MavLoading";

function District() {
  const { districtid } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { country } = useGlobal();
  const [compounds, setCompounds] = useState([]);
  console.log(compounds);
  const [loadingcompound, setLoadingcompound] = useState(true);
  const [errorcompound, setErrorcompound] = useState(null);
  useEffect(() => {
    const fetchcompounds = async () => {
      try {
        const q = query(
          collection(db, "compound"),
          where("countryKey", "==", country.en)
        );
        const snapshot = await getDocs(q);
        const compoundsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (item) =>
              item.district?.en?.trim().toLowerCase() ===
              districtid.toLowerCase()
          );

        setCompounds(compoundsData);
      } catch (err) {
        setErrorcompound(err.message);
      } finally {
        setLoadingcompound(false);
      }
    };

    fetchcompounds();
  }, [country, districtid]);

  if (loadingcompound) {
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
      <Container>
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            margin: "15px 0 25px 0",
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: "bold", color: "#1e4164 " }}
              variant="h5"
              component="h2"
            >
              {districtid}
            </Typography>
          </Box>
          <span className="text-2" data-test="entity-type">
            Area
          </span>
        </Stack>
        <Divider />
        <Typography
          sx={{ padding: "10px 0", fontWeight: "bold", color: "#1e4164 " }}
        >
          {`Compounds In ${districtid}`}
        </Typography>
        {loadingcompound ? (
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
        ) : compounds.length > 0 ? (
          <Box sx={{ padding: "50px 0 0 0" }}>
            <Row>
              {compounds.map((card, index) => {
                return (
                  <Col
                    key={index}
                    className="col-md-6 col-12 col-lg-4"
                    style={{ marginBottom: "15px" }}
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
                        to={`/developers/${card.devId}/${card.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Box sx={{ height: "216px" }}>
                          <img
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            src={card.compoundImgs[0]}
                            alt=""
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
                              {card.compoundName[lang]}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: " rgb(100, 100, 100) ",
                                lineHeight: "1",
                                padding: "0 0 0 5px",
                              }}
                            >
                              {card.Location[lang]}
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {`${card.price} EGP`}
                          </Typography>
                        </CardContent>
                      </Link>
                      <Stack sx={{ padding: "0 10px 10px 0" }}>
                        <ContactUsIcon
                          sectionName="Find-Home"
                          sectionData={card}
                        />
                      </Stack>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Box>
        ) : (
          <Stack
            sx={{ height: "calc(100vh - 100px)", justifyContent: "center" }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              No Data in {country[lang]}
            </Typography>
          </Stack>
        )}
      </Container>
    </Box>
  );

  // if (value) {
  //   return (
  //     <Box sx={{ padding: "80px 0 0 0" }}>
  //       <Container>
  //         <Stack
  //           sx={{
  //             flexDirection: "row",
  //             alignItems: "center",
  //             gap: 3,
  //             margin: "15px 0 25px 0",
  //           }}
  //         >
  //           <Box>
  //             <Typography
  //               sx={{ fontWeight: "bold", color: "#1e4164 " }}
  //               variant="h5"
  //               component="h2"
  //             >
  //               {districtid}
  //             </Typography>
  //           </Box>
  //           <span className="text-2" data-test="entity-type">
  //             Area
  //           </span>
  //         </Stack>
  //         <Divider />
  //         {/* <Typography sx={{ padding: '10px 0', fontWeight: 'bold', color: '#1e4164 ' }} >
  //                     {`About ${districtid}`}
  //                 </Typography> */}
  //         <Typography
  //           sx={{ padding: "10px 0", fontWeight: "bold", color: "#1e4164 " }}
  //         >
  //           {`Compounds In ${districtid}`}
  //         </Typography>
  //         <Box sx={{ padding: "50px 0 0 0" }}>
  //           <Row>
  //             {arr.map((card, index) => {
  //               return (
  //                 <Col
  //                   key={index}
  //                   className="col-md-6 col-12 col-lg-4"
  //                   style={{ marginBottom: "15px" }}
  //                 >
  //                   <Card
  //                     sx={{
  //                       position: "relative",
  //                       height: "100%",
  //                       display: "flex",
  //                       flexDirection: "column",
  //                       justifyContent: "space-between",
  //                     }}
  //                   >
  //                     <Link
  //                       to={`/findhome/${card.district}/${card.proj}`}
  //                       style={{ textDecoration: "none" }}
  //                     >
  //                       <Box sx={{ height: "216px" }}>
  //                         <img
  //                           style={{
  //                             height: "100%",
  //                             width: "100%",
  //                             objectFit: "cover",
  //                           }}
  //                           src={card.projImgs[0]}
  //                           alt=""
  //                         />
  //                       </Box>
  //                       <CardContent>
  //                         <Stack sx={{ marginBottom: "10px" }}>
  //                           <Typography
  //                             sx={{
  //                               lineHeight: "1.3",
  //                               fontWeight: "bold",
  //                               color: "rgb(30, 65, 100)",
  //                             }}
  //                             variant="body1"
  //                           >
  //                             {card.proj}
  //                           </Typography>
  //                           <Typography
  //                             variant="caption"
  //                             sx={{
  //                               color: " rgb(100, 100, 100) ",
  //                               lineHeight: "1",
  //                               padding: "0 0 0 5px",
  //                             }}
  //                           >
  //                             {card.Location}
  //                           </Typography>
  //                         </Stack>
  //                         <Typography sx={{ fontWeight: "bold" }}>
  //                           {`${card.price} EGP`}
  //                         </Typography>
  //                       </CardContent>
  //                     </Link>
  //                     <Stack sx={{ padding: "0 10px 10px 0" }}>
  //                       <ContactUsIcon
  //                         sectionName="Find-Home"
  //                         sectionData={card}
  //                       />
  //                     </Stack>
  //                   </Card>
  //                 </Col>
  //               );
  //             })}
  //           </Row>
  //         </Box>
  //       </Container>
  //     </Box>
  //   );
  // }
}

export default District;
