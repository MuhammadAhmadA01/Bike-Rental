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
import { useUserAuth } from "../../context/UserAuthContext";
import { db } from "../../firebase";
interface IDialogProps {
  yesLabel: string;
  noLabel: string;
  yesClicked: any;
  noClicked: any;
  information: string;
  open: boolean;
  onClose: any;
  title: string;
  isUpdate: boolean;
  user: any;
}
export default function AddNewUser(props: any) {
  const { open, title, isUpdate, user, onClose } = props;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [person, setPerson] = useState({
    name: user ? user.name : "",
    fatherName: user ? user.fatherName : "",
    isManager: user ? user.isManager : false,
    age: user ? user.age : "",
    email: user ? user.email : "",
    password: "",
  });
  const [state, dispatch]: any = useAppState();
  const usersCollectionRef = collection(db, "users");
  const { signUpWithoutSigningIn, user: currentUser } = useUserAuth();

  const handleUpdateUser = () => {
    setLoading(true);
    const userDoc = doc(db, "users", user.email);
    const { email, password, ...updatedObj } = person;
    const u = isUpdate ? updatedObj : person;
    try {
      updateDoc(userDoc, { ...u }).then(() => {
        setRefreshList(true);
      });
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };
  const handleCreateUser = async (e: any) => {
    setLoading(true);
    const { isManager, email, name, fatherName, age, password } = person;
    e.preventDefault();
    setError("");
    try {
      const res = await signUpWithoutSigningIn(email, password);
      await setDoc(doc(usersCollectionRef, email.toLocaleLowerCase()), {
        name,
        email: email.toLocaleLowerCase(),
        isManager,
        fatherName,
        age,
        id: res.user.uid,
      });
      setLoading(false);

      setRefreshList(true);
    } catch (err: any) {
      setLoading(false);

      setError(err.message);
    }
  };

  useEffect(() => {
    if (refreshList) {
      const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        if (data.docs) setLoading(false);
        dispatch({
          type: "SET_PROP",
          payload: {
            key: "allUsers",
            value: data.docs.map((doc: any) => ({ ...doc.data() })),
          },
        });
        setRefreshList(false);
        setLoading(false);
        onClose();
      };

      getUsers();
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
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={person.name}
                    onChange={(e) =>
                      setPerson((pre) => {
                        return { ...pre, name: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicFatherName">
                  <Form.Control
                    type="text"
                    placeholder="Father Name"
                    value={person.fatherName}
                    onChange={(e) =>
                      setPerson((pre) => {
                        return { ...pre, fatherName: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAge">
                  <Form.Control
                    type="number"
                    placeholder="Age"
                    value={person.age}
                    onChange={(e) =>
                      setPerson((pre: any) => {
                        return { ...pre, age: e.target.value };
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasiccEmail">
                  <Form.Control
                    name="random"
                    type="email"
                    value={person.email}
                    disabled={isUpdate}
                    readOnly={isUpdate}
                    placeholder="Email address"
                    onChange={(e) =>
                      setPerson((pre) => {
                        return { ...pre, email: e.target.value };
                      })
                    }
                  />
                </Form.Group>

                {!isUpdate && (
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={person.password}
                      onChange={(e) =>
                        setPerson((pre) => {
                          return { ...pre, password: e.target.value };
                        })
                      }
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    style={{ textAlign: "left" }}
                    checked={person.isManager}
                    type="checkbox"
                    label="Manager"
                    disabled={isUpdate && user.email === currentUser.email}
                    onChange={(e) =>
                      setPerson((pre: any) => {
                        return { ...pre, isManager: !pre.isManager };
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
                person.email.length &&
                person.age.length &&
                person.name.length &&
                person.fatherName.length
              ) ||
              (!isUpdate && person.password.length <= 0)
            }
            onClick={isUpdate ? handleUpdateUser : handleCreateUser}
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
