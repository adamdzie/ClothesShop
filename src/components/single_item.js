import React, { useState, useEffect } from "react";
import "../style/single_item.css";
import "../index.css";
import { ItemCart } from "../data/data";
import minus from "../images/minus.png";
import plus from "../images/plus.png";
const SingleItem = ({
  activeItem,
  isAuth,
  setActiveItem,
  currentUser,
  currentCart,
  setCurrentCart,
}) => {
  var [imageIndex, setImageIndex] = useState(0);
  var [itemQuantity, setItemQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [sss, setSss] = useState(1);
  const [displayError, setDisplayError] = useState("");

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

  const [sizesActive, setSizesActive] = useState([]);
  const [colorsActive, setColorsActive] = useState([]);

  const setSizesOperation = (activeItem_sizes, activeItem_colors) => {
    let arr = [false, false, false, false, false];

    for (let i = 0; i < activeItem_sizes.length; i++) {
      if (activeItem_sizes[i] === "XS") arr[0] = true;
      if (activeItem_sizes[i] === "S") arr[1] = true;
      if (activeItem_sizes[i] === "M") arr[2] = true;
      if (activeItem_sizes[i] === "L") arr[3] = true;
      if (activeItem_sizes[i] === "XL") arr[4] = true;
    }
    setSizesActive(arr);

    let arr2 = [false, false, false, false, false, false, false, false];

    for (let i = 0; i < activeItem_colors.length; i++) {
      if (activeItem_colors[i] === "Czerwony") arr2[0] = true;
      if (activeItem_colors[i] === "Fioletowy") arr2[1] = true;
      if (activeItem_colors[i] === "Niebieski") arr2[2] = true;
      if (activeItem_colors[i] === "Zielony") arr2[3] = true;
      if (activeItem_colors[i] === "Pomarańczowy") arr2[4] = true;
      if (activeItem_colors[i] === "Żółty") arr2[5] = true;
      if (activeItem_colors[i] === "Czarny") arr2[6] = true;
      if (activeItem_colors[i] === "Szary") arr2[7] = true;
    }

    setColorsActive(arr2);
  };

  const activeItemOperation = () => {
    if (!activeItem) {
      let it = localStorage.getItem("activeItem");
      let end = JSON.parse(it);
      setActiveItem(end);
      setSizesOperation(end.itemSizes, end.itemColors);
    } else {
      localStorage.setItem("activeItem", JSON.stringify(activeItem));
      setSizesOperation(activeItem.itemSizes, activeItem.itemColors);
    }
    setSss(0);
  };

  const onClickHandlerLeft = (e) => {
    e.persist();
    if (imageIndex === 0) {
      setImageIndex(activeItem.itemImagesBase64.length - 1);
    } else {
      setImageIndex((prevState) => {
        return prevState - 1;
      });
    }
  };
  const onClickHandlerRight = (e) => {
    e.persist();
    if (imageIndex === activeItem.itemImagesBase64.length - 1) {
      setImageIndex(0);
    } else {
      setImageIndex((prevState) => {
        return prevState + 1;
      });
    }
  };

  const onClickHandlerMinus = (e) => {
    if (itemQuantity === 0) return;
    else {
      setItemQuantity((prevState) => {
        return prevState - 1;
      });
      setTotalPrice((prevState) => {
        return prevState - activeItem.itemPrice;
      });
    }
  };
  const onClickHandlerPlus = (e) => {
    setItemQuantity((prevState) => {
      return prevState + 1;
    });
    setTotalPrice((prevState) => {
      return prevState + activeItem.itemPrice;
    });
  };
  const onQuantityChange = (e) => {
    setItemQuantity(parseInt(e.target.value, 10));
  };
  const onClickAddToCartHandler = () => {
    setDisplayError("");

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

    if (itemSizes.length < 1) return setDisplayError("Wybierz rozmiar!");
    if (itemColors.length < 1) return setDisplayError("Wybierz kolor!");

    if (isAuth) {
      const formData = new FormData();
      formData.append("userId", currentUser._id);
      formData.append("itemId", activeItem._id);
      formData.append("itemQuantity", itemQuantity);
      formData.append("itemColor", itemColors[0]);
      formData.append("itemSize", itemSizes[0]);

      fetch("/api/addtocart", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          setDisplayError("Dodano do koszyka!");
          return res.json();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let tempCart = currentCart;
      let isItemExist = false;
      let ii;
      for (let i = 0; i < tempCart.length; i++) {
        if (
          tempCart[i].userItemId === activeItem._id &&
          tempCart[i].userItemColor === itemColors[0] &&
          tempCart[i].userItemSize === itemSizes[0]
        ) {
          isItemExist = true;
          ii = i;
        }
      }

      if (isItemExist) {
        tempCart[ii].addQuantity(itemQuantity);
      } else {
        tempCart.push(
          new ItemCart(
            activeItem._id,
            itemQuantity,
            itemSizes[0],
            itemColors[0]
          )
        );
      }

      setCurrentCart([...tempCart]);
      localStorage.setItem("currentCart", JSON.stringify(tempCart));
      setDisplayError("Dodano do koszyka!");
    }
  };
  const setSizes = (_size) => {
    if (_size !== "XS" && xsActive) {
      setXsActive(false);
    }
    if (_size !== "S" && sActive) {
      setSActive(false);
    }
    if (_size !== "M" && mActive) {
      setMActive(false);
    }
    if (_size !== "L" && lActive) {
      setLActive(false);
    }
    if (_size !== "XL" && xlActive) {
      setXlActive(false);
    }

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

  const setColors = (_color) => {
    if (_color !== "red" && redActive) {
      setRedActive(false);
    }
    if (_color !== "violet" && violetActive) {
      setVioletActive(false);
    }

    if (_color !== "blue" && blueActive) {
      setBlueActive(false);
    }

    if (_color !== "green" && greenActive) {
      setGreenActive(false);
    }

    if (_color !== "orange" && orangeActive) {
      setOrangeActive(false);
    }

    if (_color !== "yellow" && yellowActive) {
      setYellowActive(false);
    }

    if (_color !== "black" && blackActive) {
      setBlackActive(false);
    }

    if (_color !== "grey" && greyActive) {
      setGreyActive(false);
    }

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
    activeItemOperation();
  }, []);

  return (
    <>
      <div id="single_item_container">
        {sss === 0 && (
          <div id="single_item_main_container">
            <div id="image_nav_container">
              {activeItem.itemImagesBase64.map((image, index) => {
                return (
                  <div
                    key={index}
                    className="image_navim"
                    onClick={() => setImageIndex(index)}
                  >
                    <img
                      src={"data:image/jpeg;base64, " + image}
                      className="show_items_imagesin"
                      alt=""
                    ></img>
                  </div>
                );
              })}

              {/* <div className="image_navim"></div>
            <div className="image_navim"></div>
            <div className="image_navim"></div>
            <div className="image_navim"></div>
            <div className="image_navim"></div>
            <div className="image_navim"></div> */}
            </div>
            <div id="image_container">
              <div className="image_between_filler">
                <div
                  className="image_arrow_change"
                  id="image_arrow_left"
                  onClick={(e) => onClickHandlerLeft(e)}
                ></div>
              </div>

              <div id="image_slider">
                <img
                  src={
                    "data:image/jpeg;base64, " +
                    activeItem.itemImagesBase64[imageIndex]
                  }
                  className="show_items_imagesin"
                  alt=""
                ></img>
              </div>
              <div className="image_between_filler">
                <div
                  className="image_arrow_change"
                  id="image_arrow_right"
                  onClick={(e) => onClickHandlerRight(e)}
                ></div>
              </div>
            </div>
            <div id="image_buy_section">
              <div id="image_title">{activeItem.itemTitle}</div>
              <hr></hr>
              <div id="item_price">
                <span>Suma: {totalPrice} zł</span>
              </div>
              <div id="item_quantity">
                <button
                  type="button"
                  className="plus_minus_button"
                  id="minus_button"
                  onClick={(e) => onClickHandlerMinus(e)}
                >
                  <img src={minus} alt="" className="plus_minus_image"></img>
                </button>
                <input
                  type="text"
                  id="item_quantity_input"
                  value={itemQuantity}
                  onChange={(e) => onQuantityChange(e)}
                ></input>

                <button
                  type="button"
                  className="plus_minus_button"
                  id="plus_button"
                  onClick={(e) => onClickHandlerPlus(e)}
                >
                  <img src={plus} alt="" className="plus_minus_image"></img>
                </button>
              </div>

              <div id="list_of_sizes">
                {sizesActive[0] && (
                  <div
                    className={xsActive ? "size_box2" : "size_box"}
                    onClick={() => setSizes("XS")}
                  >
                    XS
                  </div>
                )}
                {sizesActive[1] && (
                  <div
                    className={sActive ? "size_box2" : "size_box"}
                    onClick={() => setSizes("S")}
                  >
                    S
                  </div>
                )}
                {sizesActive[2] && (
                  <div
                    className={mActive ? "size_box2" : "size_box"}
                    onClick={() => setSizes("M")}
                  >
                    M
                  </div>
                )}
                {sizesActive[3] && (
                  <div
                    className={lActive ? "size_box2" : "size_box"}
                    onClick={() => setSizes("L")}
                  >
                    L
                  </div>
                )}
                {sizesActive[4] && (
                  <div
                    className={xlActive ? "size_box2" : "size_box"}
                    onClick={() => setSizes("XL")}
                  >
                    XL
                  </div>
                )}
              </div>
              <div id="list_of_colors">
                {colorsActive[0] && (
                  <div
                    className={
                      redActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("red")}
                  >
                    Czerwony
                  </div>
                )}
                {colorsActive[1] && (
                  <div
                    className={
                      violetActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("violet")}
                  >
                    Fioletowy
                  </div>
                )}
                {colorsActive[2] && (
                  <div
                    className={
                      blueActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("blue")}
                  >
                    Niebieski
                  </div>
                )}
                {colorsActive[3] && (
                  <div
                    className={
                      greenActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("green")}
                  >
                    Zielony
                  </div>
                )}
                {colorsActive[4] && (
                  <div
                    className={
                      orangeActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("orange")}
                  >
                    Pomarańczowy
                  </div>
                )}
                {colorsActive[5] && (
                  <div
                    className={
                      yellowActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("yellow")}
                  >
                    Żółty
                  </div>
                )}
                {colorsActive[6] && (
                  <div
                    className={
                      blackActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("black")}
                  >
                    Czarny
                  </div>
                )}
                {colorsActive[7] && (
                  <div
                    className={
                      greyActive
                        ? "color_box2_single_item"
                        : "color_box_single_item"
                    }
                    onClick={() => setColors("grey")}
                  >
                    Szary
                  </div>
                )}
              </div>
              <div id="add_to_cart">
                <button
                  type="button"
                  id="add_to_cart_button"
                  onClick={() => onClickAddToCartHandler()}
                >
                  Dodaj do koszyka
                </button>

                <div className="add_to_cart_display_error">{displayError}</div>
              </div>
            </div>
            <div id="item_text_box">
              <div id="item_text_field">{activeItem.itemDescription}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleItem;
