import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "react-bootstrap/Spinner";

const SECRET_KEY_FOR_MANAGERS = "iammanager";
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [person, setPerson] = useState({
    name: "",
    email: "",
    fatherName: "",
    isManager: false,
    age: 0,
    password: "",
  });
  const [secretKey, setSecretKey] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();
  const usersCollectionRef = collection(db, "users");

  const handleSubmit = async (e: any) => {
    setLoading(true);
    const { isManager, email, name, fatherName, age, password } = person;
    e.preventDefault();
    setError("");
    try {
      if (isManager && secretKey !== SECRET_KEY_FOR_MANAGERS) {
        setError("Wrong Secret Key for Manager");
        setLoading(false);
        return;
      }
      const res = await signUp(email, password);
      await setDoc(doc(usersCollectionRef, email.toLocaleLowerCase()), {
        name,
        email: email.toLocaleLowerCase(),
        isManager,
        fatherName,
        age,
        id: res.user.uid,
      });
      setLoading(false);
      navigate("/");
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 card shadow-lg p-3 mb-5 bg-white rounded">
        <h2 className="mb-3">Signup</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Control
              required
              type="text"
              placeholder="Full Name"
              onChange={(e) =>
                setPerson((pre) => {
                  return { ...pre, name: e.target.value };
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicFatherName">
            <Form.Control
              required
              type="text"
              placeholder="Father Name"
              onChange={(e) =>
                setPerson((pre) => {
                  return { ...pre, fatherName: e.target.value };
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAge">
            <Form.Control
              required
              type="number"
              placeholder="Age"
              onChange={(e) =>
                setPerson((pre: any) => {
                  return { ...pre, age: e.target.value };
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              required
              type="email"
              placeholder="Email address"
              onChange={(e) =>
                setPerson((pre) => {
                  return { ...pre, email: e.target.value };
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              required
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setPerson((pre) => {
                  return { ...pre, password: e.target.value };
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              style={{ textAlign: "left" }}
              checked={person.isManager}
              type="checkbox"
              label="I am a Manager"
              onChange={(e) =>
                setPerson((pre: any) => {
                  return { ...pre, isManager: !pre.isManager };
                })
              }
            />
          </Form.Group>
          {person.isManager && (
            <Form.Group className="mb-3" controlId="formBasicSecretKey">
              <Form.Control
                type="text"
                placeholder="Secret Key for Manager"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </Form.Group>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Sign up
            </Button>
          </div>
          <div style={{ color: "#0c75ff", marginTop: 10 }}>
            {loading && <Spinner animation="border" />}
          </div>
          <div className="mt-4 text-center">
            Already have an account? <Link to="/">Log In</Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Signup;
