import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useAppState } from "../appContext";

const ResponsiveAppBar = (props: any) => {
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const role = localStorage.getItem("role");
  const { pages } = props;
  const [state, dispatch]: any = useAppState();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TwoWheelerIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Bike Rental
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page: any) => (
              <Button
                key={page.title}
                onClick={() => navigate(page.route)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Typography
            component={"span"}
          >{`Welcome ${role}, ${user.email}`}</Typography>
          <Button
            style={{ marginLeft: "30px" }}
            color="inherit"
            onClick={async () => {
              await logOut();
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
