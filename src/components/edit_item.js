import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { categories, colors, sizes } from "../data/data";
import "../style/admin_panel.css";
import "../style/account.css";
import "../index.css";
const EditItem = ({ activeItem, isAuth, setActiveItem, currentUser }) => {
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
  const [sss, setSss] = useState(1);

  const [_itemTitle, _setItemTitle] = useState("");
  const [_itemCategory, _setItemCategory] = useState("");
  const [_itemUnderCategory, _setItemUnderCategory] = useState("");
  const [_itemPrice, _setItemPrice] = useState("");
  const [_itemDescription, _setItemDescription] = useState("");
  const [_itemImages, _setItemImages] = useState([]);
  const [_itemImagesNew, _setItemImagesNew] = useState([]);

  const activeItemOperation = () => {
    if (!activeItem) {
      let it = localStorage.getItem("activeItem");
      let end = JSON.parse(it);
      setActiveItem(end);
    } else {
      localStorage.setItem("activeItem", JSON.stringify(activeItem));
    }
    setSss(0);
  };

  const setItemValues = () => {
    _setItemTitle(activeItem.itemTitle);
    _setItemCategory(activeItem.itemType);
    _setItemUnderCategory(activeItem.itemUnderType);
    _setItemPrice(activeItem.itemPrice);
    _setItemDescription(activeItem.itemDescription);
    _setItemImages(activeItem.itemImagesBase64);

    for (let i = 0; i < activeItem.itemSizes.length; i++) {
      if (activeItem.itemSizes[i] === "XS") setXsActive(true);
      if (activeItem.itemSizes[i] === "S") setSActive(true);
      if (activeItem.itemSizes[i] === "M") setMActive(true);
      if (activeItem.itemSizes[i] === "L") setLActive(true);
      if (activeItem.itemSizes[i] === "XL") setXlActive(true);
    }
    for (let i = 0; i < activeItem.itemColors.length; i++) {
      if (activeItem.itemColors[i] === "Czerwony") setRedActive(true);
      if (activeItem.itemColors[i] === "Fioletowy") setVioletActive(true);
      if (activeItem.itemColors[i] === "Niebieski") setBlueActive(true);
      if (activeItem.itemColors[i] === "Zielony") setGreenActive(true);
      if (activeItem.itemColors[i] === "Żółty") setYellowActive(true);
      if (activeItem.itemColors[i] === "Pomarańczowy") setOrangeActive(true);
      if (activeItem.itemColors[i] === "Czarny") setBlackActive(true);
      if (activeItem.itemColors[i] === "Grey") setGreyActive(true);
    }
  };

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
    console.log(_itemImagesNew);
    const formData = new FormData();
    for (let i = 0; i < _itemImagesNew.length; i++) {
      formData.append("images", _itemImagesNew[i]);
    }
    for (let i = 0; i < itemSizes.length; i++) {
      formData.append("itemSizes", itemSizes[i]);
    }
    for (let i = 0; i < itemColors.length; i++) {
      formData.append("itemColors", itemColors[i]);
    }

    formData.append("itemDescription", _itemDescription);
    formData.append("itemTitle", _itemTitle);
    formData.append("itemType", _itemCategory);
    formData.append("itemUnderType", _itemUnderCategory);
    formData.append("itemPrice", _itemPrice);

    fetch("/api/edit_item/" + activeItem._id, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        setDisplayError("Edytowano pomyślnie!");
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
      setDisplayError("Możesz wybrać maksymalnie 16 zdjęć!");

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
    _setItemImages([]);
    _setItemImagesNew(arrs);
    setIms(arrsims);
    // console.log(image);
  };
  const onTitleChange = (e) => {
    _setItemTitle(e.target.value);
  };
  const onPriceChange = (e) => {
    _setItemPrice(e.target.value);
  };
  const setPickedCategoryHandler = async (e) => {
    _setItemCategory(e.target.value);
    const oneit = await categories.find(
      (element) => element.name === e.target.value
    );
    _setItemUnderCategory(oneit.under_categories[0].name);
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
    activeItemOperation();
    setItemValues();
    console.log(activeItem.itemType);
    console.log(activeItem.itemUnderType);
  }, []);
  return (
    <div id="main_additem_box">
      <div className="add_item">
        <h2>Edytuj przedmiot</h2>
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
            {ims.length === 0 && (
              <div id="form_file_many">Wybrano zdjęć: {_itemImages.length}</div>
            )}
            {ims.length > 0 && (
              <div id="form_file_many">Wybrano zdjęć: {ims.length}</div>
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
              value={_itemTitle}
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
                  (category.name === _itemCategory && (
                    <option
                      selected="selected"
                      key={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  )) ||
                  (category.name !== _itemCategory && (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))
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
              onChange={(e) => _setItemUnderCategory(e.target.value)}
            >
              <option value="-">-</option>
              {pickedCategory &&
                categories.map((category) => {
                  if (pickedCategory === category.name) {
                    return category.under_categories.map((under_category) => {
                      return (
                        (under_category.name === _itemUnderCategory && (
                          <option
                            selected="selected"
                            key={under_category.id}
                            value={under_category.name}
                          >
                            {under_category.name}
                          </option>
                        )) ||
                        (under_category.name !== _itemUnderCategory && (
                          <option
                            key={under_category.id}
                            value={under_category.name}
                          >
                            {under_category.name}
                          </option>
                        ))
                      );
                    });
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
              value={_itemPrice}
            ></input>
          </div>
          <div className="row_form_long">
            <label htmlFor="form_price" className="label_for_text">
              Opis *
            </label>
            <textarea
              onChange={(e) => _setItemDescription(e.target.value)}
              type="text"
              className="input_text_long"
              name="itemPrice"
              id="form_price"
              value={_itemDescription}
            ></textarea>
          </div>
          <div id="admin_error_field">{displayError}</div>
          <div className="row_form_no_padding">
            <input
              type="submit"
              className="button_warning"
              value="Edytuj"
            ></input>
          </div>
        </form>
      </div>
      <div className="image_list">
        {(ims.length < 1 &&
          _itemImages.map((image, index) => {
            return (
              <div key={index} className="single_image_show">
                <img
                  src={"data:image/jpeg;base64, " + image}
                  alt=""
                  className="image_getted"
                ></img>
              </div>
            );
          })) ||
          (ims.length > 0 &&
            ims.map((image, index) => {
              return (
                <div key={index} className="single_image_show">
                  <img src={image} alt="" className="image_getted"></img>
                </div>
              );
            }))}
      </div>
    </div>
  );
};

export default EditItem;
