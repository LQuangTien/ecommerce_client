import React from "react";
import "./style.css";

const Input = (props, ...rest) => {
  return (
    <input
      className={"input " + props.className}
      type={props.type || "text"}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      onKeyDown={props.onKeyDown}
      {...rest}
    />
  );
};

export default Input;
