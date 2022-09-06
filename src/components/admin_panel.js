import React, { useState, useEffect, useRef } from "react";
import "../style/admin_panel.css";
import "../style/account.css";
import "../index.css";
import { categories, colors, sizes } from "../data/data";
import { useNavigate } from "react-router-dom";
import cross from "../images/close.png";
import confirm from "../images/check-mark.png";
import arrow from "../images/down-arrow.png";
const AdminPanel = () => {
  const [menuNavigation, setMenuNavigation] = useState(0);
  const [displayError, setDisplayError] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [image, setImage] = useState([]);
  const [ims, setIms] = useState([]);
  const [itemTitle, setItemTitle] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemUnderType, setItemUnderType] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [pickedCategory, setPickedCategory] = useState(categories[0].name);

  const [itemsCount, setItemsCount] = useState(15);
  const [pickedUnderCategory, setPickedUnderCategory] = useState(
    categories[0].under_categories[0].name
  );
  const [ordersCount, setOrdersCount] = useState(3);
  const [currentGetIndex, setCurrentGetIndex] = useState(0);
  const [maxUsers, setMaxUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [actualUsers, setActualUsers] = useState(0);

  const [currentGetOrderIndex, setCurrentGetOrderIndex] = useState(0);
  const [maxOrders, setMaxOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [actualOrders, setActualOrders] = useState(0);

  const [currentGetOrderIndexHistory, setCurrentGetOrderIndexHistory] =
    useState(0);
  const [maxOrdersHistory, setMaxOrdersHistory] = useState(0);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [actualOrdersHistory, setActualOrdersHistory] = useState(0);

  const isFirstRender = useRef(true);
  const [rightClick, setRightClick] = useState(true);

  const [xsActive, setXsActive] = useState(false);
  const [sActive, setSActive] = useState(false);
  const [mActive, setMActive] = useState(false);
  const [lActive, setLActive] = useState(false);
  const [xlActive, setXlActive] = useState(false);

  const [redActive, setRedActive] = useState(false);
  const [violetActive, setVioletActive] = useState(false);
  const [blueActive, setBlueActive] = useState(false);
  const [greenActive, setGreenActive] = useState(false);
  const [orangeActive, setOrangeActive] = useState(false);
  const [yellowActive, setYellowActive] = useState(false);
  const [blackActive, setBlackActive] = useState(false);
  const [greyActive, setGreyActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    var itemSizes = [];

    if (xsActive) itemSizes.push("XS");
    if (sActive) itemSizes.push("S");
    if (mActive) itemSizes.push("M");
    if (lActive) itemSizes.push("L");
    if (xlActive) itemSizes.push("XL");

    var itemColors = [];

    if (redActive) itemColors.push("Czerwony");
    if (violetActive) itemColors.push("Fioletowy");
    if (blueActive) itemColors.push("Niebieski");
    if (greenActive) itemColors.push("Zielony");
    if (orangeActive) itemColors.push("Pomarańczowy");
    if (yellowActive) itemColors.push("Żółty");
    if (blackActive) itemColors.push("Czarny");
    if (greyActive) itemColors.push("Szary");

    const formData = new FormData();
    for (let i = 0; i < image.length; i++) {
      formData.append("images", image[i]);
    }
    for (let i = 0; i < itemSizes.length; i++) {
      formData.append("itemSizes", itemSizes[i]);
    }
    for (let i = 0; i < itemColors.length; i++) {
      formData.append("itemColors", itemColors[i]);
    }
    console.log(itemTitle);
    formData.append("itemDescription", itemDescription);
    formData.append("itemTitle", itemTitle);
    formData.append("itemType", pickedCategory);
    formData.append("itemUnderType", pickedUnderCategory);
    formData.append("itemPrice", itemPrice);

    fetch("/api/uploadmultiple", {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        setDisplayError("Dodano pomyślnie!");
        return res.json();
      })
      .catch((err) => {
        console.log(err.message.toString());
        setDisplayError(err.message.toString());
      });
  };
  const changeImage = (e) => {
    setDisplayError("");
    if (e.target.files.length > 16) {
      setDisplayError("Możesz wybrać maksymalnie 8 zdjęć!");

      return;
    }
    console.log("zmieniam");
    var arrsims = [];
    console.log(e.target.files.length);
    var arrs = [];
    for (let i = 0; i < e.target.files.length; i++) {
      arrs.push(e.target.files[i]);
      arrsims.push(URL.createObjectURL(e.target.files[i]));
    }
    console.log(arrs);
    setImage(arrs);
    setIms(arrsims);
    // console.log(image);
  };
  const onTitleChange = (e) => {
    setItemTitle(e.target.value);
  };
  const onPriceChange = (e) => {
    setItemPrice(e.target.value);
  };

  const onClickHandlerNavigation = (nav) => {
    console.log(nav);
    if (menuNavigation === nav) {
      setDisplayError("");
      setMenuNavigation(0);
    } else {
      setDisplayError("");
      setMenuNavigation(nav);
    }
  };
  const setPickedCategoryHandler = async (e) => {
    setPickedCategory(e.target.value);
    const oneit = await categories.find(
      (element) => element.name === e.target.value
    );
    setPickedUnderCategory(oneit.under_categories[0].name);
  };
  const getUsers = () => {
    console.log("/api/getusers/" + currentGetIndex + "/" + itemsCount);
    fetch("/api/getusers/" + currentGetIndex + "/" + itemsCount)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // setActualUsers(data.length);

        return setUsers([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };
  const getUsersv2 = (value) => {
    console.log("/api/getusers/" + currentGetIndex + "/" + itemsCount);
    console.log(
      "/api/getusers/" + (currentGetIndex + value) + "/" + itemsCount
    );
    fetch("/api/getusers/" + (currentGetIndex + value) + "/" + itemsCount)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setCurrentGetIndex((prevState) => {
          return prevState + value;
        });
        return setUsers([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const getMaxUsers = () => {
    fetch("/api/getmaxusers")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        return setMaxUsers(data.length);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };
  const onDeleteHandler = (user) => {
    fetch("/api/deleteuser/" + user._id, {
      method: "DELETE",
    })
      .then((res) => {
        getUsers();
        getMaxUsers();
        return res.json();
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };
  const onLeftClickHandler = () => {
    setRightClick(false);
    setActualUsers((prevState) => {
      return prevState - users.length;
    });
    getUsersv2(-15);
  };
  const onRightClickHandler = () => {
    setRightClick(true);
    getUsersv2(15);
  };

  /////////////////////////
  ////ORDER SECTION///////
  ////////////////////////

  const onLeftClickHandlerOrders = () => {
    setRightClick(false);
    // setActualOrders((prevState) => {
    //   return prevState - orders.length;
    // });
    getOrdersv2(-3);
  };
  const onRightClickHandlerOrders = () => {
    setRightClick(true);
    getOrdersv2(3);
  };

  const getMaxOrders = () => {
    fetch("/api/getmaxorders")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        return setMaxOrders(data.length);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const getOrders = () => {
    console.log("/api/getorders/" + currentGetOrderIndex + "/" + ordersCount);
    fetch("/api/getorders/" + currentGetOrderIndex + "/" + ordersCount)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setActualOrders((prevState) => {
          return prevState + data.length;
        });
        return setOrders([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };
  const getOrdersv2 = (value) => {
    console.log("/api/getorders/" + currentGetOrderIndex + "/" + ordersCount);
    fetch(
      "/api/getorders/" + (currentGetOrderIndex + value) + "/" + ordersCount
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setCurrentGetOrderIndex((prevState) => {
          return prevState + value;
        });
        setActualOrders((prevState) => {
          if (value > 0) return prevState + data.length;
          else return prevState - orders.length;
        });
        return setOrders([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const justGetOrders = () => {
    fetch("/api/getorders/" + currentGetOrderIndex + "/" + ordersCount)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // setMaxOrders((prevState)=>{
        //   return prevState - 1;
        // })
        // setCurrentGetOrderIndex()
        console.log(data);
        if (currentGetOrderIndex > 0) {
          if (data.length < 1) {
            setCurrentGetOrderIndex((prevState) => {
              return prevState - 3;
            });
            return justGetOrders();
          }
        }
        setActualOrders(currentGetOrderIndex + data.length);
        return setOrders([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const setStatusHandler = (e, order) => {
    let stringStatus;
    if (typeof e === "string") {
      stringStatus = e;
    } else {
      stringStatus = e.target.value.toString();
    }
    console.log(order._id);

    fetch("/api/setstatus?status=" + stringStatus + "&itemide=" + order._id, {
      method: "PATCH",
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        getMaxOrders();
        return justGetOrders();
      })
      .catch((err) => {
        return err.message();
      });
  };

  ////////////////////////////////
  ////ORDER HISTORY SECTION///////
  ////////////////////////////////

  const onLeftClickHandlerOrdersHistory = () => {
    setRightClick(false);
    // setActualOrders((prevState) => {
    //   return prevState - orders.length;
    // });
    getOrdersHistoryv2(-3);
  };
  const onRightClickHandlerOrdersHistory = () => {
    setRightClick(true);
    getOrdersHistoryv2(3);
  };

  const getMaxOrdersHistory = () => {
    fetch("/api/getmaxordershistory")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        return setMaxOrdersHistory(data.length);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const getOrdersHistory = () => {
    console.log(
      "/api/getordershistory/" + currentGetOrderIndexHistory + "/" + ordersCount
    );
    fetch(
      "/api/getordershistory/" + currentGetOrderIndexHistory + "/" + ordersCount
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setActualOrdersHistory((prevState) => {
          return prevState + data.length;
        });
        return setOrdersHistory([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };
  const getOrdersHistoryv2 = (value) => {
    fetch(
      "/api/getordershistory/" +
        (currentGetOrderIndexHistory + value) +
        "/" +
        ordersCount
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setCurrentGetOrderIndexHistory((prevState) => {
          return prevState + value;
        });
        setActualOrdersHistory((prevState) => {
          if (value > 0) return prevState + data.length;
          else return prevState - ordersHistory.length;
        });
        return setOrdersHistory([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const justGetOrdersHistory = () => {
    fetch(
      "/api/getordershistory/" + currentGetOrderIndexHistory + "/" + ordersCount
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (currentGetOrderIndexHistory > 0) {
          if (data.length < 1) {
            setCurrentGetOrderIndexHistory((prevState) => {
              return prevState - 3;
            });
            return justGetOrdersHistory();
          }
        }
        setActualOrdersHistory(currentGetOrderIndexHistory + data.length);
        return setOrdersHistory([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const pickSize = (_size) => {
    if (_size === "XS") {
      setXsActive(!xsActive);
    } else if (_size === "S") {
      setSActive(!sActive);
    } else if (_size === "M") {
      setMActive(!mActive);
    } else if (_size === "L") {
      setLActive(!lActive);
    } else if (_size === "XL") {
      setXlActive(!xlActive);
    }
  };
  const pickColor = (_color) => {
    if (_color === "red") {
      setRedActive(!redActive);
    }
    if (_color === "violet") {
      setVioletActive(!violetActive);
    }
    if (_color === "blue") {
      setBlueActive(!blueActive);
    }
    if (_color === "green") {
      setGreenActive(!greenActive);
    }
    if (_color === "yellow") {
      setYellowActive(!yellowActive);
    }
    if (_color === "orange") {
      setOrangeActive(!orangeActive);
    }
    if (_color === "black") {
      setBlackActive(!blackActive);
    }
    if (_color === "grey") {
      setGreyActive(!greyActive);
    }
  };
  useEffect(() => {
    if (isFirstRender.current) {
      console.log("first useEffect");
      getUsers();
      getMaxUsers();
      getOrders();
      getMaxOrders();
      getOrdersHistory();
      getMaxOrdersHistory();
      isFirstRender.current = false; // toggle flag after first render/mounting
      return;
    }
    if (rightClick) {
      console.log("right");
      console.log(actualOrders);
      setActualUsers((prevState) => {
        return prevState + users.length;
      });

      // setActualOrders((prevState) => {
      //   return prevState + orders.length;
      // });
    }
    // } else {
    //   console.log("left");
    //   console.log(actualUsers);
    // }

    console.log("useEffect");
  }, [users]);

  return (
    <>
      <div id="account_container">
        <div id="account_menu_choice">
          <ul>
            <li onClick={() => onClickHandlerNavigation(1)}>
              <button className="account_choice_button"> Zamówienia</button>
            </li>
            <li onClick={() => onClickHandlerNavigation(2)}>
              <button className="account_choice_button">
                {" "}
                Historia zamówień
              </button>
            </li>
            <li onClick={() => onClickHandlerNavigation(3)}>
              <button className="account_choice_button"> Dodaj rzecz</button>
            </li>
            <li onClick={() => onClickHandlerNavigation(4)}>
              <button className="account_choice_button"> Użytkownicy</button>
            </li>
          </ul>
        </div>

        {menuNavigation === 1 && (
          <div id="order_main_box">
            <h1>Zamówienia</h1>
            <hr></hr>
            <div id="box_for_orders">
              {orders.map((order) => {
                return (
                  <div key={order._id} className="order_grid_container">
                    <div
                      className="order_button_confirm"
                      onClick={() => setStatusHandler("Zrealizowane", order)}
                    >
                      <img
                        src={confirm}
                        alt=""
                        className="admin_panel_cross"
                      ></img>
                    </div>
                    <div className="order_grid">
                      <div className="single_order order-1">{order._id}</div>
                      <div className="single_order order-2">
                        {order.orderUserLogin}
                      </div>
                      <div className="single_order order-date">
                        {order.orderDate.substr(0, 10)}
                      </div>
                      <div className="single_order order-3">
                        <select
                          className="input_select_orders"
                          id="form_category_index"
                          onChange={(e) => setStatusHandler(e, order)}
                        >
                          {order.orderStatus === "W oczekiwaniu" && (
                            <option selected="selected" value="W oczekiwaniu">
                              W oczekiwaniu
                            </option>
                          )}
                          {order.orderStatus !== "W oczekiwaniu" && (
                            <option value="W oczekiwaniu">W oczekiwaniu</option>
                          )}
                          {order.orderStatus === "Zapakowane" && (
                            <option selected="selected" value="Zapakowane">
                              Zapakowane
                            </option>
                          )}
                          {order.orderStatus !== "Zapakowane" && (
                            <option value="Zapakowane">Zapakowane</option>
                          )}
                          {order.orderStatus === "Wysłane" && (
                            <option selected="selected" value="Wysłane">
                              Wysłane
                            </option>
                          )}
                          {order.orderStatus !== "Wysłane" && (
                            <option value="Wysłane">Wysłane</option>
                          )}
                          {order.orderStatus === "Zwrot" && (
                            <option selected="selected" value="Zwrot">
                              Zwrot
                            </option>
                          )}
                          {order.orderStatus !== "Zwrot" && (
                            <option value="Zwrot">Zwrot</option>
                          )}
                        </select>
                      </div>
                      <div className="single_order order-4">
                        {order.orderName}
                      </div>
                      <div className="single_order order-5">
                        {order.orderSurname}
                      </div>
                      <div className="single_order order-6">
                        {order.orderStreet}
                      </div>
                      <div className="single_order order-7">
                        {order.orderHomenumber}
                      </div>
                      <div className="single_order order-8">
                        {order.orderApartnumber}
                      </div>
                      <div className="single_order order-9">
                        {order.orderTown}
                      </div>
                      <div className="single_order order-10">
                        {order.orderPostcode}
                      </div>
                      <div className="single_order order-11">
                        <div className="single_order order-x">
                          <div className="order_single_item ord-1">
                            Id przedmiotu
                          </div>
                          <div className="order_single_item ord-2">Nazwa</div>
                          <div className="order_single_item ord-3">Ilość</div>
                          <div className="order_single_item ord-3">Rozmiar</div>
                          <div className="order_single_item ord-3">Kolor</div>
                        </div>
                        {order.orderItems.map((item) => {
                          return (
                            <div
                              key={item._id}
                              className="single_order order-x"
                            >
                              <div className="order_single_item ord-1">
                                {item.itemId}
                              </div>
                              <div className="order_single_item ord-2">
                                {item.itemName}
                              </div>
                              <div className="order_single_item ord-3">
                                {item.itemQuantity}
                              </div>
                              <div className="order_single_item ord-3">
                                {item.itemSize}
                              </div>
                              <div className="order_single_item ord-3">
                                {item.itemColor}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div id="admin_panel_users_nav">
                {actualOrders < 4 && (
                  <div className="admin_panel_users_nav_buttons_blocked">
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_left"
                    ></img>
                  </div>
                )}
                {actualOrders > 3 && (
                  <div
                    className="admin_panel_users_nav_buttons"
                    onClick={() => onLeftClickHandlerOrders()}
                  >
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_left"
                    ></img>
                  </div>
                )}
                <div id="admin_panel_users_input">
                  {actualOrders} / {maxOrders}
                </div>
                {actualOrders !== maxOrders && (
                  <div
                    className="admin_panel_users_nav_buttons"
                    onClick={() => onRightClickHandlerOrders()}
                  >
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_right"
                    ></img>
                  </div>
                )}
                {actualOrders === maxOrders && (
                  <div className="admin_panel_users_nav_buttons_blocked">
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_right"
                    ></img>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {menuNavigation === 2 && (
          <div id="order_main_box">
            <h1>Zamówienia</h1>
            <hr></hr>
            <div id="box_for_orders">
              {ordersHistory.map((order) => {
                return (
                  <div key={order._id} className="order_grid_container">
                    <div className="order_grid">
                      <div className="single_order order-1">{order._id}</div>
                      <div className="single_order order-date">
                        {order.orderDate.substr(0, 10)}
                      </div>
                      <div className="single_order order-2">
                        {order.orderUserLogin}
                      </div>
                      <div className="single_order order-3">Zrealizowano</div>
                      <div className="single_order order-4">
                        {order.orderName}
                      </div>
                      <div className="single_order order-5">
                        {order.orderSurname}
                      </div>
                      <div className="single_order order-6">
                        {order.orderStreet}
                      </div>
                      <div className="single_order order-7">
                        {order.orderHomenumber}
                      </div>
                      <div className="single_order order-8">
                        {order.orderApartnumber}
                      </div>
                      <div className="single_order order-9">
                        {order.orderTown}
                      </div>
                      <div className="single_order order-10">
                        {order.orderPostcode}
                      </div>
                      <div className="single_order order-11">
                        <div className="single_order order-x">
                          <div className="order_single_item ord-1">
                            Id przedmiotu
                          </div>
                          <div className="order_single_item ord-2">Nazwa</div>
                          <div className="order_single_item ord-3">Ilość</div>
                          <div className="order_single_item ord-3">Rozmiar</div>
                          <div className="order_single_item ord-3">Kolor</div>
                        </div>
                        {order.orderItems.map((item) => {
                          return (
                            <div
                              key={item._id}
                              className="single_order order-x"
                            >
                              <div className="order_single_item ord-1">
                                {item.itemId}
                              </div>
                              <div className="order_single_item ord-2">
                                {item.itemName}
                              </div>
                              <div className="order_single_item ord-3">
                                {item.itemQuantity}
                              </div>
                              <div className="order_single_item ord-3">
                                {item.itemSize}
                              </div>
                              <div className="order_single_item ord-3">
                                {item.itemColor}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div id="admin_panel_users_nav">
                {actualOrdersHistory < 4 && (
                  <div className="admin_panel_users_nav_buttons_blocked">
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_left"
                    ></img>
                  </div>
                )}
                {actualOrdersHistory > 3 && (
                  <div
                    className="admin_panel_users_nav_buttons"
                    onClick={() => onLeftClickHandlerOrdersHistory()}
                  >
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_left"
                    ></img>
                  </div>
                )}
                <div id="admin_panel_users_input">
                  {actualOrdersHistory} / {maxOrdersHistory}
                </div>
                {actualOrdersHistory !== maxOrdersHistory && (
                  <div
                    className="admin_panel_users_nav_buttons"
                    onClick={() => onRightClickHandlerOrdersHistory()}
                  >
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_right"
                    ></img>
                  </div>
                )}
                {actualOrdersHistory === maxOrdersHistory && (
                  <div className="admin_panel_users_nav_buttons_blocked">
                    <img
                      src={arrow}
                      alt=""
                      className="admin_panel_arrow"
                      id="admin_panel_arrow_right"
                    ></img>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {menuNavigation === 3 && (
          <div id="main_additem_box">
            <div className="add_item">
              <h2>Dodaj rzecz</h2>
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="add_item_form"
              >
                {/* <form action="/uploadmultiple" encType="multipart/form-data" className="add_item_form" method="POST"> */}
                <div className="row_form">
                  <label htmlFor="formFile" className="form_styling">
                    <input
                      onChange={(e) => changeImage(e)}
                      type="file"
                      className="form-control"
                      name="images"
                      id="formFile"
                      multiple
                    ></input>
                    Wybierz zdjęcia
                  </label>
                  {image.length === 0 && (
                    <div id="form_file_many">Max 16 zdjęć</div>
                  )}
                  {image.length > 0 && (
                    <div id="form_file_many">Wybrano zdjęć: {image.length}</div>
                  )}
                </div>
                <div className="row_form">
                  <label htmlFor="form_title" className="label_for_text">
                    Tytuł aukcji *
                  </label>
                  <input
                    onChange={(e) => onTitleChange(e)}
                    type="text"
                    className="input_text"
                    name="itemTitle"
                    id="form_title"
                  ></input>
                </div>
                <div className="row_form">
                  <label htmlFor="form_category" className="label_for_text">
                    Kategoria *
                  </label>
                  <select
                    className="input_select"
                    id="form_category"
                    onChange={(e) => setPickedCategoryHandler(e)}
                  >
                    {categories.map((category, index) => {
                      return (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="row_form">
                  <label htmlFor="form_undertype" className="label_for_text">
                    Podkategoria *
                  </label>
                  <select
                    className="input_select"
                    id="form_undertype"
                    onChange={(e) => setPickedUnderCategory(e.target.value)}
                  >
                    <option value="-">-</option>
                    {pickedCategory &&
                      categories.map((category) => {
                        if (pickedCategory === category.name) {
                          return category.under_categories.map(
                            (under_category) => {
                              return (
                                <option
                                  key={under_category.id}
                                  value={under_category.name}
                                >
                                  {under_category.name}
                                </option>
                              );
                            }
                          );
                        }
                      })}
                  </select>
                  {/* <input
                  onChange={(e) => onUnderTypeChange(e)}
                  type="text"
                  className="input_text"
                  name="itemUnderType"
                  id="form_undertype"
                ></input> */}
                </div>
                <div className="row_form">
                  <span className="label_for_text">Rozmiary *</span>

                  <div
                    className={xsActive ? "pick_option2" : "pick_option"}
                    onClick={(e) => pickSize("XS")}
                  >
                    XS
                  </div>
                  <div
                    className={sActive ? "pick_option2" : "pick_option"}
                    onClick={(e) => pickSize("S")}
                  >
                    S
                  </div>
                  <div
                    className={mActive ? "pick_option2" : "pick_option"}
                    onClick={(e) => pickSize("M")}
                  >
                    M
                  </div>
                  <div
                    className={lActive ? "pick_option2" : "pick_option"}
                    onClick={(e) => pickSize("L")}
                  >
                    L
                  </div>
                  <div
                    className={xlActive ? "pick_option2" : "pick_option"}
                    onClick={(e) => pickSize("XL")}
                  >
                    XL
                  </div>
                </div>
                <div className="row_form2">
                  <span className="label_for_text">Kolory *</span>
                  <div className="color_box">
                    <div
                      className={redActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("red")}
                    >
                      Czerwony
                    </div>
                    <div
                      className={violetActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("violet")}
                    >
                      Fioletowy
                    </div>
                    <div
                      className={blueActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("blue")}
                    >
                      Niebieski
                    </div>
                    <div
                      className={greenActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("green")}
                    >
                      Zielony
                    </div>
                    <div
                      className={yellowActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("yellow")}
                    >
                      Żółty
                    </div>
                    <div
                      className={orangeActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("orange")}
                    >
                      Pomarańczowy
                    </div>
                    <div
                      className={blackActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("black")}
                    >
                      Czarny
                    </div>
                    <div
                      className={greyActive ? "pick_option2" : "pick_option"}
                      onClick={(e) => pickColor("grey")}
                    >
                      Szary
                    </div>
                  </div>
                </div>
                <div className="row_form">
                  <label htmlFor="form_price" className="label_for_text">
                    Cena(zł) *
                  </label>
                  <input
                    onChange={(e) => onPriceChange(e)}
                    type="text"
                    className="input_text"
                    name="itemPrice"
                    id="form_price"
                  ></input>
                </div>
                <div className="row_form_long">
                  <label htmlFor="form_price" className="label_for_text">
                    Opis *
                  </label>
                  <textarea
                    onChange={(e) => setItemDescription(e.target.value)}
                    type="text"
                    className="input_text_long"
                    name="itemPrice"
                    id="form_price"
                  ></textarea>
                </div>
                <div id="admin_error_field">{displayError}</div>
                <div className="row_form">
                  <input
                    type="submit"
                    className="button_warning"
                    value="Dodaj rzecz"
                  ></input>
                </div>
              </form>
            </div>
            <div className="image_list">
              {ims.map((image, index) => {
                return (
                  <div key={index} className="single_image_show">
                    <img src={image} alt="" className="image_getted"></img>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {menuNavigation === 4 && (
          <div id="admin_panel_users_container">
            <h2>Użytkownicy</h2>
            <hr></hr>
            {users.map((user) => {
              return (
                <div key={user._id} className="admin_panel_users_user">
                  <div className="admin_panel_users_info_row">
                    <span>{user.userLogin}</span>{" "}
                  </div>
                  <div className="admin_panel_users_info_row">
                    <span>{user.userEmail}</span>{" "}
                  </div>
                  <div className="admin_panel_users_button_row">
                    <div
                      className="admin_panel_button_delete"
                      onClick={() => onDeleteHandler(user)}
                    >
                      <img
                        src={cross}
                        alt=""
                        className="admin_panel_cross"
                      ></img>
                    </div>
                  </div>
                </div>
              );
            })}

            <div id="admin_panel_users_nav">
              {actualUsers < 16 && (
                <div className="admin_panel_users_nav_buttons_blocked">
                  <img
                    src={arrow}
                    alt=""
                    className="admin_panel_arrow"
                    id="admin_panel_arrow_left"
                  ></img>
                </div>
              )}
              {actualUsers > 15 && (
                <div
                  className="admin_panel_users_nav_buttons"
                  onClick={() => onLeftClickHandler()}
                >
                  <img
                    src={arrow}
                    alt=""
                    className="admin_panel_arrow"
                    id="admin_panel_arrow_left"
                  ></img>
                </div>
              )}
              <div id="admin_panel_users_input">
                {actualUsers} / {maxUsers}
              </div>
              {actualUsers !== maxUsers && (
                <div
                  className="admin_panel_users_nav_buttons"
                  onClick={() => onRightClickHandler()}
                >
                  <img
                    src={arrow}
                    alt=""
                    className="admin_panel_arrow"
                    id="admin_panel_arrow_right"
                  ></img>
                </div>
              )}
              {actualUsers === maxUsers && (
                <div className="admin_panel_users_nav_buttons_blocked">
                  <img
                    src={arrow}
                    alt=""
                    className="admin_panel_arrow"
                    id="admin_panel_arrow_right"
                  ></img>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default AdminPanel;
