import { Call, WhatsApp } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import React from 'react'

function ContactUsBtn({ sectionName = '', sectionData = '' }) {
    return (
        <Stack sx={{ flexDirection: 'row', gap: 2 }}>
            <a href="tel:+201008582515">
                <Button variant='contained' sx={{ backgroundColor: 'rgb(228, 235, 242)', color: 'rgb(30, 65, 100)', fontWeight: 'bold' }}>
                    <Call />
                    Call Us
                </Button>
            </a>
            <a target='_blank' href={`https://wa.me/+201008582515?text=${sectionName && `Section%20Name%20:%20${sectionName}`}${sectionData && sectionData.launchName ? `%0ALaunch-Name%20:%20${sectionData.launchName}` : ''}${sectionData && sectionData.devname ? `%0ADeveloper-Name%20:%20${sectionData.devname}` : ''}${sectionData && sectionData.compoundName ? `%0ACompound-Name%20:%20${sectionData.compoundName}` : ''}${sectionData && sectionData.refNum ? `%0AReference-NO%20:%20${sectionData.refNum}` : ''}${sectionData && sectionData.devName ? `%0ADeveloper-Name%20:%20${sectionData.devName}` : ''}${sectionData && sectionData.proj ? `%0AProject-Name%20:%20${sectionData.proj}` : ''}${sectionData && sectionData.district ? `%0AProject-District%20:%20${sectionData.district}` : ''}${sectionData && sectionData.Location ? `%0AProject-Location%20:%20${sectionData.Location}` : ''}`}>
                <Button variant='contained' sx={{ backgroundColor: 'rgb(76, 217, 100)', color: 'white', fontWeight: 'bold' }}>
                    <WhatsApp />
                    Whats App
                </Button>


            </a>
        </Stack>
    )
}

export default ContactUsBtn