import React from "react";
import { IoIosClose } from "react-icons/io";
import "./style.css";

const Modal = (props) => {
  if (!props.visible) return null;
  return (
    <div className="modal">
      <div className="modal__overlay" onClick={props.onClose}></div>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header-title">{props.title}</div>
          <div className="modal__header-close" onClick={props.onClose}>
            <IoIosClose />
          </div>
        </div>
        <div className="modal__body">{props.children}</div>
      </div>
    </div>
  );
};

export default Modal;
