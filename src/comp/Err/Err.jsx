import { Stack } from '@mui/material'
import React from 'react'
import './err.css'
function Err() {
    return (
        <Stack sx={{ padding: '70px 0 0', minHeight: 'calc(100vh - 100px)', justifyContent: 'center', alignItems: 'center' }} >
            <Stack sx={{ width: '100%' }}>
                <section className="page_404">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 ">
                                <div className=" col-sm-offset-1  text-center">
                                    <div className="four_zero_four_bg">
                                        <h1 className="text-center ">404</h1>


                                    </div>

                                    <div className="contant_box_404">
                                        <h3 className="h2">
                                            Look like you're lost
                                        </h3>

                                        <p>the page you are looking for not avaible!</p>

                                        <a href="/" className="link_404">Go to Home</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </Stack>
        </Stack>
    )
}

export default Err