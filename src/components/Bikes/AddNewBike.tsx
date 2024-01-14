import { Button as MuiButton, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { useAppState } from "../../appContext";
import { db } from "../../firebase";
export default function AddNewBike(props: any) {
  const { open, title, isUpdate, _bike, onClose } = props;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [bike, setBike] = useState({
    color: _bike ? _bike.color : "",
    isAvailable: _bike ? _bike.isAvailable : false,
    location: _bike ? _bike.location : "",
    model: _bike ? _bike.model : "",
    rating: _bike ? +_bike.rating : "0",
    registrationId: _bike ? _bike.registrationId : "",
  });
  const [state, dispatch]: any = useAppState();
  const bikesCollectionRef = collection(db, "bikes");

  const handleUpdateBike = () => {
    setLoading(true);
    const bikeDoc = doc(db, "bikes", bike.registrationId);
    const { registrationId, ...updatedObj } = bike;
    const u = isUpdate ? updatedObj : bike;
    updateDoc(bikeDoc, { ...u }).then(() => {
      setRefreshList(true);
    });
  };
  const handleCreateBike = async (e: any) => {
    setLoading(true);
    const { color, isAvailable, location, model, rating, registrationId } =
      bike;
    e.preventDefault();
    setError("");
    try {
      await setDoc(doc(bikesCollectionRef, registrationId), {
        color,
        isAvailable,
        location,
        model,
        rating,
        registrationId,
        id: registrationId,
      });
      setRefreshList(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (refreshList) {
      const getBikes = async () => {
        const data = await getDocs(bikesCollectionRef);
        if (data.docs) setLoading(false);
        dispatch({
          type: "SET_PROP",
          payload: {
            key: "allBikes",
            value: data.docs.map((doc: any) => ({ ...doc.data() })),
          },
        });
        setRefreshList(false);
        setLoading(false);
        onClose();
      };

      getBikes();
    }
  }, [refreshList]);
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ width: "400px" }}>
          <>
            <div>
              <h2 className="mb-3">{title}</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form autoComplete={"off"}>
                <Form.Group className="mb-3" controlId="formBasicReg">
                  <Form.Control
                    type="text"
                    placeholder="Registration Id"
                    required
                    readOnly={isUpdate}
                    value={bike.registrationId}
                    onChange={(e) =>
                      setBike((pre) => {
                        return { ...pre, registrationId: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicColor">
                  <Form.Control
                    type="text"
                    placeholder="Color"
                    value={bike.color}
                    onChange={(e) =>
                      setBike((pre) => {
                        return { ...pre, color: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicModel">
                  <Form.Control
                    type="text"
                    placeholder="Model"
                    value={bike.model}
                    onChange={(e) =>
                      setBike((pre) => {
                        return { ...pre, model: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLocation">
                  <Form.Control
                    type="text"
                    placeholder="location"
                    value={bike.location}
                    onChange={(e) =>
                      setBike((pre) => {
                        return { ...pre, location: e.target.value };
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    style={{ textAlign: "left" }}
                    checked={bike.isAvailable}
                    type="checkbox"
                    label="Available"
                    onChange={(e) =>
                      setBike((pre: any) => {
                        return { ...pre, isAvailable: !pre.isAvailable };
                      })
                    }
                  />
                </Form.Group>
              </Form>
            </div>
          </>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={onClose}>{"Cancel"}</MuiButton>
          <MuiButton
            disabled={
              !(
                bike.color.length &&
                bike.model.length &&
                bike.location.length &&
                bike.registrationId.length
              )
            }
            onClick={isUpdate ? handleUpdateBike : handleCreateBike}
          >
            {isUpdate ? "Update" : "Create"}
          </MuiButton>
          {loading && (
            <CircularProgress style={{ height: "25px", width: "25px" }} />
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
