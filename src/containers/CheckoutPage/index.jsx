import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { addOrder, getAddress } from "../../actions";
import Anchor from "../../components/UI/Anchor";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import formatThousand from "../../utils/formatThousand";
import CartPage from "../CartPage";
import Address from "./components/Address";
import AddressForm from "./components/AddressForm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "../../helpers/axios";

const Step = (props) => (
  <div className="checkoutStep">
    <div
      onClick={props.onClick}
      className={`checkoutHeader ${props.active && "active"} ${
        props.onClick && "cursor-pointer"
      }`}
    >
      <div>
        <span className="stepNumber">{props.stepNumber}</span>
        <span className="stepTitle">{props.title}</span>
      </div>
    </div>
    {props.body && props.body}
  </div>
);

const PAYMENT_OPTIONS = [
  { name: "Cash on delivery", value: "cod" },
  { name: "Zalopay", value: "zalo" },
];

function CheckoutPage() {
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [addAddressStep, setAddAddressStep] = useState(false);
  const [summaryStep, setSummaryStep] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [isCompleteOrder, setIsCompleteOrder] = useState(false);
  const [address, setAddress] = useState([]);
  const [wasConfirmedAddress, setWasConfirmedAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState(cart.cartItems);
  const [payment, setPayment] = useState("cod");
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getAddress());
    }
  }, [auth.authenticate, dispatch]);
  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);
  useEffect(() => {
    const mappedAddress = user.address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(mappedAddress);
  }, [user.address]);

  const selectAddress = (id) => {
    const mappedAddress = address.map((adr) =>
      adr._id.toString() === id.toString()
        ? { ...adr, selected: true }
        : { ...adr, selected: false }
    );
    setAddress(mappedAddress);
  };
  const enableEditAddress = (id) => {
    const mappedAddress = address.map((adr) =>
      adr._id.toString() === id.toString()
        ? { ...adr, edit: true }
        : { ...adr, edit: false }
    );
    setAddress(mappedAddress);
  };
  const handleConfirm = (adr) => {
    setWasConfirmedAddress(true);
    setSelectedAddress(adr);
    setSummaryStep(true);
  };
  const handleUpdate = () => {
    const mappedAddress = address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(mappedAddress);
    setWasConfirmedAddress(false);
    setAddAddressStep(false);
    setSummaryStep(false);
    setPaymentStep(false);
  };
  const handleContinue = () => {
    setSummaryStep(false);
    setPaymentStep(true);
  };
  const handleConfirmPayment = () => {
    setWasConfirmedAddress(false);
    setAddAddressStep(false);
    setSummaryStep(false);
    setPaymentStep(false);
    setIsCompleteOrder(true);

    const items = Object.keys(cartItems).map((key, index) => ({
      productId: key,
      paidPrice: cartItems[key].price,
      quantity: cartItems[key].quantity,
    }));
    const order = {
      addressId: selectedAddress._id,
      totalAmount: getTotalPrice(),
      items,
      status: "in progress",
      paymentOption: payment,
    };
    dispatch(addOrder(order));
  };
  const getTotalPrice = () => {
    if (cartItems) {
      const result = Object.keys(cartItems).reduce((totalPrice, index) => {
        return totalPrice + cartItems[index].quantity * cartItems[index].price;
      }, 0);
      return result;
    }
  };
  const getTotalAmount = () => {
    return Object.keys(cartItems).reduce((totalAmount, index) => {
      return totalAmount + cartItems[index].quantity;
    }, 0);
  };
  const renderCartPrice = () => (
    <div className="cart__content">
      <div className="cart__price-row">
        <p className="cart__price-row-key">
          {getTotalAmount() === 1 ? "1 item" : `${getTotalAmount()} items`}
        </p>
        <p className="cart__price-row-value">
          ${formatThousand(getTotalPrice())}
        </p>
      </div>
      <div className="cart__price-row mt-8">
        <p className="cart__price-row-label">Ship</p>
        <p className="cart__price-row-value">$0</p>
      </div>
      <div className="cart__price-row mt-32">
        <p className="cart__price-row-key">Total</p>
        <p>${formatThousand(getTotalPrice())}</p>
      </div>
    </div>
  );

  if (isCompleteOrder && user.redirectUrl !== "" && user.apptransid !== "") {
    document.location.href = "/";
    return <Redirect to="/" />;
  }

  if (isCompleteOrder && payment === "cod") {
    document.location.href = "/";
    return <Redirect to="/" />;
  }

  return (
    <div className="checkoutContainer">
      <div className="grid wide mt-16">
        <div className="row">
          <div className="col lg-8">
            <div className="step-wrapper">
              <Step
                stepNumber="1"
                title="LOGIN"
                active={!auth.authenticate}
                body={
                  auth.authenticate && (
                    <div className="info-wrapper">
                      <div className="info-wrapper__container--inline">
                        <span className="info-wrapper__title">Name:</span>
                        {auth.user.fullName}
                      </div>
                      <div className="info-wrapper__container--inline">
                        <span className="info-wrapper__title">Email:</span>
                        {auth.user.email}
                      </div>
                    </div>
                  )
                }
              />
              <Step
                stepNumber="2"
                title="ADDRESS"
                active={!wasConfirmedAddress && auth.authenticate}
                body={
                  wasConfirmedAddress ? (
                    <div className="info-wrapper">
                      <div className="info-wrapper__container">
                        <span className="info-wrapper__title">
                          Your phone:{" "}
                        </span>
                        <span>{selectedAddress.phone}</span>
                      </div>
                      <div className="info-wrapper__container">
                        <span className="info-wrapper__title">
                          Your address:{" "}
                        </span>
                        <span>
                          {selectedAddress.address}, {selectedAddress.ward},{" "}
                          {selectedAddress.district}, {selectedAddress.city}
                        </span>
                      </div>
                      <div className="info-wrapper__container">
                        <span className="info-wrapper__title">
                          <Anchor
                            name="Select other address ?"
                            style={{ color: "#2874f0", padding: 0 }}
                            onClick={() => handleUpdate()}
                          />
                        </span>
                      </div>
                    </div>
                  ) : (
                    address.map((adr, index) => (
                      <Address
                        key={index}
                        adr={adr}
                        selectAddress={selectAddress}
                        handleConfirm={handleConfirm}
                        handleUpdate={handleUpdate}
                        enableEditAddress={enableEditAddress}
                      />
                    ))
                  )
                }
              />
              {wasConfirmedAddress ? null : addAddressStep ? (
                <AddressForm
                  onClick={() => setAddAddressStep(!addAddressStep)}
                  handleUpdate={handleUpdate}
                />
              ) : (
                auth.authenticate && (
                  <Step
                    stepNumber="+"
                    title="ADD NEW ADDRESS"
                    active={addAddressStep}
                    onClick={() => setAddAddressStep(!addAddressStep)}
                  />
                )
              )}
              <Step
                stepNumber="3"
                title="ORDER SUMMARY"
                active={summaryStep}
                body={summaryStep && <CartPage isCheckout />}
              />
              {summaryStep && (
                <Card
                  className="continue-btn__container"
                  leftHeader={
                    <p style={{ fontSize: "1.2rem" }}>You're almost done</p>
                  }
                  rightHeader={
                    <Button
                      title="CONTINUE"
                      className="continue-btn"
                      onClick={handleContinue}
                    />
                  }
                />
              )}
              <Step
                stepNumber="4"
                title="PAYMENT OPTIONS"
                active={paymentStep}
                body={
                  paymentStep && (
                    <div className="info-wrapper">
                      {PAYMENT_OPTIONS.map((type, index) => (
                        <div className="info-wrapper__container" key={index}>
                          <input
                            type="radio"
                            name="paymentOptions"
                            id={type.value}
                            checked={payment === type.value}
                            onChange={(e) => {
                              setPayment(type.value);
                            }}
                          />
                          <label htmlFor={type.value}>{type.name}</label>
                        </div>
                      ))}
                      <PayPalScriptProvider
                        options={{
                          "client-id":
                            "AUO_18_k7PqkzGttQfi0JhToSzGvnoAl4hmNafL1bbNeEbE2y3_Cnp74veaIwWvmXshHb0cKlvfvR7AV",
                        }}
                      >
                        <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD",
                                    value: getTotalPrice().toString(),
                                    breakdown: {
                                      item_total: {
                                        currency_code: "USD",
                                        value: getTotalPrice().toString(),
                                      },
                                    },
                                  },
                                  items: Object.keys(cartItems).map(
                                    (key, index) => {
                                      return {
                                        name: cartItems[key].name,
                                        unit_amount: {
                                          currency_code: "USD",
                                          value:
                                            cartItems[key].price.toString(),
                                        },
                                        quantity: cartItems[key].quantity,
                                      };
                                    }
                                  ),
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            console.log({ dataAfterPayment: data });
                            return actions.order
                              .capture()
                              .then(async (details) => {
                                setWasConfirmedAddress(false);
                                setAddAddressStep(false);
                                setSummaryStep(false);
                                setPaymentStep(false);
                                setIsCompleteOrder(true);

                                const items = Object.keys(cartItems).map(
                                  (key, index) => ({
                                    productId: key,
                                    paidPrice: cartItems[key].price,
                                    quantity: cartItems[key].quantity,
                                  })
                                );
                                const order = {
                                  addressId: selectedAddress._id,
                                  totalAmount: getTotalPrice(),
                                  items,
                                  status: "in progress",
                                  paymentOption: "paypal",
                                };

                                await axios
                                  .post("/user/order/paypalPayment", order)
                                  .then(() => {
                                    setTimeout(() => {
                                      document.location.href = "/";
                                    }, 0);
                                  });
                              });
                          }}
                        />
                      </PayPalScriptProvider>
                      <div className="info-wrapper__container">
                        <Button
                          title="CONFIRM PAYMENT"
                          className="payment-btn"
                          onClick={handleConfirmPayment}
                        />
                      </div>
                    </div>
                  )
                }
              />
            </div>
          </div>
          <div className="col lg-4">{renderCartPrice()}</div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
