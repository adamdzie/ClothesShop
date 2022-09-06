import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/show_items.css";
import "../index.css";
// import "../style/admin_panel.css";
import arrow from "../images/down-arrow.png";
import cross from "../images/close.png";
import vision from "../images/vision.png";
import gear from "../images/gear.png";
import { categories } from "../data/data";
const ShowItems = ({
  setActiveItem,
  activeItem,
  searchField,
  setSearchField,
  searchTap,
  setSearchTap,
  isLoading,
  setIsLoading,
  isAdmin,
  currentUser,
  isAuth,
}) => {
  const [actualImages, setActualImages] = useState([]);
  const [actualIndexes, setActualIndexes] = useState([]);
  const [imageArraySizes, setImageArraySizes] = useState([]);
  const [flags, setFlags] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [observedItems, setObservedItems] = useState([]);
  // const [currentGetItemIndex, setCurrentGetItemIndex] = useState(0);
  const [maxItems, setMaxItems] = useState(0);
  const [items, setItems] = useState([]);
  const [actualItems, setActualItems] = useState(0);
  // const [isLoading, setIsLoading] = useState(0);

  const [underCategories, setUnderCategories] = useState([]);

  const navigate = useNavigate();
  const currentGetItemIndex = useRef(0);
  const isFirstRender = useRef(true);
  const isRightClick = useRef(false);
  const isLeftClick = useRef(false);

  const buttonRef = useRef(null);

  const isMakeChange = useRef(false);

  const [makeFocus, setMakeFocus] = useState(false);
  const isFocus = useRef(false);
  const [handleFocus, setHandleFocus] = useState(false);

  let temp_arr = [];
  let image_indexes = [];
  let actual_indexes = [];
  let temp_items = [];
  let temp_actual_indexes = [];

  const setUnderCats = () => {
    let temp = [];
    for (var i = 0; i < categories.length; i++) {
      for (var j = 0; j < categories[i].under_categories.length; j++) {
        temp.push(categories[i].under_categories[j]);
      }
    }
    setUnderCategories(temp);
  };

  const getItems = async (addValue) => {
    // if (flags === "") {
    // const response = await fetch("http://localhost:4000/api/items");

    var pathh = "http://localhost:4000/api";
    console.log(window.location.search);
    var definitive_path =
      "http://localhost:4000/api" +
      window.location.pathname +
      window.location.search;
    if (isLeftClick.current) {
      currentGetItemIndex.current = currentGetItemIndex.current - 15;
    }
    if (isRightClick.current) {
      currentGetItemIndex.current = currentGetItemIndex.current + 15;
    }
    if (!isRightClick.current && !isLeftClick.current) {
      currentGetItemIndex.current = 0;
    }
    var path = window.location.search;
    if (isLoading) {
      if (path.search("\\?") > -1) {
        if (path.search("skip") > -1) {
          let start_index = path.indexOf("skip");
          let new_pat = path.slice(0, start_index);
          let rest_pat = path.slice(start_index, path.length);
          let ind_of_skip = rest_pat.indexOf("&");
          console.log(ind_of_skip);
          if (ind_of_skip !== -1) {
            new_pat = rest_pat.slice(ind_of_skip, new_pat.length);
            console.log(new_pat);
          } else
            path = new_pat + "skip=" + currentGetItemIndex.current.toString();
        } else {
          path =
            window.location.search +
            "&skip=" +
            currentGetItemIndex.current.toString();
        }
      } else {
        path = "?skip=" + currentGetItemIndex.current.toString();
      }
      var definitive_path = pathh + path;
      console.log(path);
      navigate(path);
    }
    console.log(definitive_path);
    const response = await fetch(definitive_path);
    const items_json = await response.json();
    const items_ = items_json.data;

    if (!isRightClick.current && !isLeftClick.current) {
      setActualItems(items_.length);
    }

    if (isLeftClick.current) {
      console.log(actualItems);
      console.log(items.length);
      setActualItems((prevState) => {
        return prevState - items.length;
      });
      isLeftClick.current = false;
    }
    if (isRightClick.current) {
      setActualItems((prevState) => {
        return prevState + items_.length;
      });
      isRightClick.current = false;
    }

    if (items_.length > items_json.max || items_.length === items_json.max)
      setActualItems(items_json.max);
    setMaxItems(items_json.max);
    setItems(items_);

    items_.map((item) => {
      temp_arr.push(item.itemImagesBase64[0]);
      image_indexes.push(item.itemImagesBase64.length);
      actual_indexes.push(0);
    });
    setActualImages(temp_arr);
    setImageArraySizes(image_indexes);
    setActualIndexes(actual_indexes);
    setIsLoading(0);
  };

  const buttonUp = (e, item, index) => {
    temp_arr = actualImages;
    temp_items = [...items];
    temp_actual_indexes = actualIndexes;

    if (actualIndexes[index] === 0)
      temp_actual_indexes[index] = imageArraySizes[index] - 1;
    else temp_actual_indexes[index]--;

    setActualIndexes(temp_actual_indexes);
    console.log(actualIndexes[index]);
    temp_arr[index] = item.itemImagesBase64[actualIndexes[index]];
    setActualImages(temp_arr);

    let temp_item = temp_items[0];
    temp_items[0] = items[1];

    setItems(temp_items);
    temp_items[0] = temp_item;
    setItems(temp_items);
  };

  const buttonDown = (e, item, index) => {
    temp_arr = actualImages;
    temp_items = [...items];
    temp_actual_indexes = actualIndexes;

    if (actualIndexes[index] + 1 >= imageArraySizes[index])
      temp_actual_indexes[index] = 0;
    else temp_actual_indexes[index]++;

    setActualIndexes(temp_actual_indexes);
    console.log(actualIndexes[index]);
    temp_arr[index] = item.itemImagesBase64[actualIndexes[index]];
    setActualImages(temp_arr);

    let temp_item = temp_items[0];
    temp_items[0] = items[1];

    setItems(temp_items);
    temp_items[0] = temp_item;
    setItems(temp_items);
  };

  const onClickHandlerItemPage = (e, item) => {
    if (item) {
      setActiveItem(item);
      navigate("/item");
    } else throw Error("Nie ma tu żadnej rzeczy");
  };
  const onClickHandlerItemEdit = (e, item) => {
    if (item) {
      setActiveItem(item);
      navigate("/edit_item");
    } else throw Error("Nie ma tu żadnej rzeczy");
  };
  const handleKeyPress = (e) => {
    const { key, keyCode } = e;
    var path = window.location.search;
    console.log(minPrice);
    console.log(maxPrice === "");
    if (key === "Enter") {
      setIsLoading(1);
      console.log(minPrice.toString());

      if (maxPrice === "" && minPrice === "") return navigate("/");
      if (path.search("\\?") > -1) {
        if (path.search("min") > -1) {
          let start_index = path.indexOf("min");

          let new_pat = path.slice(0, start_index);
          console.log(new_pat);
          path =
            window.location.pathname + new_pat + "min=" + minPrice.toString();
          navigate(
            window.location.pathname + new_pat + "min=" + minPrice.toString()
          );
        } else {
          path =
            window.location.pathname +
            window.location.search +
            "&min=" +
            minPrice.toString();
          navigate(
            window.location.pathname +
              window.location.search +
              "&min=" +
              minPrice.toString()
          );
        }
      } else {
        path = window.location.pathname + "?min=" + minPrice.toString();
        navigate(window.location.pathname + "?min=" + minPrice.toString());
      }

      if (path.search("max") > -1) {
        let start_index = path.indexOf("max");

        let new_pat = path.slice(0, start_index);
        console.log(new_pat);
        navigate(
          window.location.pathname + new_pat + "max=" + maxPrice.toString()
        );
      } else {
        navigate(
          window.location.pathname +
            window.location.search +
            "&max=" +
            maxPrice.toString()
        );
      }
    }
  };

  const setMinPriceHandler = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setMinPrice(e.target.value);
  };
  const setMaxPriceHandler = (e) => {
    e.preventDefault();
    setMaxPrice(e.target.value);
  };

  const chooseCategoryHandler = (category) => {
    var path = window.location.search;
    if (path.search("\\?") > -1) {
      if (path.search("category") > -1) {
        let start_index = path.indexOf("category");
        let new_pat = path.slice(0, start_index);

        let rest_pat = path.slice(start_index, path.length);

        let ind_of_skip = rest_pat.indexOf("&");

        if (ind_of_skip !== -1) {
          let second_part = rest_pat.slice(ind_of_skip, rest_pat.length);
          console.log(second_part);
          path =
            window.location.pathname +
            new_pat +
            "category=" +
            category.name.toString() +
            second_part;
        } else {
          path =
            window.location.pathname +
            new_pat +
            "category=" +
            category.name.toString();
        }

        setIsLoading(1);
        return navigate(path);
      } else {
        path =
          window.location.pathname +
          window.location.search +
          "&category=" +
          category.name.toString();
        setIsLoading(1);
        return navigate(path);
      }
    } else {
      setIsLoading(1);
      path = window.location.pathname + "?category=" + category.name.toString();
      return navigate(path);
    }
  };
  const chooseUnderCategoryHandler = (under_category) => {
    var path = window.location.search;
    if (path.search("\\?") > -1) {
      if (path.search("under_cat") > -1) {
        let start_index = path.indexOf("under_cat");
        let new_pat = path.slice(0, start_index);
        let rest_pat = path.slice(start_index, path.length);
        let ind_of_skip = rest_pat.indexOf("&");

        if (ind_of_skip !== -1) {
          let second_part = rest_pat.slice(ind_of_skip, rest_pat.length);
          console.log(second_part);
          path =
            window.location.pathname +
            new_pat +
            "under_cat=" +
            under_category.name.toString() +
            second_part;
          setIsLoading(1);
          console.log(path);
          return navigate(path);
        }
        path =
          window.location.pathname +
          new_pat +
          "under_cat=" +
          under_category.name.toString();
        setIsLoading(1);
        console.log(path);
        return navigate(path);
      } else {
        path =
          window.location.pathname +
          window.location.search +
          "&under_cat=" +
          under_category.name.toString();
        setIsLoading(1);
        return navigate(path);
      }
    } else {
      setIsLoading(1);
      path =
        window.location.pathname +
        "?under_cat=" +
        under_category.name.toString();
      return navigate(path);
    }
  };

  const onLeftClickHandlerItems = () => {
    console.log("leftClick");
    setIsLoading(1);
    isLeftClick.current = true;
  };
  const onRightClickHandlerItems = () => {
    console.log("rightClick");
    setIsLoading(1);
    isRightClick.current = true;
  };
  const onDeleteItemHandler = (item) => {
    fetch("/api/" + item._id, {
      method: "DELETE",
    })
      .then((result) => {
        console.log(result);
        getItems();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const addObserveHandler = (item) => {
    fetch("/api/" + currentUser._id + "?item_id=" + item._id, {
      method: "PUT",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return setObservedItems([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };

  const getObservedItems = () => {
    fetch("/api/observed/" + currentUser._id)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setObservedItems([...data]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const onCleanHandler = () => {
    console.log("cleanuje");
    fetch("/api/observed/" + currentUser._id, {
      method: "PATCH",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return setObservedItems([...data]);
      })
      .catch((err) => {
        return console.log(err.message);
      });
  };
  const useFocusHandler = () => {
    setMakeFocus(!makeFocus);
    isFocus.current = !isFocus.current;
    isMakeChange.current = true;
  };
  const handleOnUp = () => {
    console.log("handluje");
    isFocus.current = true;
    setHandleFocus(!handleFocus);
  };
  useEffect(() => {
    if (isFirstRender.current) {
      console.log("first useEffect");
      setUnderCats();
      getItems();
      isFirstRender.current = false; // toggle flag after first render/mounting
      return;
    }
    if (isAuth) {
      if (isMakeChange) {
        console.log("im over here");
        console.log(buttonRef.current);
        getObservedItems();
        buttonRef.current.focus();
      } else {
        console.log("here i am");
        getObservedItems();
        buttonRef.current.blur();
      }
    }
    isMakeChange.current = false;
    console.log("FIRE");
    window.addEventListener("keydown", handleKeyPress);
    if (isLoading === 1) {
      console.log("ale jak");
      getItems();
      setIsLoading(0);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    window.location.search,
    window.location.pathname,
    searchTap,
    minPrice,
    maxPrice,
    maxItems,
    isRightClick.current,
    isLeftClick.current,
    makeFocus,
    handleFocus,
  ]);

  return (
    <>
      <div id="show_items_main_container">
        <div id="show_items_filterbox" className="show_items">
          <div
            id="show_items_dropdown_left"
            ref={buttonRef}
            onClick={useFocusHandler}
            tabIndex="1"
          >
            <div className="observe_text">Obserwowane</div>
            <div className="observe_dropleft">
              <img src={vision} alt=""></img>
            </div>

            {/* <div className="observe_arrow">
              <img src={arrow} alt=""></img>{" "}
            </div> */}
          </div>

          <div className="show_items_informator">
            <span>Kategorie</span>
          </div>
          <div className="show_items_categories">
            {categories.map((category) => {
              return (
                <div
                  key={category.id}
                  onClick={() => chooseCategoryHandler(category)}
                >
                  {category.name}
                </div>
              );
            })}
          </div>
          <div className="show_items_informator">
            <span>Podkategorie</span>
          </div>
          <div className="show_items_undercategories">
            {underCategories.map((under_category, index) => {
              return (
                <div
                  key={index}
                  onClick={() => chooseUnderCategoryHandler(under_category)}
                >
                  {under_category.name}
                </div>
              );
            })}
          </div>

          <div className="show_items_informator">
            <span>Cena</span>
          </div>

          <div className="show_items_minmax">
            <div className="minmax_info">Od</div>
            <div className="minmax_input">
              <input
                type="text"
                placeholder="0"
                onChange={(e) => setMinPriceHandler(e)}
              ></input>
            </div>
            <div className="minmax_info">Do</div>
            <div className="minmax_input">
              <input
                type="text"
                placeholder="0"
                onChange={(e) => setMaxPriceHandler(e)}
              ></input>
            </div>
          </div>

          <div id="show_items_dropdown_absolute">
            <div className="show_items_informator_2">
              <div>Obserwowane</div>
            </div>
            <button className="button_clean_observed" onClick={onCleanHandler}>
              Czyść
            </button>
            {observedItems.map((item) => {
              return (
                <div key={item._id} className="observed_item">
                  <div
                    className="observed_image"
                    onClick={(e) => onClickHandlerItemPage(e, item)}
                  >
                    <img
                      src={
                        "data:image/jpeg;base64, " + item.itemImagesBase64[0]
                      }
                    ></img>
                    <div className="observed_item_title">{item.itemTitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div id="show_items_nav_container">
          <div id="show_items_navbar">
            <div id="show_items_items_nav">
              {actualItems <= 15 && (
                <div className="show_items_items_nav_buttons_blocked">
                  <img
                    src={arrow}
                    alt=""
                    className="show_items_panel_arrow"
                    id="show_items_arrow_left"
                  ></img>
                </div>
              )}
              {actualItems > 15 && (
                <div
                  className="show_items_items_nav_buttons"
                  onClick={() => onLeftClickHandlerItems()}
                >
                  <img
                    src={arrow}
                    alt=""
                    className="show_items_panel_arrow"
                    id="show_items_arrow_left"
                  ></img>
                </div>
              )}
              <div id="show_items_items_input">
                {actualItems} / {maxItems}
              </div>
              {actualItems !== maxItems && (
                <div
                  className="show_items_items_nav_buttons"
                  onClick={() => onRightClickHandlerItems()}
                >
                  <img
                    src={arrow}
                    alt=""
                    className="show_items_panel_arrow"
                    id="admin_panel_arrow_right"
                  ></img>
                </div>
              )}
              {actualItems === maxItems && (
                <div className="show_items_items_nav_buttons_blocked">
                  <img
                    src={arrow}
                    alt=""
                    className="show_items_panel_arrow"
                    id="show_items_arrow_right"
                  ></img>
                </div>
              )}
            </div>
          </div>
          <div id="show_items_container" className="show_items">
            {items.map((item, index) => {
              return (
                <div key={item._id} className="item">
                  {isAdmin && (
                    <div
                      className="absolute_delete"
                      onClick={() => onDeleteItemHandler(item)}
                    >
                      <img src={cross} alt=""></img>
                    </div>
                  )}
                  {isAdmin && (
                    <div
                      className="absolute_edit"
                      onClick={(e) => onClickHandlerItemEdit(e, item)}
                    >
                      <img src={gear} alt=""></img>
                    </div>
                  )}
                  {/* <button type="button" onClick={()=> console.log("klikniete")}></button> */}
                  <div key={index} className="show_items_image">
                    <img
                      src={"data:image/jpeg;base64, " + actualImages[index]}
                      className="show_items_imagesin"
                      alt=""
                      onClick={(e) => onClickHandlerItemPage(e, item)}
                    ></img>
                  </div>

                  <div className="show_items_imageslider">
                    <button
                      type="button"
                      onClick={(e) => buttonUp(e, item, index)}
                      className="show_items_button"
                      id="show_items_button_up"
                    ></button>
                    <button
                      type="button"
                      onClick={(e) => buttonDown(e, item, index)}
                      className="show_items_button"
                      id="show_items_button_down"
                    ></button>
                  </div>
                  <div
                    className="show_items_titlebox"
                    onClick={(e) => onClickHandlerItemPage(e, item)}
                  >
                    <div className="show_items_title">
                      <span className="show_items_span_title">
                        {item.itemTitle}
                      </span>
                    </div>
                  </div>
                  <div
                    className="show_items_price"
                    // onClick={(e) => onClickHandlerItemPage(e, item)}
                  >
                    <div className="absolution">{item.itemPrice + " PLN"}</div>

                    <span className="show_items_text">
                      {item.itemType + ", " + item.itemUnderType}
                    </span>
                    {isAuth && (
                      <div
                        className="show_items_icon_observe"
                        onClick={() => addObserveHandler(item)}
                      >
                        <img src={vision} alt=""></img>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowItems;
