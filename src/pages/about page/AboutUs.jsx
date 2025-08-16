import { Container, Stack, Typography } from '@mui/material'
import React from 'react'

function AboutUs() {
    return (
        <Stack sx={{ padding: '80px 0 0 0', height: '100vh' }}>
            <Container>
                <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>
                    About Maverick
                </Typography>
                <Typography sx={{ color: 'black' }}>
                    What Started Out As A Collective Dream And An Innovative Idea Has Now Become A Reality. Finding The Right Home Has Always Been A Stressful Process, That’s Where Maverick Comes In. We Have Helped  alot of Families Easily Find The Most Suitable Property To Turn Into A  Home.

                    As A Prop-Tech Property Startup, We Offer Various Services To Our Customers Including Brokerage
                </Typography>
                <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', padding: '10px 0' }}>
                    our vision
                </Typography>
                <Typography sx={{ color: 'black' }}>
                    We seek to provide all the appropriate solutions and choices to find the appropriate property for each family
                    Depending on their ways of living, culture, interests and goals
                </Typography>
            </Container>
        </Stack>
    )
}

export default AboutUs