import { Container, Stack } from '@mui/material'
import React, { memo } from 'react'
import img1 from './MAVERICK (24).webp'
import img2 from './MAVERICK (25).webp'
import img3 from './MAVERICK (26).webp'
import img4 from './MAVERICK (27).webp'

function MavLoading() {
    return (
        <Container>
            <Stack sx={{ width: '200px', height: '200px', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', position: 'relative', backgroundColor: '', margin: 'auto' }}>
                <img className='img1' style={{ width: '30px', height: '30px', position: 'absolute', bottom: '15px', left: '10px' }} src={img1} alt='' />
                <img className='img2' style={{ width: '100px', height: '100px', position: 'absolute', left: '10px', bottom: '5px' }} src={img2} alt='' />
                <img className='img3' style={{ width: '170px', height: '170px', position: 'absolute', left: '5px', bottom: '0px' }} src={img3} alt='' />
                <img className='img4' style={{ width: '110px', height: '110px', position: 'absolute', left: '90px', bottom: '65px' }} src={img4} alt='' />

            </Stack>
        </Container>
    )
}

export default memo(MavLoading)