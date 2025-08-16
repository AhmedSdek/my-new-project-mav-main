/* eslint-disable no-unused-vars */

import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from 'react-loading';
import { Box, Button, Card, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import AuthModel from "../comp/AuthModel";
function Signin() {
  const [email, setEmail] = useState('');
  const [btn, setBtn] = useState(false);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate()
  const [user, loading] = useAuthState(auth);
  const [hiden, setHiden] = useState('hiden');
  const [messeg, setMesseg] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.emailVerified) {
        nav('/')
      }
    }
  })


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
        {/* <h1>Loading .....</h1> */}
        <ReactLoading type={'spin'} color={'red'} height={'20%'} width={'20%'} />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthModel hiden={hiden}>

          <Card>
            <Stack component='form' onSubmit={(e) => {
              e.preventDefault()
            }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '30px 10px' }}>
              <IconButton sx={{ position: 'absolute', top: '2px', right: '2px' }} onClick={() => {
                setHiden('hiden')
              }}  >
                <Close />
              </IconButton>
              <TextField
                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="u" label="Email" variant="outlined" type="email" />
              <Button onClick={(e) => {
                e.preventDefault();
                sendPasswordResetEmail(auth, email)
                  .then(() => {
                    // Password reset email sent!
                    // ..
                    setMesseg(true)
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                  });

              }} style={{ width: '50%' }} className="btn">
                Reset Email
              </Button>
              {messeg &&
                <p style={{ color: 'black', margin: '10px' }}>please check your email to reset your password</p>

              }
            </Stack>
          </Card>

        </AuthModel>


        <Box style={{ width: '100%', display: 'flex', height: 'calc(100vh - 64px)', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ width: { xs: '90%', sm: '80%' }, display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
            <Box component='form' onSubmit={(e) => {
              e.preventDefault()
            }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
              <Typography variant="h5" component='h4'>Log In</Typography>
              <TextField
                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="user" label="Email" variant="outlined" type="text" />


              <TextField
                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                id="password" label="Password" variant="outlined" type="password" />
              {
                err &&
                <p>{err}</p>
              }
              <Button variant="contained" style={{ width: '50%' }} onClick={async () => {
                setBtn(true);
                await signInWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // ...
                    nav("/dashboard");
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode)
                    setErr(errorCode)
                  });
                setBtn(false);
              }} className="btn">
                {btn ? <ReactLoading type={'spin'} color={'white'} height={'20px'} width={'20px'} /> : "login"}

              </Button>
              <Button onClick={() => {
                setHiden('show')
              }} style={{ margin: '10px', color: 'red', cursor: 'pointer' }}>
                Forget Pass
              </Button>
              <p style={{ margin: '10px' }}>

                Dont have an Acount <Link to='/signup' >
                  <Button>
                    signup
                  </Button>

                </Link>
              </p>
            </Box>
          </Card>
        </Box>

      </>
    )
  }


  if (user) {
    if (user.emailVerified === false) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
          <div>
            <h1>We sent to you email to verify your Acount</h1>
            <Button onClick={() => {
              sendEmailVerification(auth.currentUser)
                .then(() => {
                  // Email verification sent!
                  // ...
                  console.log('Email verification sent!')
                });
            }}>
              send Email again
            </Button>
          </div>
        </div>
      )
    }
  }

}

export default Signin