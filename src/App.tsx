import { Routes, Route } from "react-router-dom";
import "./App.css";
import User from "./Roles/User";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Admin from "./Roles/Admin";
import { AppContextProvider } from "./appContext";

import { Users } from "./components/Users/Users";
import { Bikes } from "./components/Bikes/Bikes";
import { NewReservation } from "./components/Reservations/NewReservation";
import React from "react";

function App() {
  return (
    <div>
      <UserAuthContextProvider>
        <AppContextProvider>
          <Routes>
            <Route
              path="/user"
              element={
                <ProtectedRoute role="user">
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="manager">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute role="manager">
                  <div style={{ padding: 30 }}>
                    <Users />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bikes"
              element={
                <ProtectedRoute role="manager">
                  <div style={{ padding: 30 }}>
                    {" "}
                    <Bikes />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservation"
              element={
                <ProtectedRoute role="user">
                  <div style={{ padding: 30 }}>
                    {" "}
                    <NewReservation />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "100px",
                    marginLeft: "40%",
                    width: "400px",
                  }}
                >
                  <Login />
                </div>
              }
            />
            <Route
              path="/signup"
              element={
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "100px",
                    marginLeft: "40%",

                    width: "400px",
                  }}
                >
                  <Signup />
                </div>
              }
            />
          </Routes>
        </AppContextProvider>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
