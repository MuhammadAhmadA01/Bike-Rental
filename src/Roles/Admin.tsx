import { Box } from "@mui/material";
import { Users } from "../components/Users/Users";
import { Bikes } from "../components/Bikes/Bikes";

const Admin = () => {
  return (
    <Box>
      <Box style={{ margin: "20px 10px", display: "flex" }}>
        <Users />
        <Bikes />
      </Box>
    </Box>
  );
};

export default Admin;
