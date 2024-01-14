import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Overview } from "./Overview";
import { Reservations } from "./Reservations";

interface IDialogProps {
  yesLabel: string;
  noLabel: string;
  yesClicked: any;
  noClicked: any;
  information: string;
  open: boolean;
  onClose: any;
  title: string;
}
export default function UserDetails(props: any) {
  const { open, onClose, data } = props;

  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        PaperProps={{
          style: {
            background: "#f9f9f9",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{`User Details - ${data.email}`}</DialogTitle>
        <DialogContent style={{ background: "#f9f9f9" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={(_, value) => setCurrentTab(value)}
            >
              <Tab value={"overview"} label="Overview" />
              <Tab value={"reservation"} label="Reservations" />
            </Tabs>
          </Box>
          <Box style={{ padding: "20px 10px" }}>
            {currentTab === "overview" && <Overview data={data} />}
            {currentTab === "reservation" && <Reservations data={data} />}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{"Close"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
