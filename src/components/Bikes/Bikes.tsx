import React, { useEffect, useState } from "react";
import { useAppState } from "../../appContext";
import { db } from "../../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { DataTable } from "../DataGrid";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AlertDialog from "../AlertDialog";
import AddNewBike from "./AddNewBike";
import BikeDetails from "./Bike Details";
import AddIcon from "@mui/icons-material/Add";
import { useDebounce } from "../../utils";
const Actions = (props: any) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);
  const [state, dispatch]: any = useAppState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const onDetailsClick = () => {
    setShowDetails(true);
  };
  const onDeleteClick = () => {
    setOpenDialog(true);
  };
  const deleteBike = () => {
    setOpenDialog(false);
    setLoading(true);
    const bikeDoc = doc(db, "bikes", data.registrationId);
    updateDoc(bikeDoc, { isDeleted: true }).then(() => {
      dispatch({
        type: "UPDATE_BIKE",
        payload: {
          key: "allBikes",
          registrationId: data.email,
          updated: { isDeleted: true },
        },
      });
      setLoading(false);
    });
  };
  const onEditClick = () => {
    setOpenEditDialog(true);
  };
  return (
    <div>
      <Button disabled={loading} color="primary" onClick={onEditClick}>
        Edit
      </Button>

      <Button disabled={loading} color="warning" onClick={onDeleteClick}>
        Delete
      </Button>
      <Button disabled={loading} color="primary" onClick={onDetailsClick}>
        Details
      </Button>

      {loading && (
        <CircularProgress style={{ height: "25px", width: "25px" }} />
      )}
      <AlertDialog
        open={openDialog}
        information={"Are you sure you want to delete this bike?"}
        title={"Delete Bike"}
        yesLabel={"Yes"}
        noLabel={"Cancel"}
        yesClicked={deleteBike}
        onClose={() => setOpenDialog(false)}
        noClicked={() => setOpenDialog(false)}
      />
      {openEditDialog && (
        <AddNewBike
          onClose={() => setOpenEditDialog(false)}
          isUpdate={true}
          _bike={data}
          open={openEditDialog}
        />
      )}
      {showDetails && (
        <BikeDetails
          onClose={() => setShowDetails(false)}
          open={showDetails}
          data={data}
        />
      )}
    </div>
  );
};
const columns: GridColDef[] = [
  { field: "registrationId", flex: 0.8, headerName: "Registration Id" },
  { field: "color", headerName: "Color" },
  { field: "model", headerName: "Model" },
  { field: "location", headerName: "Location" },
  { field: "rating", headerName: "Rating" },

  {
    renderHeader: () => {
      return <div style={{ marginLeft: 15 }}>Actions</div>;
    },
    field: "action",
    sortable: false,
    disableColumnMenu: true,
    flex: 1.5,
    renderCell: (params) => {
      return <Actions data={params.row} />;
    },
  },
];
export const Bikes = () => {
  const bikesCollectionRef = collection(db, "bikes");
  const [loading, setLoading] = useState(true);
  const [state, dispatch]: any = useAppState();
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    const getBikes = async () => {
      const data = await getDocs(bikesCollectionRef);
      if (data.docs) {
        dispatch({
          type: "SET_PROP",
          payload: {
            key: "allBikes",
            value: data.docs.map((doc: any) => ({ ...doc.data() })),
          },
        });
        setLoading(false);
      }
    };

    getBikes();
  }, []);

  const getFilteredResults = (debouncedSearchTerm) => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length <= 0)
      return state.allBikes.filter((u: any) => !u.isDeleted);
    return state.allBikes.filter(
      (u: any) =>
        (!u.isDeleted &&
          u.registrationId
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        u.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        u.color.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        u.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  };
  return (
    <>
      {openAddNewDialog && (
        <AddNewBike
          title={"Create New Bike"}
          open={openAddNewDialog}
          onClose={() => setOpenAddNewDialog(false)}
        />
      )}
      <Box style={{ margin: 5, width: "100%" }}>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Box style={{ display: "flex", marginBottom: "10px" }}>
            <h3>Bikes</h3>{" "}
            <Button
              style={{ marginLeft: "10px" }}
              endIcon={<AddIcon />}
              onClick={() => setOpenAddNewDialog(true)}
            >
              Add Bike
            </Button>
          </Box>
          <TextField
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
            id="outlined-basic"
            label="Search Bike"
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
