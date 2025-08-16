import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from 'react-toastify';

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btn, setBtn] = useState(false);
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setBtn(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // سجل المستخدم في Firestore مع role افتراضي
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user"
      });
      setBtn(false);
      toast.success("Registered successfully!", { autoClose: 2000 });
      nav('/login')
    } catch (error) {
      console.error(error);
      setBtn(false);
      toast.error(`${error.message}`, { autoClose: 2000 });
    }
  };

  return (

    <>
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
            onSubmit={handleRegister}
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
      {/* <form style={{ minHeight: 'calc(100vh - 100px)', marginTop: "60px" }} onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form> */}
    </>
  );
}
export default RegisterForm;
