import React from "react";
import { IoCall, IoLocation, IoPhonePortrait } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./style.css";
const Footer = (props) => {
  return (
    <div className="footer">
      <div className="grid wide">
        <div className="row mt-32">
          <div className="col lg-4">
            <p className="footer__heading">FIND IT FAST</p>
            <ul className="footer__list">
              <li>
                <Link className="footer__link" to="/Samsung">
                  Laptop
                </Link>
              </li>
              <li>
                <Link className="footer__link" to="/Iphone">
                  Cell phone
                </Link>
              </li>
              <li>
                <Link className="footer__link" to="/Oppo">
                  Headphone
                </Link>
              </li>
            </ul>
          </div>
          <div className="col lg-4">
            <p className="footer__heading">MY ACCOUNT</p>
            <ul className="footer__list">
              <li>
                <Link className="footer__link" to="/account/order">
                  Order history
                </Link>
              </li>
              <li>
                <Link className="footer__link" to="/cart">
                  Cart
                </Link>
              </li>
              <li>
                <Link className="footer__link" to="/checkout">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
          <div className="col lg-4">
            <p className="footer__heading">CONTACT US</p>
            <ul className="footer__list">
              <li>
                <span className="footer__content">
                  <IoLocation className="footer__icon" />
                  01 Vo Van Ngan, TP. Thu Duc, TP. HCM
                </span>
              </li>
              <li>
                <span className="footer__content">
                  <IoPhonePortrait className="footer__icon" />
                  (+84) 123456789
                </span>
              </li>
              <li>
                <span className="footer__content">
                  <IoCall className="footer__icon" />
                  (+84) 987654321
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
