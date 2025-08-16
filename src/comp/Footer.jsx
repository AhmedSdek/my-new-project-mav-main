import { Col, Container, Row } from "react-bootstrap";
import footerlog from './log.webp'
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { getAuth, signOut } from "firebase/auth";
function Footer() {

    return (
        <footer id="contact" style={{ backgroundColor: '#1e4164' }}>
            <Container>
                <Stack sx={{ justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexDirection: { xs: 'column', sm: 'row', md: 'row' } }}>
                    <Col style={{
                        display: 'flex', flexDirection: 'column',
                    }} >
                        <img style={{ width: '200px', height: '50px' }} src={footerlog} alt="" />
                        <p style={{ display: 'block', width: 'fit-content', paddingLeft: '25px', paddingTop: '0', fontSize: '16px', color: 'white' }}>
                            Real Estate Company
                        </p>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                        <a style={{ width: 'fit-content' }} href="https://www.facebook.com/MaverickforRealestate">
                            <IconButton className="footerbtn" aria-label="facebook" sx={{ backgroundColor: 'rgb(30, 65, 100)' }}>
                                <svg color="rgb(255, 255, 255)" fill="none" viewBox="0 0 24 24" height="1em" width="1em" >
                                    <path
                                        fill="currentColor"
                                        d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"
                                    />
                                </svg>

                            </IconButton>
                        </a>
                        <a style={{ width: 'fit-content' }} href="https://www.tiktok.com/@maverickforrealestate?fbclid=IwAR1DygCoTgeWOWMI3D76bMrWIR6K1T6xklIU01D91gcN91bbbs-FXTPoa6E">
                            <IconButton className="footerbtn" aria-label="Tiktok" sx={{ backgroundColor: 'rgb(30, 65, 100)' }}>
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                    color="rgb(255, 255, 255)"
                                >
                                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 11-5-5v2a3 3 0 103 3V0z" />
                                </svg>
                            </IconButton>
                        </a>
                        <a style={{ width: 'fit-content' }} href="https://l.facebook.com/l.php?u=https%3A%2F%2Finstagram.com%2Fmaverickforrealestate%3Figshid%3DZDdkNTZiNTM%253D%26fbclid%3DIwAR1uYmARbjGx1GwUZmswPrq8lc5plzS5GwIUoUoR23IZ1uQxdStxUXLSK3w&h=AT0q9wOLcFThQfh1mmXHfrQocK_GNEZuQFquj6Fxw47CNTBtHP_PLsi-OacXcDsIuOKovmlzIhGvzVFS-zJJaqBwtMnIvNT7nbdHd7Aorq2anJyLO2iD6nCgzios3O_aVzX9cg">
                            <IconButton className="footerbtn" aria-label="instagram" sx={{ backgroundColor: 'rgb(30, 65, 100)' }}>
                                <svg
                                    viewBox="0 0 1024 1024"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    color="rgb(255, 255, 255)"
                                >
                                    <path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 00-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z" />
                                </svg>
                            </IconButton>
                        </a>
                        <a style={{ width: 'fit-content' }} href="mailto:maverick.for.realestate@gmail.com" >

                            <IconButton className="footerbtn" aria-label="mail" sx={{ backgroundColor: 'rgb(30, 65, 100)' }}>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    color="rgb(255, 255, 255)"
                                >
                                    <path d="M18.73 5.41l-1.28 1L12 10.46 6.55 6.37l-1.28-1A2 2 0 002 7.05v11.59A1.36 1.36 0 003.36 20h3.19v-7.72L12 16.37l5.45-4.09V20h3.19A1.36 1.36 0 0022 18.64V7.05a2 2 0 00-3.27-1.64z" />
                                </svg>
                            </IconButton>
                        </a>
                        <a style={{ width: 'fit-content' }} href="tel:+201008582515">
                            <IconButton className="footerbtn" aria-label="Call" sx={{ backgroundColor: 'rgb(30, 65, 100)' }}>
                                <svg
                                    viewBox="0 0 1024 1024"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    color="rgb(255, 255, 255)"
                                >
                                    <path d="M885.6 230.2L779.1 123.8a80.83 80.83 0 00-57.3-23.8c-21.7 0-42.1 8.5-57.4 23.8L549.8 238.4a80.83 80.83 0 00-23.8 57.3c0 21.7 8.5 42.1 23.8 57.4l83.8 83.8A393.82 393.82 0 01553.1 553 395.34 395.34 0 01437 633.8L353.2 550a80.83 80.83 0 00-57.3-23.8c-21.7 0-42.1 8.5-57.4 23.8L123.8 664.5a80.89 80.89 0 00-23.8 57.4c0 21.7 8.5 42.1 23.8 57.4l106.3 106.3c24.4 24.5 58.1 38.4 92.7 38.4 7.3 0 14.3-.6 21.2-1.8 134.8-22.2 268.5-93.9 376.4-201.7C828.2 612.8 899.8 479.2 922.3 344c6.8-41.3-6.9-83.8-36.7-113.8z" />
                                </svg>
                            </IconButton>
                        </a >

                        <a style={{ width: 'fit-content' }} href="https://www.linkedin.com/company/maverick-for-realestate">
                            <IconButton className="footerbtn" aria-label="Linked In" sx={{ backgroundColor: 'rgb(30, 65, 100)' }}>
                                <svg
                                    viewBox="0 0 900 1000"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    color="rgb(255, 255, 255)"
                                >
                                    <path d="M204 152c0 26.667-9.667 49.333-29 68s-44.333 28-75 28c-29.333 0-53.333-9.333-72-28S0 178.667 0 152c0-28 9.333-51 28-69s43.333-27 74-27 55 9 73 27 27.667 41 29 69M6 942V324h192v618H6m306-420c0-57.333-1.333-123.333-4-198h166l10 86h4c40-66.667 103.333-100 190-100 66.667 0 120.333 22.333 161 67s61 111 61 199v366H708V600c0-89.333-32.667-134-98-134-46.667 0-79.333 24-98 72-4 8-6 24-6 48v356H312V522" />
                                </svg>
                            </IconButton>
                        </a >

                    </Col>
                </Stack>

            </Container>
            <Stack sx={{ backgroundColor: 'black' }}>
                <Container>
                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack>
                            <Typography variant="caption" sx={{ padding: '3px', color: 'white' }}>
                                &copy; Copyright 2024 - Maverick
                            </Typography>
                        </Stack>

                    </Stack>
                </Container>
            </Stack>
        </footer>
    )
}
export default Footer;