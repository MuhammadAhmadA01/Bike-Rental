import React, { useEffect, useState } from "react";
import { useAppState } from "../../appContext";
import { db } from "../../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { DataTable } from "../DataGrid";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AlertDialog from "../AlertDialog";
import AddNewUser from "./AddNewUser";
import UserDetails from "./User Details";
import AddIcon from "@mui/icons-material/Add";
import { useDebounce } from "../../utils";
import { useUserAuth } from "../../context/UserAuthContext";

const Actions = (props: any) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);
  const [state, dispatch]: any = useAppState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useUserAuth();

  const onDeleteClick = () => {
    setOpenDialog(true);
  };
  const onDetailsClick = () => {
    setShowDetails(true);
  };
  const deleteUser = () => {
    setOpenDialog(false);
    setLoading(true);
    const userDoc = doc(db, "users", data.email);
    updateDoc(userDoc, { isDeleted: true }).then(() => {
      dispatch({
        type: "UPDATE_USER",
        payload: {
          key: "allUsers",
          email: data.email,
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
    <>
      <Button
        disabled={loading || user.email === data.email}
        color="warning"
        onClick={onDeleteClick}
      >
        Delete
      </Button>
      <Button disabled={loading} color="secondary" onClick={onEditClick}>
        Edit
      </Button>

      <Button disabled={loading} color="primary" onClick={onDetailsClick}>
        Details
      </Button>

      {loading && (
        <CircularProgress style={{ height: "25px", width: "25px" }} />
      )}
      <AlertDialog
        open={openDialog}
        information={"Are you sure you want to delete the user?"}
        title={"Delete user"}
        yesLabel={"Yes"}
        noLabel={"Cancel"}
        yesClicked={deleteUser}
        onClose={() => setOpenDialog(false)}
        noClicked={() => setOpenDialog(false)}
      />
      {openEditDialog && (
        <AddNewUser
          onClose={() => setOpenEditDialog(false)}
          isUpdate={true}
          user={data}
          open={openEditDialog}
        />
      )}
      {showDetails && (
        <UserDetails
          onClose={() => setShowDetails(false)}
          open={showDetails}
          data={data}
        />
      )}
    </>
  );
};
const columns: GridColDef[] = [
  { field: "name", flex: 1, headerName: "Name" },
  { field: "email", flex: 1, headerName: "Email" },
  { field: "age", flex: 0.5, headerName: "Age" },
  {
    field: "role",
    headerName: "Role",
    valueGetter: (params: any) => {
      return params.row.isManager ? "Manager" : "User";
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
export const Users = () => {
  const usersCollectionRef = collection(db, "users");

  const [loading, setLoading] = useState(true);
  const [state, dispatch]: any = useAppState();
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      if (data.docs) {
        dispatch({
          type: "SET_PROP",
          payload: {
            key: "allUsers",
            value: data.docs.map((doc: any) => ({ ...doc.data() })),
          },
        });
        setLoading(false);
      }
    };

    getUsers();
  }, []);
  const getFilteredResults = (debouncedSearchTerm) => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length <= 0)
      return state.allUsers.filter((u: any) => !u.isDeleted);
    return state.allUsers.filter(
      (u: any) =>
        (!u.isDeleted &&
          u.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  };
  return (
    <>
      {openAddNewDialog && (
        <AddNewUser
          title={"Create New User"}
          open={openAddNewDialog}
          onClose={() => setOpenAddNewDialog(false)}
        />
      )}
      <Box style={{ margin: 5, width: "100%" }}>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Box style={{ display: "flex", marginBottom: "10px" }}>
            <h3>Users</h3>{" "}
            <Button
              style={{ marginLeft: "10px" }}
              endIcon={<AddIcon />}
              onClick={() => setOpenAddNewDialog(true)}
            >
              Add User
            </Button>
          </Box>
          <TextField
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
            id="outlined-basic"
            label="Search User"
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
