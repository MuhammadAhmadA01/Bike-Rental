import React, { useEffect, useState } from "react";
import { useAppState } from "../../appContext";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { DataTable } from "../DataGrid";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AlertDialog from "../AlertDialog";

import { useDebounce } from "../../utils";
import { useUserAuth } from "../../context/UserAuthContext";
import moment from "moment";
import ReactStars from "react-rating-stars-component";

const Rating = ({ data }) => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey((pre) => pre + 1);
  }, [data.rating]);
  return (
    <>
      <ReactStars
        isHalf={true}
        size={22}
        edit={false}
        key={key}
        value={+data.rating}
      />
    </>
  );
};
const GetStatus = ({ data }) => {
  const [color_, setColor_] = useState("green");
  var color = "green";
  useEffect(() => {
    setColor_(color);
  }, [color]);
  const getStatus = (startDate, endDate) => {
    if (moment(startDate).isAfter(moment(), "day")) {
      color = "#007bff";
      return "Upcoming";
    } else if (moment(endDate).isBefore(moment(), "day")) {
      color = "red";
      return "Completed";
    } else {
      return "In Progress";
    }
  };
  return (
    <div style={{ color: color_ }}>
      {getStatus(data.startDate, data.endDate)}
    </div>
  );
};
const Actions = (props: any) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);
  const [state, dispatch]: any = useAppState();
  const [openDialog, setOpenDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState("0");

  const onDeleteClick = () => {
    setOpenDialog(true);
  };
  const onRatingClick = () => {
    setShowRatingDialog(true);
  };
  const ifEligibleForRating = (endDate) => {
    return moment(endDate).isBefore(moment(), "day");
  };
  const ifCancelAble = (startDate, endDate) => {
    return (
      moment(startDate).isAfter(moment(), "day") &&
      moment(endDate).isAfter(moment(), "day")
    );
  };
  const cancelReservation = () => {
    setOpenDialog(false);
    setLoading(true);
    const resDoc = doc(db, "reservations", data.id);
    updateDoc(resDoc, { isDeleted: true }).then(() => {
      dispatch({
        type: "UPDATE_MY_RESERVATIONS",
        payload: {
          key: "myReservations",
          id: data.id,
          updated: { isDeleted: true },
        },
      });
      setLoading(false);
    });
  };
  const ratingChanged = (rating) => {
    setRating(+parseFloat(rating).toFixed(1) + "");
  };
  const submitRating = () => {
    setShowRatingDialog(false);
    setLoading(true);
    const resDoc = doc(db, "reservations", data.id);
    updateDoc(resDoc, { rating: rating }).then(() => {
      dispatch({
        type: "UPDATE_MY_RESERVATIONS",
        payload: {
          key: "myReservations",
          id: data.id,
          updated: { rating },
        },
      });
      setLoading(false);
      updateBikeRating(data.registrationId);
    });
  };
  const updateBikeRating = async (registrationId) => {
    const q = query(
      collection(db, "reservations"),
      where("registrationId", "==", registrationId),
      where("rating", "!=", "0")
    );

    const querySnapshot = await getDocs(q);
    const res = [] as any;
    let sum = 0;
    querySnapshot.forEach((doc: any) => {
      const obj = { ...doc.data() };
      sum += +obj.rating;
    });
    const avg = sum / querySnapshot.size;
    const bikeDoc = doc(db, "bikes", data.registrationId);
    updateDoc(bikeDoc, {
      rating: +parseFloat(avg.toString()).toFixed(1) + "",
    }).then(() => {});
  };

  return (
    <div>
      {ifCancelAble(data.startDate, data.endDate) && (
        <Button disabled={loading} color="warning" onClick={onDeleteClick}>
          Cancel
        </Button>
      )}

      {ifEligibleForRating(data.endDate) && (
        <Button
          disabled={loading || +data.rating > 0}
          color="primary"
          onClick={onRatingClick}
        >
          Give a Rating
        </Button>
      )}

      {loading && (
        <CircularProgress style={{ height: "25px", width: "25px" }} />
      )}
      <AlertDialog
        open={openDialog}
        information={"Are you sure you want to cancel the reservation?"}
        title={"Cancel Reservation"}
        yesLabel={"Submit"}
        noLabel={"Cancel"}
        yesClicked={cancelReservation}
        onClose={() => setOpenDialog(false)}
        noClicked={() => setOpenDialog(false)}
      ></AlertDialog>
      <AlertDialog
        open={showRatingDialog}
        information={"Your feedback matters!"}
        title={"Rate your Ride"}
        yesLabel={"Submit"}
        noLabel={"Cancel"}
        yesClicked={submitRating}
        onClose={() => setOpenDialog(false)}
        noClicked={() => setOpenDialog(false)}
      >
        <div style={{ width: "400px", paddingLeft: "25%" }}>
          {" "}
          <ReactStars size={40} onChange={ratingChanged} />
        </div>
      </AlertDialog>
    </div>
  );
};
const columns: GridColDef[] = [
  { field: "id", flex: 1, headerName: "ID" },
  { field: "registrationId", flex: 0.5, headerName: "Bike Id" },
  { field: "startDate", flex: 0.5, headerName: "Start Date" },
  { field: "endDate", flex: 0.5, headerName: "End Date" },
  {
    field: "duration",
    flex: 0.5,
    headerName: "Duration",
    valueGetter: (params) => {
      return (
        moment(params.row.endDate).diff(moment(params.row.startDate), "days") +
        1 +
        " Day(s)"
      );
    },
  },
  {
    field: "status",
    flex: 0.5,
    headerName: "Status",
    sortable: false,
    disableColumnMenu: true,

    renderCell: (params) => {
      return <GetStatus data={params.row} />;
    },
  },
  {
    field: "rating",
    flex: 0.5,
    headerName: "Rating",
    sortable: false,
    disableColumnMenu: true,

    renderCell: (params) => {
      return <Rating data={params.row} />;
    },
  },

  {
    field: "action",
    renderHeader: () => {
      return <div style={{ marginLeft: 15 }}>Actions</div>;
    },
    sortable: false,
    disableColumnMenu: true,
    flex: 1.5,
    renderCell: (params) => {
      return <Actions data={params.row} />;
    },
  },
];
export const MyReservations = () => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch]: any = useAppState();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { user } = useUserAuth();

  useEffect(() => {
    const getReservations = async () => {
      setLoading(true);
      const q = query(
        collection(db, "reservations"),
        where("reservedBy", "==", user.email.toLowerCase())
      );

      const querySnapshot = await getDocs(q);
      const res = [] as any;
      querySnapshot.forEach((doc: any) => {
        const obj = { id: doc.id, ...doc.data() };
        res.push(obj);
      });
      dispatch({
        type: "SET_PROP",
        payload: {
          key: "myReservations",
          value: res,
        },
      });
      setLoading(false);
    };
    if (user && user.email) getReservations();
  }, [user]);
  const getFilteredResults = (debouncedSearchTerm) => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length <= 0)
      return state.myReservations.filter((u: any) => !u.isDeleted);
    return state.myReservations.filter(
      (u: any) =>
        (!u.isDeleted &&
          u.startDate
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        u.endDate.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        u.registrationId
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  };
  return (
    <>
      <Box style={{ margin: 5, width: "100%" }}>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Box style={{ display: "flex", marginBottom: "10px" }}>
            <h3>My Reservations</h3>{" "}
          </Box>
          <TextField
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
            id="outlined-basic"
            label="Search Reservation"
            variant="standard"
          />
        </Box>
        <DataTable
          data={getFilteredResults(debouncedSearchTerm)}
          loading={loading}
          columns={columns}
        />{" "}
      </Box>
    </>
  );
};
