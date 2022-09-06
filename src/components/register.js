import "../style/register.css";
import "../index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordrepeat, setUserPasswordrepeat] = useState("");
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userStreet, setUserStreet] = useState("");
  const [userHomenumber, setUserHomenumber] = useState("");
  const [userApartnumber, setUserApartnumber] = useState("");
  const [userTown, setUserTown] = useState("");
  const [userPostcode, setUserPostcode] = useState("");
  const [displayError, setDisplayError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("userLogin", userLogin);
    formData.append("userPassword", userPassword);
    formData.append("userPasswordrepeat", userPasswordrepeat);
    formData.append("userEmail", userEmail);
    formData.append("userName", userName);
    formData.append("userSurname", userSurname);
    formData.append("userStreet", userStreet);
    formData.append("userHomenumber", userHomenumber);
    formData.append("userApartnumber", userApartnumber);
    formData.append("userTown", userTown);
    formData.append("userPostcode", userPostcode);

    fetch("http://localhost:4000/api/signup", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }

        navigate("/login");
      })
      .then((message) => {
        return message;
      })
      .catch((err) => {
        console.log(err.message.toString());
        setDisplayError(err.message.toString());
      });
  };
  const onUserLoginChange = (e) => {
    setUserLogin(e.target.value);
  };
  const onUserEmailChange = (e) => {
    setUserEmail(e.target.value);
  };
  const onUserPasswordChange = (e) => {
    setUserPassword(e.target.value);
  };
  const onUserPasswordRepeatChange = (e) => {
    setUserPasswordrepeat(e.target.value);
  };
  const onUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const onUserSurnameChange = (e) => {
    setUserSurname(e.target.value);
  };
  const onUserStreetChange = (e) => {
    setUserStreet(e.target.value);
  };
  const onUserHomenumberChange = (e) => {
    setUserHomenumber(e.target.value);
  };
  const onUserApartnumberChange = (e) => {
    setUserApartnumber(e.target.value);
  };
  const onUserTownChange = (e) => {
    setUserTown(e.target.value);
  };
  const onUserPostcodeChange = (e) => {
    setUserPostcode(e.target.value);
  };
  return (
    <>
      <div id="register_container">
        <div id="register_box">
          <div className="register_fill" />
          <div id="register_main">
            <div id="register_desc">Rejestracja</div>
            <hr></hr>
            <form id="register_form">
              <div className="register_desc">Dane logowania</div>

              <input
                type="text"
                name="userLogin"
                id="user_login"
                className="register_input"
                placeholder="Login *"
                onChange={(e) => onUserLoginChange(e)}
              ></input>
              <input
                type="password"
                name="userPassword"
                id="user_password"
                className="register_input"
                placeholder="Hasło *"
                onChange={(e) => onUserPasswordChange(e)}
              ></input>
              <input
                type="password"
                name="userPasswordRepeat"
                id="user_password_repeat"
                className="register_input"
                placeholder="Powtórz hasło *"
                onChange={(e) => onUserPasswordRepeatChange(e)}
              ></input>
              <input
                type="text"
                name="userEmail"
                id="user_e-mail"
                className="register_input"
                placeholder="E-mail *"
                onChange={(e) => onUserEmailChange(e)}
              ></input>
              <hr></hr>
              <div className="register_desc">Dane osobowe</div>
              <input
                type="text"
                name="userName"
                id="user_name"
                className="register_input"
                placeholder="Imię"
                onChange={(e) => onUserNameChange(e)}
              ></input>
              <input
                type="text"
                name="userSurname"
                id="user_surname"
                className="register_input"
                placeholder="Nazwisko"
                onChange={(e) => onUserSurnameChange(e)}
              ></input>

              <input
                type="text"
                name="userStreet"
                id="user_street"
                className="register_input"
                placeholder="Ulica"
                onChange={(e) => onUserStreetChange(e)}
              ></input>
              <div className="register_double_box">
                <input
                  type="text"
                  name="userHomenumber"
                  id="user_homenumber"
                  className="register_input_2"
                  placeholder="Nr domu"
                  onChange={(e) => onUserHomenumberChange(e)}
                ></input>
                <input
                  type="text"
                  name="userFlatnumber"
                  id="user_flatnumber"
                  className="register_input_2"
                  placeholder="Nr mieszkania"
                  onChange={(e) => onUserApartnumberChange(e)}
                ></input>
              </div>
              <input
                type="text"
                name="userTown"
                id="user_town"
                className="register_input"
                placeholder="Miasto"
                onChange={(e) => onUserTownChange(e)}
              ></input>
              <input
                type="text"
                name="userPostcode"
                id="user_postcode"
                className="register_input"
                placeholder="Kod pocztowy"
                onChange={(e) => onUserPostcodeChange(e)}
              ></input>
              <div id="register_display_error">{displayError}</div>
              <input
                type="submit"
                className="register_button"
                value="Zarejestruj"
                onClick={(e) => handleSubmit(e)}
              ></input>
            </form>
          </div>
          <div className="register_fill" />
        </div>
      </div>
    </>
  );
};

export default Register;
