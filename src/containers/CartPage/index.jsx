import React, { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, getCart, removeCartItem } from "../../actions/cart.actions";
import Button from "../../components/UI/Button";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import "./style.css";
function CartPage(props) {
  const cart = useSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState(cart.cartItems);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);
  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getCart());
    }
  }, [auth.authenticate, dispatch]);
  const handleIncreaseQuantity = (id, quantity) => {
    dispatch(addToCart(cartItems[id]));
  };
  const handleDecreaseQuantity = (id, quantity) => {
    if (quantity <= 1) return;
    dispatch(addToCart(cartItems[id], -1));
  };
  const handleRemoveItem = (productId) => {
    dispatch(removeCartItem(productId));
  };
  const renderCartItems = () => {
    return (
      <div className="cart__content">
        {cartItems &&
          Object.keys(cartItems).map((key, index) => (
            <div className="cart__item" key={cartItems[key]._id}>
              <div className="cart__item-image-container">
                <img
                  src={generatePictureUrl(cartItems[key].img)}
                  alt=""
                  className="cart__item-image"
                />
              </div>
              <div className="cart__item-name">{cartItems[key].name}</div>
              <div className="cart__item-quantity">
                <button
                  className={`cart__item-quantity-button ${
                    cartItems[key].quantity <= 1 &&
                    "cart__item-quantity-button--disabled"
                  }`}
                  onClick={() =>
                    handleDecreaseQuantity(
                      cartItems[key]._id,
                      cartItems[key].quantity
                    )
                  }
                >
                  -
                </button>
                <input
                  className="cart__item-quantity-input"
                  value={cartItems[key].quantity}
                  readOnly
                />
                <button
                  className={`cart__item-quantity-button ${
                    cartItems[key].quantity >= cartItems[key].stock &&
                    "cart__item-quantity-button--disabled"
                  }`}
                  onClick={() => {
                    handleIncreaseQuantity(cartItems[key]._id);
                  }}
                >
                  +
                </button>
              </div>
              <p className="cart__item-price">
                $
                {formatThousand(cartItems[key].quantity * cartItems[key].price)}
              </p>
              {props.isCheckout && <div className="cart__item-remove"></div>}
              {!props.isCheckout && (
                <div
                  className="cart__item-remove"
                  onClick={() => handleRemoveItem(cartItems[key]._id)}
                >
                  <IoTrash />
                </div>
              )}
            </div>
          ))}
      </div>
    );
  };
  const getTotalPrice = () => {
    if (!cartItems) return 0;
    return Object.keys(cartItems).reduce((totalPrice, index) => {
      return totalPrice + cartItems[index].quantity * cartItems[index].price;
    }, 0);
  };
  const getTotalAmount = () => {
    if (!cartItems) return 0;
    return Object.keys(cartItems).reduce((totalAmount, index) => {
      return totalAmount + cartItems[index].quantity;
    }, 0);
  };
  const renderCartPrice = () => (
    <div className="cart__content">
      <div className="cart__price-row">
        <p className="cart__price-row-key">
          {getTotalAmount() <= 1
            ? `${getTotalAmount()} item`
            : `${getTotalAmount()} items`}
        </p>
        <p className="cart__price-row-value">
          ${formatThousand(getTotalPrice())}
        </p>
      </div>
      {/* <div className="cart__price-row mt-8">
        <p className="cart__price-row-label">Ship</p>
        <p className="cart__price-row-value">$0</p>
      </div> */}
      <div className="cart__price-row mt-32">
        <p className="cart__price-row-key">Total</p>
        <p>${formatThousand(getTotalPrice())}</p>
      </div>
      {getTotalAmount() !== 0 && (
        <Link to="/checkout" className="cart__price-nagivate">
          <Button black title="Proceed to checkout" className="mt-32"></Button>
        </Link>
      )}
    </div>
  );
  if (props.isCheckout) {
    return renderCartItems();
  }
  // fsz 22px py 16px
  return (
    <div className="cartContainer mt-32">
      <div className="grid wide">
        <div className="row">
          <div className="col lg-8">
            <div className="cart-container">
              <div className="cart__header">shopping cart</div>
              {renderCartItems()}
            </div>
          </div>
          <div className="col lg-4">{renderCartPrice()}</div>
        </div>
      </div>
    </div>
  );
}
export default CartPage;
