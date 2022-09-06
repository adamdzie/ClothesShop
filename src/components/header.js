import "../style/header.css";
import "../index.css";
import "../style/categories_box.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import User_icon from "../images/account.png";
import Cart from "../images/shopping-cart.png";

import Admin from "../images/admin.png";
const Header = ({
  currentUser,
  isAuth,
  setIsAuth,
  setCurrentUser,
  searchField,
  setSearchField,
  setSearchTap,
  setIsLoading,
  setIsAdmin,
  isAdmin,
}) => {
  const navigate = useNavigate();

  const onSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };
  const onSearchTap = () => {
    console.log(searchField);
    if (searchField === "") {
      return;
    }
    // console.log("clicked");
    setSearchTap(true);
    // console.log(window.location.search);
    // console.log(
    //   window.location.pathname +
    //     window.location.search +
    //     "&search=" +
    //     searchField
    // );
    // const search_pat = window.location.search;
    // console.log(search_pat.search("\\?") > -1);
    setIsLoading(1);
    navigate(window.location.pathname + "?search=" + searchField);
    // if (search_pat.search("\\?") > -1) {
    //   setIsLoading(1);
    //   navigate(window.location.pathname + "?search=" + searchField);
    // if (search_pat.search("search") > -1) {
    //   let start_index = search_pat.indexOf("search");
    //   console.log(start_index);
    //   let new_pat = search_pat.slice(0, start_index);
    //   console.log(new_pat);
    //   setIsLoading(1);
    //   navigate(window.location.pathname + new_pat + "search=" + searchField);
    // } else {
    //   setIsLoading(1);
    //   navigate(
    //     window.location.pathname +
    //       window.location.search +
    //       "&search=" +
    //       searchField
    //   );
    // }
    // } else {
    //   setIsLoading(1);
    //   navigate(window.location.pathname + "?search=" + searchField);
    // }
  };

  const onClickLogoutHandler = () => {
    console.log("jestem tutej");
    if (isAuth) {
      Cookies.remove("user");
      setIsAuth(false);
      setIsAdmin(false);
      setCurrentUser("");

      fetch("/api/logout", {
        method: "POST",
      }).then((res) => {
        console.log("hej hej");
        navigate("/strona_glowna");
      });
    }
  };

  return (
    <div id="header">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="bg_image">AD'S SHOP</div>
      </Link>
      <div className="search_bar">
        <div id="search_form_box">
          <form className="form_styled" id="search_form">
            <input
              type="text"
              className="input_style"
              placeholder="Szukaj"
              onChange={(e) => onSearchFieldChange(e)}
            />
          </form>
        </div>

        <div id="button_search_box">
          <button
            type="button"
            form="search_form"
            id="button_search"
            onClick={onSearchTap}
          />
        </div>
      </div>
      <div className="login_box">
        {isAdmin && (
          <Link to="/admin_panel" style={{ textDecoration: "none" }}>
            <div className="login_box_icon">
              <img src={Admin} alt=""></img>
            </div>
          </Link>
        )}
        {isAuth && (
          <Link to="/account" style={{ textDecoration: "none" }}>
            <div className="login_box_icon">
              <img src={User_icon} alt=""></img>
              <div className="login_box_img_absolute"></div>
              <div
                className="login_box_dropdown"
                onClick={() => onClickLogoutHandler()}
              >
                <div>Wyloguj</div>
              </div>
            </div>
          </Link>
        )}
        {!isAuth && (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <div className="login_box_icon">
              <img src={User_icon} alt=""></img>
              <div className="login_box_img_absolute_no"></div>
            </div>
          </Link>
        )}

        <Link to="/cart" style={{ textDecoration: "none" }}>
          <div className="login_box_icon">
            <img src={Cart} alt=""></img>
          </div>
        </Link>

        {/* <div className="filler_icon_bar">
          <div id="account_box">
            <div className="text">
              {isAuth && (
                <Link to="/account" style={{ textDecoration: "none" }}>
                  <span className="arrows">˅</span> Konto
                </Link>
              )}
              {!isAuth && (
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <span className="arrows">˅</span> Konto
                </Link>
              )}
              {!isAuth && (
                <div className="dropdown_menu">
                  <ul>
                    <li>
                      <Link to="/login" style={{ textDecoration: "none" }}>
                        <button type="button" className="a_buttons">
                          Zaloguj
                        </button>
                      </Link>
                    </li>

                    <li>
                      <Link to="/register" style={{ textDecoration: "none" }}>
                        <button type="button" className="a_buttons">
                          Zarejestruj
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              {isAuth && (
                <div className="dropdown_menu">
                  <ul>
                    <li>
                      <Link to="/account" style={{ textDecoration: "none" }}>
                        <button type="button" className="a_buttons">
                          Dane użytkownika
                        </button>
                      </Link>
                    </li>
                    {currentUser.userIsAdmin && (
                      <li>
                        <Link
                          to="/admin_panel"
                          style={{ textDecoration: "none" }}
                        >
                          <button type="button" className="a_buttons">
                            Panel administratora
                          </button>
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        className="a_buttons"
                        onClick={() => onClickLogoutHandler()}
                      >
                        Wyloguj
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {!isAuth && (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <div className="icon_box">
                <div
                  id="button_header_3"
                  className="button_header"
                  href="#cart"
                ></div>
              </div>
            </Link>
          )}
          {isAuth && (
            <Link to="/cart" style={{ textDecoration: "none" }}>
              <div className="icon_box">
                <div
                  id="button_header_3"
                  className="button_header"
                  href="#cart"
                ></div>
              </div>
            </Link>
          )}
        </div>
        {currentUser && (
          <div id="your_name_box" className="text1">
            Witaj <span>{currentUser.userName + "!"}</span>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Header;
