import { Box, CircularProgress, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Attribute, AttributeLabel, AttributeValue } from "../../Attribute";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import moment from "moment";
import { useAppState } from "../../../appContext";

interface IReservationProps {
  data: any;
}
const bikeAttributes = [
  { label: "Registration Id", field: "registrationId" },
  { label: "Model", field: "model" },
  { label: "Color", field: "color" },
];
const reservationAttributes = [
  { label: "Start Date", field: "startDate" },
  { label: "End Date", field: "endDate" },
  {
    label: "Duration",
    resolve: (item) => {
      return (
        moment(item.endDate).diff(moment(item.startDate), "days") +
        1 +
        " Day(s)"
      );
    },
  },
];
const Reservation = ({ data }) => {
  const [state]: any = useAppState();
  const filteredBike = state.allBikes.filter(
    (b) => b.registrationId === data.registrationId
  );
  const bike = filteredBike.length ? filteredBike[0] : null;

  return (
    <Paper style={{ marginTop: "10px" }}>
      {data.isActive && (
        <Box
          style={{
            justifyContent: "center",
            display: "flex",
            padding: "10px 0",
            background: "#dbe9db",
          }}
        >
          <div style={{ color: "green" }}>Active</div>
        </Box>
      )}
      <Box
        style={{ justifyContent: "center", display: "flex", padding: "10px 0" }}
      >
        <ReactStars size={24} edit={false} value={+data.rating} />
      </Box>
      <Box style={{ display: "flex" }}>
        <Box style={{ width: "50%", borderRight: "1px solid #efefef" }}>
          {bikeAttributes.map((u, i) => {
            return (
              <Attribute key={i}>
                <AttributeLabel>{u.label}</AttributeLabel>
                <AttributeValue>{bike[u.field]}</AttributeValue>
              </Attribute>
            );
          })}
        </Box>
        <Box>
          {reservationAttributes.map((r, i) => {
            return (
              <Attribute key={i}>
                <AttributeLabel>{r.label}</AttributeLabel>
                <AttributeValue>
                  {r.resolve ? r.resolve(data) : data[r.field]}
                </AttributeValue>
              </Attribute>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};
export const Reservations = (props: IReservationProps) => {
  const { data } = props;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const isActiveReservation = (endDate: string) => {
    return !moment(endDate).isBefore(moment(), "day");
  };
  useEffect(() => {
    const getReservations = async () => {
      setLoading(true);
      const q = query(
        collection(db, "reservations"),
        where("reservedBy", "==", data.email.toLowerCase())
      );

      const querySnapshot = await getDocs(q);
      const res = [] as any;
      querySnapshot.forEach((doc: any) => {
        const obj = { id: doc.id, ...doc.data() };
        res.push(obj);
      });
      setReservations(res);
      setLoading(false);
    };
    getReservations();
  }, []);
  const renderActiveReservations = () => {
    const active = reservations.filter((r: any) =>
      isActiveReservation(r.endDate)
    );
    if (active.length) {
      const _active = active.map((x: any) =>
        moment().isBetween(moment(x.startDate), moment(x.endDate), "days", "[]")
          ? { ...x, isActive: true }
          : x
      );

      return _active
        .sort((a: any) => (a.isActive ? -1 : 1))
        .map((res, i) => {
          return <Reservation key={i} data={res} />;
        });
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          No Active/Upcoming Reservations Found
        </div>
      );
    }
  };
  const renderPreviousReservations = () => {
    const pre = reservations.filter(
      (r: any) => !isActiveReservation(r.endDate)
    );
    if (pre.length) {
      return pre.map((res, i) => {
        return <Reservation key={i} data={res} />;
      });
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          No Previous Reservations Found
        </div>
      );
    }
  };
  return (
    <div>
      {loading ? (
        <CircularProgress style={{ marginLeft: "45%" }} />
      ) : (
        <>
          <h2>Active/Upcoming Reservations</h2>
          {renderActiveReservations()}
          <h2 style={{ marginTop: "30px" }}>Previous Reservations</h2>
          {renderPreviousReservations()}
        </>
      )}
    </div>
  );
};
