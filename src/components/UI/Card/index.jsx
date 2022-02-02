import React from "react";
import "./style.css";
function Card(props) {
  return (
    <div className={"card "+ props.className} style={{...props.style}}>
      <div className="cardHeader">
        {props.leftHeader && props.leftHeader}
        {props.rightHeader && props.rightHeader}
      </div>
      {props.children}
    </div>
  );
}

export default Card;
