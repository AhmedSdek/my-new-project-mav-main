import React from 'react'
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import MavLoading from '../Loading/MavLoading';
function SaleData() {
    const [value, loading, error] = useCollection(collection(db, 'data'));
    if (value) {
        return (
            <Box sx={{ padding: '70px 0 0', minHeight: 'calc(100vh - 100px)' }}>
                <Container>
                    <h2>
                        Sale Data
                    </h2>
                    <Row style={{ justifyContent: 'space-between' }}>
                        {value.docs.map((item, index) => {
                            // console.log(item.data())
                            return (
                                <Col className=" col-sm-6 col-12" style={{ marginBottom: '15px' }} key={index}>
                                    <Link to={`/dashboard/details/${item.data().id}`} style={{ textDecoration: 'none' }}>
                                        <Card >
                                            {/* <Box sx={{ height: '216px' }}>
                                                <img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={item.data().img[0]} alt='' />
                                            </Box> */}
                                            <CardContent>
                                                <Typography>
                                                    Location:    {item.data().Location}
                                                </Typography>
                                                <Typography>
                                                    finsh:   {item.data().Finsh}
                                                </Typography>
                                                <Typography>
                                                    Phone Num:   {item.data().Phone}
                                                </Typography>
                                                <Typography>
                                                    Sale:   {item.data().Sale}
                                                </Typography>
                                                <Typography>
                                                    Type:     {item.data().Type}
                                                </Typography>
                                                <Typography>
                                                    Level:     {item.data().Level}
                                                </Typography>
                                                <Typography>
                                                    Discrabtion:     {item.data().Dis}
                                                </Typography>
                                                <Typography>
                                                    BathRoom:     {item.data().Bath}
                                                </Typography>
                                                <Typography>
                                                    BedRoom:  {item.data().Bed}
                                                </Typography>
                                                <Typography>
                                                    Area:   {`${item.data().Area} m²`}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Link >
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </Box>
        )
    }
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' }}>
                <MavLoading />
            </div>
        )
    }

}

export default SaleData