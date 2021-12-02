import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url, api_token } from "./keep";

function Signup() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [rpassword, setRpassword] = useState("");
  let [formMsgBool, setFormMsgBool] = useState(false);
  let [formMsg, setFormMsg] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    checkLog();
  });

  const checkLog = async () => {
    localStorage.setItem("mjk_email", null);
    localStorage.setItem("mjk_token", null);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (email === "" || password === "" || rpassword === "") {
      setFormMsgBool(true);
      setFormMsg("Fill All Fields");
      return;
    }

    if (password !== rpassword) {
      setFormMsgBool(true);
      setFormMsg("Password Mismatch");
      return;
    }

    setFormMsgBool(false);

    try {
      var response = await axios.post(
        `${api_url}users/register?api_token=${api_token}`,
        {
          email: email,
          password: password,
        }
      );

      if (response.data.status) {
        localStorage.setItem("mjk_token", response.data.data.token);
        localStorage.setItem("mjk_email", response.data.data.email);
        navigate("/process");
      } else {
        setFormMsgBool(true);
        setFormMsg(response.data.data);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  let fm;
  if (formMsgBool) {
    fm = <p style={{ color: "red" }}>{formMsg}</p>;
  } else {
    fm = "";
  }

  return (
    <div className="row mt-5">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body row">
            <div className="col-md-12">
              <h5 className="card-title">Sign Up</h5>
              <form>
                {fm}

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Repeat Password</label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setRpassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-success"
                    onClick={(e) => submitForm(e)}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
