import React, { useState, useEffect, useCallback } from "react";
import ReactDom from "react-dom";
import "./index.css";
import AddNewItem from "./components/add_new_item";
import ShowItems from "./components/show_items";
import EditItem from "./components/edit_item";
import CategoriesBox from "./components/categories_box";
import Header from "./components/header";
import Register from "./components/register";
import { categories, ItemCart } from "./data/data";
import Login from "./components/login";
import SingleItem from "./components/single_item";
import Footer from "./components/footer";
// import CartRealise from "./components/cart_realise";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import Account from "./components/account";
import Cart from "./components/cart";
import AdminPanel from "./components/admin_panel";

function App() {
  // const server_url = "http://localhost:4000"
  const [pathToDisplay, setItemsToDisplay] = useState("xaxo");
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [activeItem, setActiveItem] = useState();
  const [menuNav, setMenuNav] = useState(0);
  const [dispErr, setDispErr] = useState("");
  const [searchField, setSearchField] = useState("");
  const [searchTap, setSearchTap] = useState(false);
  const [isLoading, setIsLoading] = useState(0);

  const [currentCart, setCurrentCart] = useState([]);

  const ProtectedRoute = ({ child }) => {
    console.log("rendered");
    return isAuth ? child : <Navigate to="/strona_glowna" />;
  };

  const getCookie = async () => {
    const user = Cookies.get("user");
    console.log(user);
    if (user) {
      const formData = new FormData();
      formData.append("userLogin", user);
      fetch("http://localhost:4000/api/getcurrentuser", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setCurrentUser(data);
          setIsAuth(true);
          setIsAdmin(data.userIsAdmin);
        });
    }
  };
  const Belt = () => {
    return (
      <>
        {!isAuth && (
          <div className="belt">
            <span style={{ margin: "0 5px" }}>Status:</span>
            <span style={{ textDecoration: "underline" }}>niezalogowany</span>
          </div>
        )}
        {isAuth && (
          <div className="belt">
            <span style={{ margin: "0 5px" }}>Status:</span>
            <span style={{ textDecoration: "underline" }}>zalogowany</span>
          </div>
        )}
      </>
    );
  };
  const DefaultComp = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate("/strona_glowna");
    });
    return <></>;
  };
  const wrapperSetCurrentCart = useCallback(
    (val) => {
      setCurrentCart(val);
    },
    [setCurrentCart]
  );
  const wrapperSetSearchTap = useCallback(
    (val) => {
      setSearchTap(val);
    },
    [setSearchTap]
  );
  const wrapperSetIsLoading = useCallback(
    (val) => {
      setIsLoading(val);
    },
    [setIsLoading]
  );
  const wrapperSetSearchField = useCallback(
    (val) => {
      setSearchField(val);
    },
    [setSearchField]
  );
  const wrapperSetIsAdmin = useCallback(
    (val) => {
      setIsAdmin(val);
    },
    [setIsAdmin]
  );
  const wrapperSetDispErr = useCallback(
    (val) => {
      setDispErr(val);
    },
    [setDispErr]
  );
  const wrapperSetActiveItem = useCallback(
    (val) => {
      setActiveItem(val);
    },
    [setActiveItem]
  );
  const wrapperSetMenuNav = useCallback(
    (val) => {
      setMenuNav(val);
    },
    [setMenuNav]
  );
  const wrapperSetCurrentUser = useCallback(
    (val) => {
      setCurrentUser(val);
    },
    [setCurrentUser]
  );

  const wrapperSetIsAuthState = useCallback(
    (val) => {
      setIsAuth(val);
    },
    [setIsAuth]
  );

  const wrapperSetParentState = useCallback(
    (val) => {
      setItemsToDisplay(val);
    },
    [setItemsToDisplay]
  );
  useEffect(() => {
    getCookie();
  }, []);
  return (
    <Router>
      <div className="div_box">
        <Belt />
        <Header
          currentUser={currentUser}
          isAuth={isAuth}
          setIsAuth={wrapperSetIsAuthState}
          setCurrentUser={wrapperSetCurrentUser}
          searchField={searchField}
          setSearchField={wrapperSetSearchField}
          setSearchTap={wrapperSetSearchTap}
          setIsLoading={wrapperSetIsLoading}
          setIsAdmin={wrapperSetIsAdmin}
          isAdmin={isAdmin}
        />
        <CategoriesBox
          pathToDisplay={pathToDisplay}
          pathToDisplaySetter={wrapperSetParentState}
          setIsLoading={wrapperSetIsLoading}
        />
        {/* <SingleItem /> */}
        <Routes>
          <Route exact path="/" element={<DefaultComp></DefaultComp>} />
          <Route
            path="/strona_glowna"
            element={
              <ShowItems
                setActiveItem={wrapperSetActiveItem}
                activeItem={activeItem}
                searchField={searchField}
                setSearchField={wrapperSetSearchField}
                searchTap={searchTap}
                setSearchTap={wrapperSetSearchTap}
                isLoading={isLoading}
                setIsLoading={wrapperSetIsLoading}
                isAdmin={isAdmin}
                currentUser={currentUser}
                isAuth={isAuth}
              />
            }
          />
          {!isAuth && (
            <Route
              exact
              path="/login"
              element={
                <Login
                  isAuth={isAuth}
                  isAuthSetter={wrapperSetIsAuthState}
                  currentUser={currentUser}
                  currentUserSetter={wrapperSetCurrentUser}
                  isAdmin={isAdmin}
                  isAdminSetter={wrapperSetIsAdmin}
                />
              }
            />
          )}
          <Route exact path="/register" element={<Register />} />
          <Route
            exact
            path="/item"
            element={
              <SingleItem
                activeItem={activeItem}
                isAuth={isAuth}
                setActiveItem={wrapperSetActiveItem}
                currentUser={currentUser}
                currentCart={currentCart}
                setCurrentCart={wrapperSetCurrentCart}
              />
            }
          />
          {isAuth && (
            <Route
              path="/account"
              element={
                <Account
                  currentUser={currentUser}
                  setCurrentUser={wrapperSetCurrentUser}
                  setIsAuth={wrapperSetIsAuthState}
                  menuNav={menuNav}
                  setMenuNav={wrapperSetMenuNav}
                  dispErr={dispErr}
                  setDispErr={wrapperSetDispErr}
                />
              }
            />
          )}
          {!isAuth && (
            <Route path="/account" element={<Navigate to="/"></Navigate>} />
          )}

          <Route
            path="/cart"
            element={
              <Cart
                currentUser={currentUser}
                setCurrentUser={wrapperSetCurrentUser}
                setActiveItem={wrapperSetActiveItem}
                setMenuNav={wrapperSetMenuNav}
                setDispErr={wrapperSetDispErr}
                isAuth={isAuth}
              />
            }
          />

          {/* {!isAuth && (
            <Route
              exact
              path="/cart"
              element={<Navigate to="/login"></Navigate>}
            />
          )} */}
          {currentUser.userIsAdmin && (
            <Route exact path="/admin_panel" element={<AdminPanel />} />
          )}
          {!currentUser.userIsAdmin && (
            <Route
              exact
              path="/admin_panel"
              element={<Navigate to="/login"></Navigate>}
            />
          )}
          {currentUser.userIsAdmin && (
            <Route
              exact
              path="/edit_item"
              element={
                <EditItem
                  activeItem={activeItem}
                  isAuth={isAuth}
                  setActiveItem={wrapperSetActiveItem}
                  currentUser={currentUser}
                />
              }
            />
          )}
          {/* <Route exact path="/cart_realise" element={<CartRealise />} /> */}
          <Route path="*" element={<Navigate to="/"></Navigate>} />
          {/* <Register />
          <ShowItems />
          <AddNewItem />
          <Items /> */}
        </Routes>
      </div>
      <Footer />
      <div
        style={{
          width: "100%",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#5e4242",
          color: "white",
          overflow: "hidden",
        }}
      >
        Zrealizował Adam Dziedziński
      </div>
    </Router>
  );
}

ReactDom.render(<App />, document.getElementById("root"));
