import React from 'react'
import img from './map maverickrhehet.webp'
import { Container, Stack, Typography } from '@mui/material'
import ContactUsBtn from '../../comp/Contact Us/ContactUsBtn'
function SahelMapPage() {
    return (
        <Container>
            <Stack sx={{ padding: '100px 0 0 0', alignItems: 'center', gap: 4, minHeight: 'calc(100vh - 100px)' }}>
                <Stack sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Stack>
                        <Typography variant='h2' sx={{ fontWeight: 'bold', fontFamily: 'materialBold', fontSize: { xs: '45px' } }}>
                            SAHEL MAP
                        </Typography>
                        <Typography sx={{ paddingLeft: '5px' }}>
                            Explore All Projects In North Coast
                        </Typography>
                    </Stack>
                    <Stack sx={{ textAlign: 'center', gap: 1 }}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            Contact Us
                        </Typography>
                        <ContactUsBtn sectionName='Sahel-Map' />
                    </Stack>
                </Stack>
                <hr style={{ width: '100%', margin: '0' }} />
                <Stack sx={{ width: '50%' }}>
                    <img width='100%' height='100%' src={img} alt='' />
                </Stack>
            </Stack>
        </Container>
    )
}

export default SahelMapPage