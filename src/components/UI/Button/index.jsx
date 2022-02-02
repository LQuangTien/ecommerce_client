import React from "react";
import ReactLoading from "react-loading";
import "./style.css";

const Button = (props) => {
  if (props.black)
    return (
      <button
        className={"button button--black " + props.className}
        onClick={props.onClick}
        disabled={props.loading}
      >
        {props.loading && (
          <ReactLoading
            type={"spin"}
            color={"white"}
            height={"20%"}
            width={"20%"}
          />
        )}
        {props.title}
      </button>
    );
  return (
    <button
      disabled={props.loading}
      className={"button " + props.className}
      onClick={props.onClick}
    >
      <div className="button-flex">
        {props.loading && (
          <ReactLoading
            type={"spin"}
            color={"white"}
            height={"20px"}
            width={"20px"}
          />
        )}
        {props.title}
      </div>
    </button>
  );
};

export default Button;
