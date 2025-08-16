import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { Box, Card, Container, Typography } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { db } from "../../firebase/config";
import MavLoading from "../Loading/MavLoading";

function SellDetails() {
    let { id } = useParams();
    const [value, loading, error] = useDocument(doc(db, 'data', id));
    if (loading) {
        return (
            <h2>loading</h2>
        )
    }
    if (value) {
        // console.log(value.data())
        return (
            <Box sx={{ padding: '70px 0 0', minHeight: 'calc(100vh - 100px)' }}>
                <Container>
                    <Row >
                        {value.data().img.map((el, index) => {
                            return (
                                <Col key={index} className="col-sm-6 col-12" style={{ marginBottom: '15px' }}>
                                    <Card sx={{ height: '300px' }} >
                                        <img style={{ width: '100%', height: '100%' }} src={el} alt="" />
                                    </Card>

                                </Col>

                            )
                        })}
                        <Col>

                            <Typography>
                                {`Name : ${value.data().Name}`}
                            </Typography>
                            <Typography>
                                {`Phone Num : ${value.data().Phone}`}
                            </Typography>
                            <Typography>
                                {`Sale : ${value.data().Sale}`}
                            </Typography>
                            <Typography>
                                {`Type : ${value.data().Type}`}
                            </Typography>
                            <Typography>
                                {`Level : ${value.data().Level}`}
                            </Typography>
                            <Typography>
                                {`Finsh : ${value.data().Finsh}`}
                            </Typography>
                            <Typography>
                                {`BedRoom : ${value.data().Bed}`}
                            </Typography>
                            <Typography>
                                {`BathRoom : ${value.data().Bath}`}
                            </Typography>
                            <Typography>
                                {`Area : ${value.data().Area}`}
                            </Typography>
                            <Typography>
                                {`Dis : ${value.data().Dis}`}
                            </Typography>
                            <Typography>
                                {`Location : ${value.data().Location}`}

                            </Typography>
                            <Typography>

                            </Typography>
                            <Typography>

                            </Typography>

                        </Col>
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
export default SellDetails;