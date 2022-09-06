import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/data";
import "../index.css";
import "../style/categories_box.css";
const CategoriesBox = ({ pathToDisplaySetter, setIsLoading }) => {
  const navigate = new useNavigate();

  const changePathCategory = (cat) => {
    setIsLoading(1);
    // const sth = "http://localhost:4000" + "/api/" + cat;
    // pathToDisplaySetter(sth);
    navigate("/strona_glowna" + "?category=" + cat);
  };
  const changePathUnderCategory = (cat, under_cat) => {
    setIsLoading(1);
    navigate(
      "/strona_glowna" + "?category=" + cat + "&" + "under_cat=" + under_cat
    );
  };

  return (
    <div id="categories_bar">
      <div id="categories_bar_inside">
        <div id="filler_1"></div>
        {categories.map((category) => {
          return (
            <div key={category.id} className="ul_categories">
              <button
                type="button"
                className="a_buttons"
                onClick={() => changePathCategory(category.name)}
              >
                {category.name}
              </button>
              {/* <a href="/bluzy">xax</a> */}
              <div className="dropdown_menu">
                {/* <button type="button" onClick={( () => console.log("Japierdole"))}>xaxa</button> */}
                <ul>
                  {category.under_categories.map((under_category) => {
                    return (
                      <li key={under_category.id}>
                        <button
                          type="button"
                          className="a_buttons"
                          onClick={() =>
                            changePathUnderCategory(
                              category.name,
                              under_category.name
                            )
                          }
                        >
                          {under_category.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
        <div id="filler_2"></div>
      </div>
    </div>
  );
};

export default CategoriesBox;
