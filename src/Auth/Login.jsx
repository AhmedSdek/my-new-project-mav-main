import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import ReactLoading from "react-loading";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [btn, setBtn] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    // لو موجود في localStorage رجعه
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBtn(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // هات بياناته من Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = { uid: user.uid, email: user.email, ...userDoc.data() };
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data));
      }
      setBtn(false)
      toast.success("Login successfully!", { autoClose: 2000 });
      nav('/dashboard')
    } catch (error) {
      console.error(error);
      setBtn(false)
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
          <Box
            component="form"
            onSubmit={handleLogin}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography variant="h5" component="h4">
              Log In
            </Typography>
            <TextField
              sx={{
                margin: "10px",
                padding: "5px",
                width: { xs: "100%", md: "50%" },
              }}
              onChange={(e) => setEmail(e.target.value)}
              id="user"
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
              id="password"
              label="Password"
              variant="outlined"
              type="password"
            />
            <Button
              variant="contained"
              style={{ width: "50%" }}
              type="submit"
              className="btn"
            >
              {btn ? (
                <ReactLoading
                  type={"spin"}
                  color={"white"}
                  height={"20px"}
                  width={"20px"}
                />
              ) : (
                "login"
              )}
            </Button>
            {/* <Button
              onClick={() => {
                setHiden("show");
              }}
              style={{ margin: "10px", color: "red", cursor: "pointer" }}
            >
              Forget Pass
            </Button> */}
            <p style={{ margin: "10px" }}>
              Dont have an Acount
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </p>
          </Box>
        </Card>
      </Box>
      {/* <div style={{ minHeight: "calc(100vh - 100px)", marginTop: "60px" }}>
        {!userData ? (
          <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
          </form>
        ) : (
          <div>
            <p>Welcome, {userData.email}</p>
            <p>Role: {userData.role}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div> */}
    </>
  );
}

export default LoginForm;
