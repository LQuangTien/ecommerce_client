import React from "react";
import "./style.css";
function Banner(props) {
  return (
    <div className="banner">
      <img
        className="banner__image"
        src="https://rubiktheme.com/demo/at_kinzy_demo/themes/at_kinzy/assets/img/bg-breadcrumb.jpg"
        alt=""
      />
      <h1 className="banner__slug">{props.slug}</h1>
    </div>
  );
}

export default Banner;
