import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Modal = (props) => {
  if (!props.visible) {
    return null;
  }
  return (
    <>
      <div className="modalFixedBg">
        <div style={{ position: "relative" }}>
          <div className="modalClose" onClick={props.onClose}>
            X
          </div>
          <div className="modalContainer">{props.children}</div>
        </div>
      </div>
    </>
  );
};

const Input = (props) => {
  const [focus, setFocus] = useState(false);

  return (
    <div className="materialInput">
      <label
        className={`label ${focus ? "focus" : ""}`}
        style={{
          top: 0,
          lineHeight: "none",
        }}
      >
        {props.label}
      </label>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          className="input"
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          onFocus={(e) => {
            setFocus(true);
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setFocus(false);
            }
          }}
        />
        {props.rightElement ? props.rightElement : null}
      </div>
    </div>
  );
};

const Button = (props) => {
  return (
    <div className={props.className} style={{ width: "100%", ...props.style }}>
      <button className="materialButton" onClick={props.onClick}>
        {props.title && props.title}
      </button>
    </div>
  );
};

const DropdownMenu = (props) => {
  return (
    <div className="headerDropdownContainer">
      {props.menu}
      <div className="dropdown">
        <div className="upArrow"></div>
        {props.firstMenu}
        <ul className="headerDropdownMenu">
          {props.menus &&
            props.menus.map((item, index) => (
              <li key={index}>
                <Link to={item.href} onClick={item.onClick}>
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
const Anchor = (props) => {
  return (
    <button
      onClick={props.onClick}
      style={{ ...props.style }}
      className="anchor-btn"
    >
      {props.name}
    </button>
  );
};
export { Modal, Input, Button, DropdownMenu, Anchor };
