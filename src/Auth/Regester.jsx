/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from "react-loading";
import { Box, Button, Card, TextField, Typography } from "@mui/material";

function Regester() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [btn, setBtn] = useState(false);
  const nav = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  // console.log(user)
  useEffect(() => {
    if (user) {
      if (user.emailVerified) {
        nav("/");
      }
    }
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
          alignItems: "center",
        }}
      >
        <h1>Loading .....</h1>
      </div>
    );
  }

  if (user) {
    if (user.emailVerified === false) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
          }}
        >
          <div>
            <h1>We sent to you email to verify your Acount</h1>
            <Button
              onClick={() => {
                sendEmailVerification(auth.currentUser).then(() => {
                  // Email verification sent!
                  // ...
                  console.log("Email verification sent!");
                });
              }}
            >
              send Email again
            </Button>
          </div>
        </div>
      );
    }
  }

  if (!user) {
    return (
      <Box
        style={{
          width: "100%",
          display: "flex",
          height: "calc(100vh - 64px)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: { xs: "90%", sm: "80%" },
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <Typography variant="h5" component="h4">
            Create a new Acount
          </Typography>
          <Box
            component="form"
            onSubmit={async (e) => {
              e.preventDefault();
              // console.log('sup');
              const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
              );
              setBtn(false);
              nav("/");
              sendEmailVerification(res.user).then(() => {
                // Email verification sent!
                // ...
                console.log("Email verification sent!");
              });
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <TextField
              sx={{
                margin: "10px",
                padding: "5px",
                width: { xs: "100%", md: "50%" },
              }}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              id="username"
              label="User Name"
              variant="outlined"
              type="text"
            />

            <TextField
              sx={{
                margin: "10px",
                padding: "5px",
                width: { xs: "100%", md: "50%" },
              }}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id="email"
              label="Email"
              variant="outlined"
              type="text"
            />

            <TextField
              sx={{
                margin: "10px",
                padding: "5px",
                width: { xs: "100%", md: "50%" },
              }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              id="pass"
              label="Password"
              variant="outlined"
              type="password"
            />
            <Button
              variant="contained"
              type="submit"
              style={{ width: "50%" }}
              onClick={() => {
                setBtn(true);
              }}
              className="btn"
            >
              {btn ? (
                <ReactLoading type={"spin"} height={"20px"} width={"20px"} />
              ) : (
                "signup"
              )}
            </Button>
            <p style={{ margin: "10px" }}>
              Already have an Acount{" "}
              <Link to="/signin">
                <Button>login</Button>
              </Link>
            </p>
          </Box>
        </Card>
      </Box>
    );
  }
}

export default Regester;
