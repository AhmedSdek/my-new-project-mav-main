import { Button, Container, IconButton, Stack } from '@mui/material'
import React from 'react'
import img from './Yellow and Blue Playful Illustration Limited Offer Instagram Post.webp'
import { Close } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
function HomePup({ setPup, pup }) {
    const nav = useNavigate()
    return (
        <Stack sx={{ position: 'fixed', top: '0', width: '100%', backgroundColor: '#ffffff52', zIndex: '100', height: 'calc(100vh)', paddingTop: '58px', justifyContent: 'center', alignItems: 'center', scale: pup, transition: '0.5s' }}>
            <div style={{ position: 'relative' }}>
                <Stack sx={{ width: { md: '500px', xs: '300px', sm: '400px' }, height: { md: '500px', xs: '300px', sm: '400px' } }}>
                    <img style={{ width: '100%', height: '100%', borderRadius: '10px' }} src={img} alt='Sell-Rent your Property' />
                </Stack>
                <IconButton onClick={() => setPup(0)} sx={{ position: 'absolute', top: '0', right: '0', color: "white" }}>
                    <Close />
                </IconButton>
                <Button
                    onClick={() => {
                        nav('/cityscapeprojects')
                    }}
                    variant='contained' sx={{ position: 'absolute', bottom: '10px', right: 'calc(50% - 47px)', backgroundColor: '#ff6e19', color: 'white', borderRadius: '20px', fontWeight: 'bold', padding: '5px 10px 2px' }}>
                    Get Offers
                </Button>
            </div>

        </Stack>
    )
}

export default HomePup