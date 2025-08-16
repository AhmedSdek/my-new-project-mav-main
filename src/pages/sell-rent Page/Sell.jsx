/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { db, storage } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Container, FormControl, FormControlLabel, FormLabel, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography, styled } from '@mui/material';
import ReactLoading from 'react-loading';
import img from './for sale-rent.webp'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { Info } from '@mui/icons-material';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Sell() {
    const [messege, setMessege] = React.useState(false);
    const nav = useNavigate()
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    // const [user] = useAuthState(auth);
    const [btn, setBtn] = useState(false);
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [type, setType] = React.useState('');
    const [area, setArea] = React.useState('');
    const [compoundName, setCompoundName] = React.useState('');
    const [bed, setBed] = React.useState('');
    const [bath, setBath] = React.useState('');
    const [level, setLevel] = React.useState('');
    const [finsh, setFinsh] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [sale, setSale] = React.useState('');
    const [dis, setDis] = React.useState('');
    const [prog, setProg] = useState(0)
    const [country, setCountry] = React.useState('eg');
    const [url, setUrl] = useState([])

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleTypeChange = (event) => {
        setType(event.target.value);
    };
    const handleAreaChange = (event) => {
        setArea(event.target.value);
    };
    const handlebedChange = (event) => {
        setBed(event.target.value);
    };
    const handlebathChange = (event) => {
        setBath(event.target.value);
    };
    const handlelevelChange = (event) => {
        setLevel(event.target.value);
    };
    const handleFinshChange = (event) => {
        setFinsh(event.target.value);
    };
    const handlelocationChange = (event) => {
        setLocation(event.target.value);
    };
    const handleCompoundNameChange = (event) => {
        setCompoundName(event.target.value);
    };
    const handleSaleChange = (event) => {
        setSale(event.target.value);
    };
    const handleDisChange = (event) => {
        setDis(event.target.value);
    };
    const handleFileChange = async (event) => {
        for (let i = 0; i < event.target.files.length; i++) {
            console.log(event.target.files.length)
            // console.log(i)
            const storageRef = ref(storage, event.target.files[i].name);
            const uploadTask = uploadBytesResumable(storageRef, event.target.files[i]);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
                    setProg(progress);
                    if (i < event.target.files.length) {
                        setBtn(true)
                    }
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        console.log('File available at', downloadURL);
                        setUrl((old) => [...old, downloadURL]);
                        setBtn(false)
                        // Add a new document in collection "cities"
                    });
                }
            );
        }
    };

    const sendData = async () => {
        setBtn(true)

        try {
            const id = new Date().getTime()
            await setDoc(doc(db, 'data', `${id}`), {
                Name: name,
                id: `${id}`,
                Phone: phone,
                Type: type,
                Area: area,
                Bed: bed,
                Bath: bath,
                Level: level,
                Finsh: finsh,
                Location: location,
                Sale: sale,
                Dis: dis,
                img: url
            });
        } catch (er) {
        }
        setBtn(false)
        setName('')
        setPhone('')
        setArea('')
        setBath('')
        setBed('')
        setType('')
        setDis('')
        setFinsh('')
        setLevel('')
        setSale('')
        setLocation('')
    }

    return (
        <Container>
            <Box style={{ width: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '70px 0 0' }}>
                <Stack sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }, paddingTop: '10px' }} className="steps-card-container">
                    <div className=" stepDev">
                        <div className="step-number">
                            <span>1</span>
                            <p>Step</p>
                        </div>
                        <div className="step-text">
                            <span className="step-title">List Your Property Details</span
                            ><p>Add all the information related to your property</p>
                        </div>
                    </div>
                    <div className=" stepDev">
                        <div className="step-number">
                            <span>2</span>
                            <p>Step</p>
                        </div>
                        <div className="step-text">
                            <span className="step-title">One Of Our Agents Will Call You</span>
                            <p>We will help you find the best buyer</p>
                        </div>
                    </div>
                    <div className=" stepDev">
                        <div className="step-number">
                            <span>3</span>
                            <p>Step</p>
                        </div>
                        <div className="step-text">
                            <span className="step-title">Meet With Serious Buyers</span>
                            <p>Final step to sell your property</p>
                        </div>
                    </div>
                </Stack>
                <Stack sx={{ alignItems: 'center', marginBottom: '10px' }}>
                    <img style={{ width: '250px' }} src={img} alt='' />
                    <Typography variant='h5' sx={{ textAlign: 'center' }}>
                        Sell - Rent Your Unit With Maverick
                    </Typography>
                </Stack>
                <Card sx={{ width: { xs: '90%', sm: '80%' }, display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px', margin: '10px 0 ' }}>
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                        Complete The Form
                    </Typography>
                    <Typography sx={{ textAlign: 'center' }} variant='caption'>
                        Your privacy is important to us. We won't publish or share your information with anyone
                    </Typography>
                    <Box component='form'
                        onSubmit={async (e) => {
                            e.preventDefault();
                            sendData();
                            setMessege(true);
                            setTimeout(() => {
                                setMessege(false)
                                nav('/')
                            }, 2000);
                        }}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', margin: '15px 0 0' }}>
                        <FormControl required sx={{ width: { xs: '100%', md: '50%' }, padding: '5px' }}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={sale}
                                onChange={(e) => {
                                    handleSaleChange(e)
                                }}
                            >
                                <FormControlLabel value="Sell" control={<Radio />} label="Sell" />
                                <FormControlLabel value="Rent" control={<Radio />} label="Rent" />
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            value={name}
                            required
                            id="YourName" label="Your Name"
                            variant="outlined" type="text"
                            onChange={(e) => {
                                handleNameChange(e)
                            }}
                        />

                        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: '5px' }}>
                            <PhoneInput
                                inputProps={{ required: true }}
                                country={country}
                                value={phone}
                                onChange={(value) => {
                                    setPhone(value)
                                }}
                                countryCodeEditable={false}
                            />
                        </Box>
                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            id="Location" label="Location" variant="outlined" type="text"
                            value={location}
                            required
                            onChange={(e) => {
                                handlelocationChange(e)
                            }}
                        />

                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            id="compoundName" label="Compound Name" variant="outlined" type="text"
                            value={compoundName}
                            required
                            onChange={(e) => {
                                handleCompoundNameChange(e)
                            }}
                        />

                        <Stack sx={{ flexDirection: 'row', width: { xs: '100%', md: '50%' }, padding: '5px' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-label">Property Type</InputLabel>
                                <Select
                                    required
                                    sx={{ minWidth: 'fit-content' }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={type}
                                    label="Property Type"
                                    onChange={handleTypeChange}
                                >
                                    <MenuItem value='Apartment'>Apartment</MenuItem>
                                    <MenuItem value="Duplex">Duplex</MenuItem>
                                    <MenuItem value="Studio">Studio</MenuItem>
                                    <MenuItem value="Penthouse">Penthouse</MenuItem>
                                    <MenuItem value="Family">Family house</MenuItem>
                                    <MenuItem value="Standalone">Standalone</MenuItem>
                                    <MenuItem value="Twin house">Twin house
                                    </MenuItem>
                                    <MenuItem value="One storey Villa">One storey Villa</MenuItem>
                                    <MenuItem value="Chalet">Chalet</MenuItem>
                                    <MenuItem value="Townhouse">Townhouse</MenuItem>
                                    <MenuItem value="Cabin">Cabin</MenuItem>
                                    <MenuItem value="Clinic">Clinic</MenuItem>
                                    <MenuItem value="Office">Office</MenuItem>
                                    <MenuItem value="Retail">Retail</MenuItem>
                                    <MenuItem value="Retail">Villa</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>

                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            id="arya" label="Area(m)" variant="outlined" type="number"
                            required
                            value={area}
                            onChange={(e) => {
                                handleAreaChange(e)
                            }}
                        />

                        <Stack sx={{ flexDirection: 'row', width: { xs: '100%', md: '50%' }, padding: '5px' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="Bedrooms">Bedrooms</InputLabel>
                                <Select
                                    required
                                    sx={{ minWidth: 'fit-content' }}
                                    labelId="demo-simple-select-label"
                                    id="Bedroom"
                                    value={bed}
                                    label="Bedrooms"
                                    onChange={handlebedChange}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>

                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack sx={{ flexDirection: 'row', width: { xs: '100%', md: '50%' }, padding: '5px' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="Bathrooms">Bathrooms</InputLabel>
                                <Select
                                    required
                                    sx={{ minWidth: 'fit-content' }}
                                    labelId="demo-simple-select-label"
                                    id="Bathroom"
                                    value={bath}
                                    label="Bathrooms"
                                    onChange={handlebathChange}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack sx={{ flexDirection: 'row', width: { xs: '100%', md: '50%' }, padding: '5px' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="Levels">Floor</InputLabel>
                                <Select
                                    sx={{ minWidth: 'fit-content' }}
                                    labelId="demo-simple-select-label"
                                    id="Level"
                                    value={level}
                                    label="Floor"
                                    onChange={handlelevelChange}
                                >
                                    <MenuItem value='Ground'>Ground</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>

                                </Select>
                            </FormControl>
                        </Stack>
                        {/* <Box sx={{ width: { xs: '100%', md: '50%' }, padding: '5px' }}>
                            <Typography variant='body2'>
                                Upload Your Images ...
                            </Typography>
                            <Button
                                component="label"
                                variant="outlined"
                                // tabIndex={-1}
                                sx={{ padding: '10px', margin: '15px' }}
                                startIcon={<AddPhotoAlternate />}
                                onChange={(e) => {
                                    handleFileChange(e)
                                }}
                            >
                                <VisuallyHiddenInput type="file" multiple />
                            </Button>
                            <LinearProgress variant="determinate" value={prog} />
                        </Box> */}
                        <FormControl sx={{ width: { xs: '100%', md: '50%' }, padding: '5px' }} >
                            <FormLabel required id="demo-row-radio-buttons-group-label">Finishing</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                itemProp='required'
                                name="row-radio-buttons-group"
                                value={finsh}
                                onChange={(e) => {
                                    handleFinshChange(e)
                                }}
                            >
                                <FormControlLabel value="Finished" control={<Radio />} label="Finished" />
                                <FormControlLabel value="Semi Finished" control={<Radio />} label="Semi Finished" />
                                <FormControlLabel value="Cor & Shell" control={<Radio />} label="Cor & Shell" />
                                <FormControlLabel value="Furnished" control={<Radio />} label="Furnished" />
                            </RadioGroup>
                        </FormControl>





                        <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            required
                            value={dis}
                            rows={4}
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            onChange={(e) => {
                                handleDisChange(e)
                            }}
                        />



                        <Button disabled={btn} variant="contained" type="submit" style={{ width: '50%' }}

                            className="btn">
                            {btn ? <ReactLoading type={'spin'} height={'20px'} width={'20px'} /> : "Send"}
                        </Button>
                    </Box>
                </Card>
            </Box>
            <p style={{ zIndex: '10', backgroundColor: 'whitesmoke', display: 'flex', alignItems: 'center', color: 'black', padding: '10px', borderRadius: '6px', boxShadow: 'rgb(255 255 255 / 25%) 0px 5px 30px 0px', position: 'fixed', top: '100px', right: messege ? '20px' : '-230px', transition: '0.8s', scale: messege ? "1" : '0' }}>Data has been sent successfully <Info style={{ margin: '3px 0 0 10px', fontSize: '20px', color: 'teal' }} /></p>
        </Container>
    )
}

export default Sell