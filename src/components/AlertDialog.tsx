import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";

interface IDialogProps {
  yesLabel: string;
  noLabel: string;
  yesClicked: any;
  noClicked: any;
  information: string;
  open: boolean;
  onClose: any;
  title: string;
  children?: any;
  loading?: boolean;
}
export default function AlertDialog(props: IDialogProps) {
  const {
    open,
    noClicked,
    yesClicked,
    yesLabel,
    noLabel,
    information,
    onClose,
    title,
    children,
    loading,
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {information}
          </DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={noClicked}>{noLabel}</Button>
          <Button onClick={yesClicked} autoFocus>
            {yesLabel}
          </Button>
          {loading && (
            <CircularProgress style={{ margin: "0px 10px" }} size={30} />
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
