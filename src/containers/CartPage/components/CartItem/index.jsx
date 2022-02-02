import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../../../actions/cart.actions";
import { generatePictureUrl } from "../../../../urlConfig";
import "./style.css";
function CartItem(props) {
  const [quantity, setQuantity] = useState(props.cartItem.quantity);
  const { _id, name, price, img } = props.cartItem;

  const onIncreaseQuantity = () => {
    if (props.handleIncreaseQuantity) {
      setQuantity(quantity + 1);
      props.handleIncreaseQuantity(_id);
    }
  };
  const onDecreaseQuantity = () => {
    if (props.handleDecreaseQuantity) {
      if (quantity - 1 <= 0) return;
      setQuantity(quantity - 1);
      props.handleDecreaseQuantity(_id);
    }
  };
  const onRemoveItem = (_id) => {
    if(props.handleRemoveItem){
      props.handleRemoveItem(_id);
    }
  }
  return (
    <div className="cartItemContainer">
      <div className="flexRow">
        <div className="productImgContainer">
          <img src={generatePictureUrl(img)} alt="" />
        </div>
        <div className="cartItemDetails">
          <div>
            <p>{name}</p>
            <p>Price: {price}</p>
          </div>
          <div>Delivery in 3 - 5 days</div>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="quantityControl">
          <button onClick={onDecreaseQuantity}>-</button>
          <input value={quantity} readOnly />
          <button onClick={onIncreaseQuantity}>+</button>
        </div>
        <button className="cartButton">Save for later</button>
        <button className="cartButton" onClick={() => onRemoveItem(_id)}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
