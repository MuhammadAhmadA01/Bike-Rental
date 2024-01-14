import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppState } from "../appContext";
import Spinner from "react-bootstrap/Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "users");
  const [state, dispatch]: any = useAppState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({
      type: "EMPTY_STATE",
    });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await logIn(email, password);
      const docRef = doc(usersCollectionRef, email.toLowerCase());
      const docSnap = await getDoc(docRef);

      const data = docSnap.exists() ? docSnap.data() : null;

      if (!(data === null || data === undefined)) {
        if (data.isDeleted) {
          setError("User does not exist anymore");
          return;
        }
        dispatch({
          type: "SET_PROP",
          payload: { key: "currentUser", value: data },
        });
        localStorage.setItem("role", data.isManager ? "manager" : "user");
        navigate(data.isManager ? "/admin" : "/user");
        setLoading(false);
      } else {
        setLoading(false);

        setError("Error: email not found");
      }
    } catch (err: any) {
      setLoading(false);

      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 card shadow-lg p-3 mb-5 bg-white rounded">
        <h2 className="mb-3"> Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              {"Log In"}
            </Button>
            <div style={{ color: "#0c75ff" }}>
              {loading && <Spinner animation="border" />}
            </div>
          </div>
        </Form>
        <hr />

        <div className="text-center mt-4">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
