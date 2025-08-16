import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Stack } from "@mui/material";
import NavBtn from "./NavBtn";
import MavLoading from "../Loading/MavLoading";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // هات الدور من Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role !== "admin") {
            navigate("/"); // مش ادمن
          } else {
            setRole("admin"); // ادمن
          }
        } else {
          navigate("/"); // مفيش بيانات
        }
      } else {
        navigate("/"); // مش مسجل دخول
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <MavLoading />
      </div>
    );
  }

  return (
    <>
      <Stack>
        <NavBtn />
        <Container>
          <Outlet />
        </Container>
      </Stack>
    </>
  );
}

export default Dashboard;
