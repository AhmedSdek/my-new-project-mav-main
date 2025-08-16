import { Link, useParams } from 'react-router-dom'
import { useCollection, } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Box, Card, CardContent, Container, Divider, Stack, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { useState } from 'react';
import ContactUsIcon from '../Contact Us/ContactUsIcon';
import MavLoading from '../Loading/MavLoading';

function FindDetails() {
  const { districtid } = useParams();
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

export default FindDetails