import "../style/register.css";
import "../index.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const Login = ({ isAuthSetter, currentUserSetter, isAdminSetter }) => {
  const [userLogin, setUserlogin] = useState("");
  const [userPassword, setUserpassword] = useState("");
  const [displayError, setDisplayError] = useState("");
  const [sendFetch, setSendFetch] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSendFetch(true);
  };

  const onUserLoginChange = (e) => {
    setUserlogin(e.target.value);
  };
  const onUserPasswordChange = (e) => {
    setUserpassword(e.target.value);
  };

  useEffect(() => {
    const abortCont = new AbortController();
    async function fetchUser() {
      if (sendFetch) {
        setDisplayError("");
        const formData = new FormData();
        var isOrnot = false;
        formData.append("userLogin", userLogin);
        formData.append("userPassword", userPassword);

        function fetchUserv2() {
          return fetch(
            "/api/login",

            {
              method: "POST",
              body: formData,
              signal: abortCont.signal,
            }
          )
            .then((res) => {
              if (!res.ok) {
                return res.text().then((text) => {
                  throw new Error(text);
                });
              } else {
                isAuthSetter(true);
                return res.json();
              }
            })
            .then((data) => {
              return data;
            })
            .catch((err) => {
              if (err.name === "AbortError") {
                console.log("fetch aborted");
              } else {
                setSendFetch(false);
                setDisplayError(err.message.toString());
              }
            });
        }
        fetchUserv2().then((value) => {
          if (value) {
            console.log(value);
            currentUserSetter(value);
            if (value.userIsAdmin) {
              isAdminSetter(true);
            }
            Cookies.set("user", value.userLogin);
            navigate("/");
          }
        });
        // const data = await response.json();

        // console.log(data);
        // return data;
      }
    }
    fetchUser();
  }, [sendFetch]);

  return (
    <>
      <div id="register_container">
        <div id="register_box">
          <div className="register_fill" />
          <div id="register_main">
            <div id="register_desc">Logowanie</div>
            <hr></hr>
            <form id="register_form">
              <input
                type="text"
                name="userLogin"
                id="user_login"
                className="register_input"
                placeholder="Login"
                onChange={(e) => onUserLoginChange(e)}
              ></input>
              <input
                type="password"
                name="userPassword"
                id="user_password"
                className="register_input"
                placeholder="Hasło"
                onChange={(e) => onUserPasswordChange(e)}
              ></input>
              <div id="error_box">{displayError}</div>
              <input
                type="submit"
                className="register_button"
                value="Zaloguj"
                onClick={(e) => handleSubmit(e)}
              ></input>
            </form>
          </div>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <div id="register_link">Rejestracja</div>
          </Link>
          <div className="register_fill" />
        </div>
      </div>
    </>
  );
};

export default Login;
