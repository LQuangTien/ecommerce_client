import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAddress, deleteAddress, updateAddress } from "../../../../actions";
import Button from "../../../../components/UI/Button";
import "./style.css";
function AddressForm(props) {
  const { adr, handleUpdate } = props;
  const [name, setName] = useState(adr ? adr.name : "");
  const [phone, setPhone] = useState(adr ? adr.phone : "");
  const [address, setAddress] = useState(adr ? adr.address : "");
  const [ward, setWard] = useState(adr ? adr.ward : "");
  const [district, setDistrict] = useState(adr ? adr.district : "");
  const [city, setCity] = useState(adr ? adr.city : "");
  const [alternativePhone, setAlternativePhone] = useState(
    adr ? adr.alternativePhone : ""
  );
  const [type, setType] = useState(adr ? adr.type : "");
  const [_id] = useState(adr ? adr._id : "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const isEmpty = () => {
    if (
      name === "" ||
      phone === "" ||
      address === "" ||
      ward === "" ||
      district === "" ||
      city === "" ||
      alternativePhone === "" ||
      type === ""
    ) {
      setError("All field are required");
      return true;
    }
    return false;
  };

  const onSubmit = (e) => {
    if (isEmpty()) return;
    if (handleUpdate) {
      const addressInfo = {
        name,
        phone,
        address,
        ward,
        district,
        city,
        alternativePhone,
        type,
      };
      dispatch(addAddress(addressInfo));
      handleUpdate();
    }
  };
  const onSave = () => {
    if (isEmpty()) return;
    if (handleUpdate) {
      const addressInfo = {
        _id,
        name,
        phone,
        address,
        ward,
        district,
        city,
        alternativePhone,
        type,
      };
      dispatch(updateAddress(addressInfo));
      handleUpdate();
    }
  };
  const onDelete = (id) => {
    if (handleUpdate) {
      const addressInfo = {
        _id,
        name,
        phone,
        address,
        ward,
        district,
        city,
        alternativePhone,
        type,
      };
      dispatch(deleteAddress(addressInfo));
      handleUpdate();
    }
  };
  const renderForn = () => (
    <div
      style={{
        padding: "0 60px 20px 60px",
        boxSizing: "border-box",
        width: props.withoutHeader && "100%",
      }}
    >
      <div className="row">
        <div className="col lg-12">
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div className="col lg-12">
          <input
            className="address__input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col lg-6">
          <input
            className="address__input"
            placeholder="10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="col lg-6">
          <input
            className="address__input"
            placeholder="Alternative phone number"
            value={alternativePhone}
            onChange={(e) => setAlternativePhone(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col lg-12">
          <input
            className="address__input"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col lg-4">
          <input
            className="address__input"
            placeholder="Ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
          />
        </div>
        <div className="col lg-4">
          <input
            className="address__input"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>
        <div className="col lg-4">
          <input
            className="address__input"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>
      <div>
        <div className="address__type">
          <span className="address__type-title">Type: </span>
          <label for="home">
            <input
              type="radio"
              onChange={() => setType("Home")}
              checked={type === "Home"}
              name="type"
              value="Home"
              id="home"
            />
            <span className="address__type-span">Home</span>
          </label>

          <label for="work">
            <input
              type="radio"
              onChange={() => setType("Work")}
              checked={type === "Work"}
              name="type"
              value="Work"
              id="work"
            />
            <span className="address__type-span">Work</span>
          </label>
        </div>
      </div>
      <div className="address__btn-wrapper">
        <Button
          title={props.withoutHeader ? "SAVE" : "SAVE AND DELIVERY HERE"}
          onClick={props.withoutHeader ? onSave : onSubmit}
          className="address__btn"
        />
        {props.withoutHeader && (
          <Button
            title="Delete"
            className="address__btn address__btn--delete"
            onClick={onDelete}
          />
        )}
      </div>
    </div>
  );
  if (props.withoutHeader) {
    return renderForn();
  }
  return (
    <div className="checkoutStep" style={{ backgroundColor: "#f5faff" }}>
      <div
        onClick={props.onClick}
        className={`checkoutHeader active ${props.onClick && "cursor-pointer"}`}
      >
        <div>
          <span className="stepNumber">+</span>
          <span className="stepTitle">ADD NEW ADDRESS</span>
        </div>
      </div>
      {renderForn()}
    </div>
  );
}

export default AddressForm;
