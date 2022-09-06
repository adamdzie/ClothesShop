import React, { useState, useEffect } from "react";
import "../style/account.css";
import "../index.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Account = ({
  currentUser,
  setCurrentUser,
  setIsAuth,
  menuNav,
  setMenuNav,
  dispErr,
  setDispErr,
}) => {
  const [menuNavigation, setMenuNavigation] = useState(menuNav);
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
  const [displayError, setDisplayError] = useState(dispErr);
  const [userPasswordDelete, setUserPasswordDelete] = useState("");

  var [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const onClickHandlerNavigation = (nav) => {
    if (menuNavigation === nav) {
      setDisplayError("");
      setMenuNavigation(0);
    } else {
      setDisplayError("");
      setMenuNavigation(nav);
    }
  };
  const onClickHandlerEditLogin = () => {
    if (isLoading) {
      const formData = new FormData();
      formData.append("userId", currentUser._id);
      formData.append("userLogin", userLogin);
      formData.append("userPassword", userPassword);
      formData.append("userPasswordrepeat", userPasswordrepeat);
      formData.append("userEmail", userEmail);

      console.log(userLogin);
      console.log(userPassword);
      console.log(userPasswordrepeat);
      console.log(userEmail);
      fetch("/api/accountlog", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(text);
            });
          }
          return res.json();
        })
        .then((user) => {
          setCurrentUser(user, () => {
            console.log(currentUser);
            putDataLog();
          });
          setDisplayError("Pomyślnie edytowano dane!");

          return user;
        })
        .catch((err) => {
          console.log(err.message.toString());
          setDisplayError(err.message.toString());
        });

      console.log("fetch is done");
      isLoading = false;
    }
  };
  const onClickHandlerEditPersonal = () => {
    if (isLoading) {
      const formData = new FormData();
      formData.append("userId", currentUser._id);
      formData.append("userName", userName);
      formData.append("userSurname", userSurname);
      formData.append("userStreet", userStreet);
      formData.append("userHomenumber", userHomenumber);
      formData.append("userApartnumber", userApartnumber);
      formData.append("userTown", userTown);
      formData.append("userPostcode", userPostcode);

      console.log(userName);
      console.log(userSurname);

      fetch("/api/account", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(text);
            });
          }
          return res.json();
        })
        .then((user) => {
          setCurrentUser(user, () => {
            console.log(currentUser);
            putDataInside();
          });

          //   navigate("/account");
          setDisplayError("Pomyślnie edytowano dane!");
          return user;
        })
        .catch((err) => {
          console.log(err.message.toString());
          setDisplayError(err.message.toString());
        });
      console.log("fetch is done");
      isLoading = false;
    }
  };
  const onClickHandlerDeleteAccount = () => {
    if (isLoading) {
      const formData = new FormData();
      formData.append("userId", currentUser._id);
      formData.append("userPassword", userPasswordDelete);

      fetch("/api/accountdelete", {
        method: "DELETE",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(text);
            });
          }
          Cookies.remove("user");
          setIsAuth(false);
          setCurrentUser("");
          navigate("/");
          return res.json();
        })

        .catch((err) => {
          console.log(err.message.toString());
          setDisplayError(err.message.toString());
        });
      console.log("fetch is done");

      isLoading = false;
    }
  };

  const putDataLog = () => {
    setUserLogin(currentUser.userLogin);
    // setUserPassword(currentUser.userPassword);
    setUserEmail(currentUser.userEmail);
  };
  const putDataInside = () => {
    setUserName(currentUser.userName);
    setUserSurname(currentUser.userSurname);
    setUserStreet(currentUser.userStreet);
    setUserHomenumber(currentUser.userHomenumber);
    setUserApartnumber(currentUser.userApartnumber);
    setUserTown(currentUser.userTown);
    setUserPostcode(currentUser.userPostcode);
  };
  const setUserLoginHandler = (e) => {
    setUserLogin(e.target.value);
  };
  const setUserPasswordHandler = (e) => {
    setUserPasswordHandler(e.target.value);
  };
  const setUserPasswordrepeatHandler = (e) => {
    setUserPasswordrepeat(e.target.value);
  };
  const setUserEmailHandler = (e) => {
    setUserEmail(e.target.value);
  };
  useEffect(() => {
    setMenuNav(0);
    setDispErr("");
    // setMenuNavigation(menuNav);
  }, [currentUser]);
  return (
    <>
      <div id="account_container">
        <div id="account_menu_choice">
          <ul>
            <li onClick={() => onClickHandlerNavigation(1)}>
              <button className="account_choice_button"> Dane osobowe</button>
            </li>
            <li onClick={() => onClickHandlerNavigation(2)}>
              <button className="account_choice_button"> Dane logowania</button>
            </li>
            <li onClick={() => onClickHandlerNavigation(4)}>
              <button className="account_choice_button"> Usuń konto</button>
            </li>
          </ul>
        </div>
        {menuNavigation === 1 && (
          <div id="account_main_container">
            <div className="account_slide_box">
              <h1>Dane osobowe</h1>
              <hr></hr>
              <div className="account_edit_fields">
                <div className="account_field1">Imię</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userName}
                    onChange={(e) => setUserName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Nazwisko</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userSurname}
                    onChange={(e) => setUserSurname(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Ulica</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userStreet}
                    onChange={(e) => setUserStreet(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Nr domu</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userHomenumber}
                    onChange={(e) => setUserHomenumber(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Nr mieszkania</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userApartnumber}
                    onChange={(e) => setUserApartnumber(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Miasto</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userTown}
                    onChange={(e) => setUserTown(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Kod pocztowy</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userPostcode}
                    onChange={(e) => setUserPostcode(e.target.value)}
                  ></input>
                </div>
              </div>
              <div id="account_error_field">{displayError}</div>
              <button
                type="button"
                id="account_button_edit"
                onClick={onClickHandlerEditPersonal}
              >
                Edytuj
              </button>
            </div>
          </div>
        )}
        {menuNavigation === 2 && (
          <div id="account_main_container">
            <div className="account_slide_box">
              <h1>Dane logowania</h1>
              <hr></hr>
              <div className="account_edit_fields">
                <div className="account_field1">Login</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userLogin}
                    onChange={(e) => setUserLoginHandler(e)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Hasło</div>
                <div className="account_field2">
                  <input
                    type="password"
                    className="account_input_field"
                    onChange={(e) => setUserPassword(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">Powtórz hasło</div>
                <div className="account_field2">
                  <input
                    type="password"
                    className="account_input_field"
                    onChange={(e) => setUserPasswordrepeat(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="account_edit_fields">
                <div className="account_field1">E-mail</div>
                <div className="account_field2">
                  <input
                    type="text"
                    className="account_input_field"
                    placeholder={currentUser.userEmail}
                    onChange={(e) => setUserEmailHandler(e)}
                  ></input>
                </div>
              </div>

              <div id="account_error_field">{displayError}</div>
              <button
                type="button"
                id="account_button_edit"
                onClick={onClickHandlerEditLogin}
              >
                Edytuj
              </button>
            </div>
          </div>
        )}
        {menuNavigation === 4 && (
          <div className="account_slide_box">
            <h1>Usuwanie konta</h1>
            <hr></hr>
            <div className="account_edit_fields">
              <div className="account_field1">Wpisz hasło</div>
              <div className="account_field2">
                <input
                  type="password"
                  className="account_input_field"
                  placeholder="Hasło"
                  onChange={(e) => setUserPasswordDelete(e.target.value)}
                ></input>
              </div>
            </div>
            <div id="account_error_field">{displayError}</div>
            <button
              type="button"
              id="account_button_edit"
              onClick={onClickHandlerDeleteAccount}
            >
              Usuń konto
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default Account;
