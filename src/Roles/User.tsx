import { Box } from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAppState } from "../appContext";
import { MyReservations } from "../components/Reservations/MyReservations";
import { useUserAuth } from "../context/UserAuthContext";

const User = () => {
  const { logOut, user } = useUserAuth();

  const navigate = useNavigate();
  const [state]: any = useAppState();
  return (
    <>
      <Box>
        <Box style={{ margin: "20px 10px", display: "flex" }}>
          <MyReservations />
        </Box>
      </Box>
    </>
  );
};

export default User;
