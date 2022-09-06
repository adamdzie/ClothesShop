import "../style/cart.css";
import "../index.css";
import "../style/show_items.css";
import "../style/cart_realise.css";
import "../style/admin_panel.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import cross from "../images/close.png";
import cart from "../images/shopping-cart.png";
import { ItemCart } from "../data/data";

const Cart = ({
  currentUser,
  setCurrentUser,
  setActiveItem,
  setMenuNav,
  setDispErr,
  isAuth,
}) => {
  const [userCart, setUserCart] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(currentUser._id);
  const [displayError, setDisplayError] = useState("");
  const [navi, setNavi] = useState(0);
  const isFirstRender = useRef(true);
  const forceUpdate = React.useCallback(() => setUserCart({}), []);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [street, setStreet] = useState("");
  const [homenumber, setHomenumber] = useState("");
  const [apartnumber, setApartnumber] = useState("");
  const [town, setTown] = useState("");
  const [postcode, setPostcode] = useState("");
  const [email, setEmail] = useState("");
  const [buttonOff, setButtonOff] = useState(false);

  const navigate = useNavigate();
  console.log("render");

  const getCart = async () => {
    console.log("co do chuja");
    if (isAuth) {
      console.log("zalogowany");
      const formData = new FormData();
      formData.append("userId", currentUserId);

      fetch("/api/getcart", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUserCart(data);
          console.log(data);
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("FIREEE");
      let it = localStorage.getItem("currentCart");
      let _cart = JSON.parse(it);
      let localCart = [];
      if (!_cart) return;
      const formData = new FormData();
      console.log(_cart);
      // if (_cart.length > 1) {
      for (let i = 0; i < _cart.length; i++) {
        formData.append("itemIds", _cart[i]._userItemId);
      }
      // } else {
      //   formData.append("itemIds", _cart._userItemId);
      // }
      let temp = [];
      temp = await fetch("/api/get_local_cart", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          temp = data;
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
      for (let i = 0; i < _cart.length; i++) {
        let arr = [];
        for (let j = 0; j < temp.length; j++) {
          if (_cart[i]._userItemId === temp[j]._id) {
            arr.push(temp[j]);
          }
        }

        arr.push(_cart[i]._userItemQuantity);
        arr.push(_cart[i]._userItemSize);
        arr.push(_cart[i]._userItemColor);
        localCart.push(arr);
      }
      setUserCart(localCart);
    }
  };
  const getCartAfter = () => {
    const formData = new FormData();
    formData.append("userId", currentUserId);

    fetch("/api/getcart", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserCart([...data]);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDeleteHandler = async (itemId, itemSize, itemColor) => {
    if (isAuth) {
      console.log(userCart[0][2]);
      const formData = new FormData();
      formData.append("userId", currentUserId);
      formData.append("itemId", itemId);
      formData.append("itemSize", itemSize);
      formData.append("itemColor", itemColor);

      fetch("/api/delcartitem", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setCurrentUser(data);
          getCartAfter();
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let temp = userCart;
      for (let i = 0; i < userCart.length; i++) {
        if (
          itemId === userCart[i][0]._id &&
          itemSize === userCart[i][2] &&
          itemColor === userCart[i][3]
        )
          temp.splice(i, 1);
      }
      setUserCart([...temp]);
      let new_cart = JSON.parse(localStorage.getItem("currentCart"));
      for (let i = 0; i < new_cart.length; i++) {
        if (
          itemId === new_cart[i]._userItemId &&
          itemSize === new_cart[i]._userItemSize &&
          itemColor === new_cart[i]._userItemColor
        )
          new_cart.splice(i, 1);
      }
      localStorage.setItem("currentCart", JSON.stringify(new_cart));
    }
  };
  const countTotalSum = () => {
    console.log("invoked");

    var sum = 0;
    for (var i = 0; i < userCart.length; i++) {
      sum = userCart[i][1] * userCart[i][0].itemPrice + sum;
    }

    setTotalSum(sum);
  };
  const onClickHandlerNavToItem = (item) => {
    if (item) {
      setActiveItem(item);
      navigate("/item");
    } else throw Error("Nie ma tu żadnej rzeczy");
  };
  const onClickHandlerCreateNewOrder = () => {
    setDisplayError("");
    // setNavi(1);
    if (isAuth) {
      const formData = new FormData();
      console.log("siup");

      formData.append("orderUserId", currentUser._id);
      formData.append("orderSum", totalSum);
      formData.append("orderName", name);
      formData.append("orderSurname", surname);
      formData.append("orderStreet", street);
      formData.append("orderHomenumber", homenumber);
      formData.append("orderApartnumber", apartnumber);
      formData.append("orderTown", town);
      formData.append("orderPostcode", postcode);
      formData.append("orderEmail", email);

      for (let i = 0; i < userCart.length; i++) {
        console.log(userCart[i][0]._id);
        formData.append("orderItemIds", userCart[i][0]._id);
        formData.append("orderItemNames", userCart[i][0].itemTitle);
        formData.append("orderItemQuantities", userCart[i][1]);
        formData.append("orderItemSizes", userCart[i][2]);
        formData.append("orderItemColors", userCart[i][3]);
      }

      fetch("/api/createorder", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(text);
            });
          }
          setDisplayError("Zamówienie zostało złożone!");
          console.log("Udalo sie");
          return res.json();
        })
        .then((data) => {
          setUserCart([]);
          console.log(data);
          return setCurrentUser(data);
        })
        .catch((err) => {
          return err.message;
        });
    } else {
      const formData = new FormData();
      console.log(userCart[0]);
      formData.append("orderSum", totalSum);
      formData.append("orderName", name);
      formData.append("orderSurname", surname);
      formData.append("orderStreet", street);
      formData.append("orderHomenumber", homenumber);
      formData.append("orderApartnumber", apartnumber);
      formData.append("orderTown", town);
      formData.append("orderPostcode", postcode);
      formData.append("orderEmail", email);
      let totalArr = [];
      for (let i = 0; i < userCart.length; i++) {
        console.log(userCart[i][0]._id);
        formData.append("orderItemIds", userCart[i][0]._id);
        formData.append("orderItemNames", userCart[i][0].itemTitle);
        formData.append("orderItemQuantities", userCart[i][1]);
        formData.append("orderItemSizes", userCart[i][2]);
        formData.append("orderItemColors", userCart[i][3]);
      }

      fetch("/api/createorderoff", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(text);
            });
          }
          setDisplayError("Zamówienie zostało złożone!");
          localStorage.removeItem("currentCart");
          setButtonOff(true);
          return res.json();
        })
        .then((data) => {
          setUserCart([]);
          return data;
        })
        .catch((err) => {
          return err.message;
        });
    }
  };
  const handleNextPage = () => {
    let postCodeRegex = /^[0-9]{2}-[0-9]{3}/;
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (name === "") return setDisplayError("Pole imię nie może być puste!");
    if (surname === "")
      return setDisplayError("Pole nazwisko nie może być puste!");
    if (street === "") return setDisplayError("Pole ulica nie może być puste!");
    if (homenumber === "")
      return setDisplayError("Pole nr mieszkania nie może być puste!");
    if (town === "") return setDisplayError("Pole miasto nie może być puste!");
    if (postcode === "")
      return setDisplayError("Pole kod pocztowy nie może być puste!");
    if (email === "") return setDisplayError("Pole e-mail nie może być puste!");
    if (name.length > 20)
      return setDisplayError("Imię może posiadać maksymalnie 20 znaków!");

    if (surname.length > 20)
      return setDisplayError("Nazwisko może posiadać maksymalnie 20 znaków!");

    if (street.length > 25)
      return setDisplayError("Ulica może posiadać maksymalnie 25 znaków!");

    if (homenumber.length > 4)
      return setDisplayError("Numer domu może mieć maksymalnie 4 cyfry!");
    if (apartnumber.length > 4)
      return setDisplayError("Numer mieszkania może mieć maksymalnie 4 cyfry!");
    if (town.length > 20)
      return setDisplayError("Miasto może mieć maksymalnie 20 znaków!");
    if (postcode.length > 10)
      return setDisplayError(
        "Kod pocztowy może składać się maksymalnie z 10 znaków!"
      );
    if (!postcode.match(postCodeRegex)) {
      return setDisplayError("Nieprawidłowy kod pocztowy!");
    }
    if (!email.match(validRegex)) return setDisplayError("Niepoprawny E-mail!");
    setDisplayError("");
    setNavi(2);
  };
  const handleRealise = () => {
    if (userCart.length > 0) setNavi(1);
    else setDisplayError("Musisz dodać coś do koszyka!");
  };
  const setStartValues = () => {
    if (isAuth) {
      setName(currentUser.userName);
      setSurname(currentUser.userSurname);
      setStreet(currentUser.userStreet);
      setHomenumber(currentUser.userHomenumber);
      setApartnumber(currentUser.userApartnumber);
      setTown(currentUser.userTown);
      setPostcode(currentUser.userPostcode);
      setEmail(currentUser.userEmail);
    }
  };
  useEffect(() => {
    if (isFirstRender.current) {
      console.log("first useEffect");
      getCart();
      setStartValues();
      isFirstRender.current = false; // toggle flag after first render/mounting
      return;
    }
    // if(isLoading){

    //   setIsLoading(false);
    // }
    console.log(navi);
    countTotalSum();
  }, [userCart]);
  return (
    <>
      {navi === 0 && (
        <div id="user_cart_container">
          {userCart.length > 0 && (
            <div id="user_cart_items">
              {userCart.map((item, index) => {
                console.log("hop");
                return (
                  <div key={item[0]._id} className="user_cart_single_item">
                    <div
                      className="user_cart_image"
                      onClick={() => onClickHandlerNavToItem(item[0])}
                    >
                      <img
                        src={
                          "data:image/jpeg;base64, " +
                          item[0].itemImagesBase64[0]
                        }
                        className="show_items_imagesin"
                        alt=""
                      ></img>
                    </div>
                    <div className="user_cart_item_parameters">
                      <div className="user_cart_item_title">
                        {item[0].itemTitle}
                      </div>
                      <div className="user_cart_item_quantity">
                        Ilość: {item[1]}
                      </div>
                      <div className="user_cart_item_sum">
                        Suma: {item[1] * item[0].itemPrice}
                        {" zł"}
                      </div>
                    </div>
                    <div className="user_cart_delete">
                      <div
                        className="user_cart_button_delete"
                        onClick={() =>
                          onDeleteHandler(item[0]._id, item[2], item[3])
                        }
                      >
                        <img src={cross} alt=""></img>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {userCart.length < 1 && (
            <div id="user_cart_items_empty">Koszyk obecnie jest pusty...</div>
          )}
          <div id="user_cart_right_panel">
            <div className="user_cart_title_cart">
              <div className="user_cart_title_cart_under">
                <h1>Koszyk</h1>
              </div>
              <div className="user_cart_title_icon">
                <img src={cart} alt=""></img>
              </div>
            </div>

            <div id="user_cart_total_sum">
              Suma: {totalSum} {" zł"}
            </div>
            <div className="user_cart_display_error">{displayError}</div>
            <button type="button" id="user_cart_submit" onClick={handleRealise}>
              Zrealizuj
            </button>
          </div>
        </div>
      )}
      {navi === 1 && (
        <div id="cart_realise_main_box">
          <div id="cart_realise_inputs">
            <h2> Realizacja</h2>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Imię
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={name}
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Nazwisko
              </label>
              <input
                onChange={(e) => setSurname(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={surname}
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Ulica
              </label>
              <input
                onChange={(e) => setStreet(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={street}
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Nr domu
              </label>
              <input
                onChange={(e) => setHomenumber(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={homenumber}
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Nr mieszkania
              </label>
              <input
                onChange={(e) => setApartnumber(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={apartnumber}
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Miasto
              </label>
              <input
                onChange={(e) => setTown(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={town}
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Kod pocztowy
              </label>
              <input
                onChange={(e) => setPostcode(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={postcode}
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                E-mail
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="input_text"
                name="itemTitle"
                id="form_title"
                value={email}
              ></input>
            </div>
            <div className="user_cart_display_error">{displayError}</div>
            <div className="row_form">
              <input
                type="button"
                className="button_warning"
                value="Dalej"
                onClick={handleNextPage}
              ></input>
            </div>
          </div>
        </div>
      )}
      {navi === 2 && (
        <div id="cart_realise_main_box">
          <div id="cart_realise_prototype">
            <h2>Płatność</h2>
            <h2>Ten moduł nie jest zaimplementowany - to tylko prototyp!</h2>
            <div className="user_cart_display_error">{displayError}</div>
            <div className="row_form">
              {!buttonOff && (
                <input
                  type="button"
                  className="button_warning2"
                  value="Kupuję"
                  onClick={onClickHandlerCreateNewOrder}
                ></input>
              )}
              {buttonOff && (
                <input
                  type="button"
                  className="button_warning2_off"
                  value="Kupuję"
                ></input>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
