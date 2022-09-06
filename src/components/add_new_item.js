// import "../style/add_new_item.css";
import "../index.css";
import React, { useState } from "react";

const AddNewItem = () => {
  const [image, setImage] = useState([]);
  const [ims, setIms] = useState([]);
  const [itemTitle, setItemTitle] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemUnderType, setItemUnderType] = useState("");
  const [itemPrice, setItemPrice] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < image.length; i++) {
      formData.append("images", image[i]);
    }
    formData.append("itemTitle", itemTitle);
    formData.append("itemType", itemType);
    formData.append("itemUnderType", itemUnderType);
    formData.append("itemPrice", itemPrice);

    fetch("http://localhost:4000/api/uploadmultiple", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log("Jest git");
        console.log(res.json());
      })
      .catch((err) => {
        console.log("Jest lipa");
      });
  };
  const changeImage = (e) => {
    console.log("zmieniam");
    console.log(e.target.files.length);
    var arrs = [];
    for (let i = 0; i < e.target.files.length; i++) {
      arrs.push(e.target.files[i]);
    }
    console.log(arrs);
    setImage(arrs);
    // console.log(image);
  };
  const onTitleChange = (e) => {
    setItemTitle(e.target.value);
  };
  const onTypeChange = (e) => {
    setItemType(e.target.value);
  };
  const onUnderTypeChange = (e) => {
    setItemUnderType(e.target.value);
  };
  const onPriceChange = (e) => {
    setItemPrice(e.target.value);
  };
  const getItem = async () => {
    console.log("klikniete");
    const response = await fetch("http://localhost:4000/api/items");
    const imson = await response.json();
    setIms(imson);
    console.log(ims);
  };

  return (
    <>
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
              <input
                onChange={(e) => changeImage(e)}
                type="file"
                className="form-control"
                name="images"
                id="formFile"
                multiple
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_title" className="label_for_text">
                Tytuł aukcji
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
              <label htmlFor="form_type" className="label_for_text">
                Kategoria
              </label>
              <input
                onChange={(e) => onTypeChange(e)}
                type="text"
                className="input_text"
                name="itemType"
                id="form_type"
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_undertype" className="label_for_text">
                Podkategoria
              </label>
              <input
                onChange={(e) => onUnderTypeChange(e)}
                type="text"
                className="input_text"
                name="itemUnderType"
                id="form_undertype"
              ></input>
            </div>
            <div className="row_form">
              <label htmlFor="form_price" className="label_for_text">
                Cena(zł)
              </label>
              <input
                onChange={(e) => onPriceChange(e)}
                type="text"
                className="input_text"
                name="itemPrice"
                id="form_price"
              ></input>
            </div>
            <div className="row_form">
              <input
                type="submit"
                className="button_warning"
                value="Dodaj rzecz"
              ></input>
            </div>
          </form>
          <div className="image_test">
            <button
              type="button"
              className="get_button"
              onClick={() => getItem()}
            >
              Wez itemy
            </button>
            {ims.map((single_image) => {
              return (
                <div key={single_image._id} className="image_getted">
                  <img
                    src={
                      "data:image/jpeg;base64, " +
                      single_image.itemImagesBase64[0]
                    }
                    className="imag_getted"
                  ></img>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewItem;
