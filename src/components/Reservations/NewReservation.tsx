import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { Attribute, AttributeLabel, AttributeValue } from "../Attribute";
import ReactStars from "react-rating-stars-component";
import ClearIcon from "@mui/icons-material/Clear";
import MuiSelect from "../MuiSelect";
import AlertDialog from "../AlertDialog";
import { color } from "@mui/system";
import { useAppState } from "../../appContext";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
const bikeAttributes = [
  { label: "Registration ID", field: "registrationId" },
  { label: "Model", field: "model" },
  { label: "Color", field: "color" },
  { label: "Location", field: "location" },
];
const reservationAttributes = [
  {
    label: "Start Date",
    resolve: (item) => moment(item.startDate).format("MM-DD-YYYY"),
  },
  {
    label: "End Date",
    resolve: (item) => moment(item.endDate).format("MM-DD-YYYY"),
  },
  {
    label: "Duration",
    resolve: (item) => {
      return moment(item.endDate).diff(moment(item.startDate), "days") + 1;
    },
  },
];
const Bike = ({ bike, onBookNow }) => {
  return (
    <Paper style={{ marginTop: "20px", width: "450px" }}>
      <Box
        style={{ justifyContent: "center", display: "flex", padding: "10px 0" }}
      >
        <ReactStars size={24} edit={false} value={+bike.rating} />
      </Box>
      <Attribute>
        <AttributeLabel>{"Registration Id"}</AttributeLabel>
        <AttributeValue>{bike?.registrationId}</AttributeValue>
      </Attribute>
      <Attribute>
        <AttributeLabel>{"Model"}</AttributeLabel>
        <AttributeValue>{bike?.model}</AttributeValue>
      </Attribute>
      <Attribute>
        <AttributeLabel>{"Color"}</AttributeLabel>
        <AttributeValue>{bike?.color}</AttributeValue>
      </Attribute>
      <Attribute>
        <AttributeLabel>{"Location"}</AttributeLabel>
        <AttributeValue>{bike?.location}</AttributeValue>
      </Attribute>
      <Box
        style={{ justifyContent: "end", display: "flex", padding: "10px 10px" }}
      >
        <Button variant={"outlined"} onClick={onBookNow}>
          Book Now
        </Button>
      </Box>
    </Paper>
  );
};

export const NewReservation = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const reservationsCollectionRef = collection(db, "reservations");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [availableBikes, setAvailableBikes] = useState<any[] | null>(null);
  const [filters, setFilters] = useState({} as any);
  const [selectedBike, setSelectedBike] = useState({} as any);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isReservingBike, setIsReservingBike] = useState(false);
  const [filtered, setFiltered] = useState<any[] | null>(null);
  const [appliedFilters, setAppliedFilters] = useState({
    colors: [],
    models: [],
    locations: [],
    rating: "0",
  } as any);
  const [isLoading, setIsLoading] = useState(false);
  const findBikes = async () => {
    if (!endDate) setEndDate(startDate);
    setIsLoading(true);
    const data = await getDocs(reservationsCollectionRef);
    const allReservations = data.docs.map((doc: any) => ({ ...doc.data() }));
    const overlapping = allReservations.filter(
      (r) =>
        !r.isDeleted &&
        (moment(startDate).isBetween(r.startDate, r.endDate, "days", "[]") ||
          moment(endDate).isBetween(r.startDate, r.endDate, "days", "[]"))
    );
    const unavailableBikes = overlapping.map((res) => res.registrationId);
    const q = query(
      collection(db, "bikes"),
      where(
        "registrationId",
        "not-in",
        unavailableBikes.length ? unavailableBikes : [""]
      ),
      where("isAvailable", "==", true)
    );
    const querySnapshot = await getDocs(q);
    const res = [] as any;
    querySnapshot.forEach((doc: any) => {
      const obj = { ...doc.data() };
      res.push(obj);
    });
    setAvailableBikes(res.filter((r) => !r.isDeleted));
    setFiltered(res.filter((r) => !r.isDeleted));
    setIsLoading(false);
  };
  useEffect(() => {
    let filteredResults = availableBikes
      ? availableBikes.filter((b) => {
          return (
            (!appliedFilters.colors.length ||
              appliedFilters.colors.includes(b.color)) &&
            (!appliedFilters.models.length ||
              appliedFilters.models.includes(b.model)) &&
            (!appliedFilters.locations.length ||
              appliedFilters.locations.includes(b.location)) &&
            (appliedFilters.rating === "0" ||
              parseFloat(b.rating) >= parseInt(appliedFilters.rating))
          );
        })
      : [];
    setFiltered(filteredResults);
  }, [appliedFilters]);
  useEffect(() => {
    if (availableBikes && availableBikes.length) {
      const colors = availableBikes.map((res: any) => {
        return res.color;
      });
      const models = availableBikes.map((res: any) => {
        return res.model;
      });
      const locations = availableBikes.map((res: any) => {
        return res.location;
      });
      const ratings = ["1", "2", "3", "4", "5"];
      setFilters({
        colors: colors.filter((item, pos) => colors.indexOf(item) === pos),
        locations: locations.filter(
          (item, pos) => locations.indexOf(item) === pos
        ),
        models: models.filter((item, pos) => models.indexOf(item) === pos),
        ratings,
      });
    }
  }, [availableBikes]);
  const onBookNow = (bike) => {
    setSelectedBike(bike);
    setShowConfirmationDialog(true);
  };
  const submitReservation = async (e: any) => {
    setIsReservingBike(true);

    e.preventDefault();
    try {
      const reservationCOllectionRef = collection(db, "reservations");

      await setDoc(doc(reservationCOllectionRef), {
        startDate: moment(startDate).format("MM-DD-YYYY"),
        endDate: moment(endDate).format("MM-DD-YYYY"),
        registrationId: selectedBike.registrationId,
        rating: "0",
        reservedBy: user.email,
      });
      setIsReservingBike(false);
      setShowConfirmationDialog(false);
      navigate("/user");
    } catch (err: any) {}
  };
  return (
    <Box>
      {
        <AlertDialog
          open={showConfirmationDialog}
          information={`Please check details for the booking`}
          title={"Confirm Reservation"}
          yesLabel={"Confirm"}
          noLabel={"Cancel"}
          yesClicked={submitReservation}
          onClose={() => setShowConfirmationDialog(false)}
          noClicked={() => setShowConfirmationDialog(false)}
          loading={isReservingBike}
        >
          <>
            <h4 style={{ marginTop: 20 }}>Booking Details</h4>
            <Box style={{ display: "flex", minWidth: 500 }}>
              <Box style={{ width: "50%" }}>
                {bikeAttributes.map((b, i) => {
                  return (
                    <Attribute key={i}>
                      <AttributeLabel>{[b.label]}</AttributeLabel>
                      <AttributeValue>{selectedBike[b.field]}</AttributeValue>
                    </Attribute>
                  );
                })}
              </Box>
              <Box>
                <Attribute>
                  <AttributeLabel>{"Start Date"}</AttributeLabel>
                  <AttributeValue>
                    {moment(startDate).format("MM-DD-YYYY")}
                  </AttributeValue>
                </Attribute>
                <Attribute>
                  <AttributeLabel>{"End Date"}</AttributeLabel>
                  <AttributeValue>
                    {moment(endDate).format("MM-DD-YYYY")}
                  </AttributeValue>
                </Attribute>
                <Attribute>
                  <AttributeLabel>{"Duration"}</AttributeLabel>
                  <AttributeValue>
                    {moment(endDate).diff(moment(startDate), "days") +
                      1 +
                      " Day(s)"}
                  </AttributeValue>
                </Attribute>
              </Box>
            </Box>
          </>
        </AlertDialog>
      }
      <div style={{ textAlign: "center" }}>
        <h3>Reserve a bike</h3>
      </div>
      <Box
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "50px",
          justifyContent: "center",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            minDate={new Date()}
            onChange={(newValue) => {
              setStartDate(newValue);
              setEndDate(null);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="End Date"
            value={endDate}
            minDate={startDate}
            disabled={!startDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button variant="contained" disabled={!startDate} onClick={findBikes}>
          {" "}
          Find Bikes
        </Button>
      </Box>
      {isLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 60 }}
        >
          <CircularProgress size={50} />
        </div>
      )}
      {availableBikes && availableBikes.length === 0 && !isLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 60 }}
        >
          <h3>No Bikes available for above dates</h3>
        </div>
      )}
      {availableBikes && availableBikes.length && !isLoading ? (
        <>
          <Box style={{ display: "flex", gap: "20px", marginTop: 20 }}>
            <div style={{ marginTop: 20 }}>
              {" "}
              <h5>Filter By:</h5>{" "}
            </div>
            <MuiSelect
              data={filters.colors ? filters.colors : []}
              label={"Available Colors"}
              selected={appliedFilters.colors}
              multiSelect={true}
              onChange={(val) => {
                setAppliedFilters((pre) => ({ ...pre, colors: val }));
              }}
            />

            <MuiSelect
              data={filters.models ? filters.models : []}
              label={"Available Models"}
              selected={appliedFilters.models}
              multiSelect={true}
              onChange={(val) => {
                setAppliedFilters((pre) => ({ ...pre, models: val }));
              }}
            />
            <MuiSelect
              data={filters.locations ? filters.locations : []}
              label={"Available Locations"}
              selected={appliedFilters.locations}
              multiSelect={true}
              onChange={(val) => {
                setAppliedFilters((pre) => ({ ...pre, locations: val }));
              }}
            />
            <MuiSelect
              data={filters.ratings ? filters.ratings : []}
              label={"Rating"}
              selected={appliedFilters.rating}
              multiSelect={false}
              onChange={(val) => {
                setAppliedFilters((pre) => ({ ...pre, rating: val }));
              }}
            />
            {appliedFilters.colors.length ||
            appliedFilters.locations.length ||
            appliedFilters.models.length ||
            appliedFilters.rating !== "0" ? (
              <Button
                startIcon={<ClearIcon />}
                onClick={() => {
                  setAppliedFilters({
                    colors: [],
                    models: [],
                    locations: [],
                    rating: "0",
                  } as any);
                }}
              >
                Clear Filters
              </Button>
            ) : (
              ""
            )}
          </Box>
          <Grid
            container
            style={{
              justifyContent: "center",
              gap: "40px",
            }}
          >
            {!isLoading && filtered && filtered.length > 0
              ? filtered.map((bike, index) => {
                  return (
                    <Bike
                      key={index + bike.registrationId}
                      bike={bike}
                      onBookNow={() => onBookNow(bike)}
                    ></Bike>
                  );
                })
              : ""}
          </Grid>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};
