import "../style/footer.css";
// import "../index.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Footer = () => {
  return (
    <>
      <div id="footer_container">
        <div className="footer_section">
          <h3>Kontakt</h3>
          <ul className="footer_list">
            <li>Telefon: 574169743</li>
            <li>Wyszukiwarka sklepów</li>
            <li>Kontakt online</li>
          </ul>
        </div>

        <div className="footer_section">
          <h3>O nas</h3>
          <ul className="footer_list">
            <li>Firma</li>
            <li>Zrównoważony rozwój</li>
            <li>Notatki prasowe</li>
            <li>Kariera</li>
            <li>Dane kontaktowe firmy</li>
          </ul>
        </div>
        <div className="footer_section">
          <h3>Regulamin</h3>
          <ul className="footer_list">
            <li>Warunki sprzedaży</li>
            <li>Polityka prywatności</li>
            <li>Ustawienia cookie</li>
            <li>Impressum</li>
          </ul>
        </div>
        <div className="footer_section">
          <h3>Serwis</h3>
          <ul className="footer_list">
            <li>FAQ</li>
            <li>Dostawa</li>
            <li>Zwroty</li>
            <li>Reklamacje</li>
            <li>Dostępność</li>
            <li>Filtrowanie</li>
            <li>Tabela rozmiarów</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Footer;
