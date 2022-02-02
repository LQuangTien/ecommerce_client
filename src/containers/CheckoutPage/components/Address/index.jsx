import React from "react";
import { Anchor, Button } from "../../../../components/UI/Common";
import "../../style.css";
import AddressForm from "../AddressForm";
function Address(props) {
  const { adr, selectAddress, handleConfirm, enableEditAddress, handleUpdate } =
    props;
  return (
    <div
      className={
        !adr.selected ? "addressContainer" : "addressContainer--active"
      }
    >
      {!adr.edit ? (
        <div className="flexRow space-between align-items-center">
          <div>
            <input
              type="radio"
              name="address"
              id={adr._id}
              onClick={() => selectAddress(adr._id)}
            />
          </div>
          <label
            htmlFor={adr._id}
            className="flexRow space-between align-items-center addressinfo"
          >
            <div style={{ width: "520px" }}>
              <div className="info-wrapper__container">
                <div className="info-wrapper__container--inline">
                  <span className="info-wrapper__title">Name:</span>
                  <span>{adr.name}</span>
                </div>
              </div>
              <div className="info-wrapper__container">
                <div className="info-wrapper__container--inline">
                  <span className="info-wrapper__title">Phone:</span>
                  <span>{adr.phone}</span>
                </div>
                <div className="info-wrapper__container--inline">
                  <span className="info-wrapper__title">Type:</span>
                  <span>{adr.type}</span>
                </div>
              </div>
              <div className="info-wrapper__container">
                <div className="info-wrapper__container flexRow">
                  <div className="info-wrapper__title">Address: </div>

                  <div>
                    {adr.address}, {adr.ward}, {adr.district}, {adr.city}
                  </div>
                </div>
              </div>
            </div>
            {adr.selected && (
              <Button
                title="DELIVERY HERE"
                className="delivery-btn info-wrapper__container"
                onClick={() => handleConfirm(adr)}
              />
            )}
            {adr.selected && (
              <Anchor
                name="Edit"
                style={{ color: "#2874f0" }}
                onClick={() => enableEditAddress(adr._id)}
              />
            )}
          </label>
        </div>
      ) : (
        <AddressForm
          withoutHeader
          handleConfirm={handleConfirm}
          handleUpdate={handleUpdate}
          adr={adr}
        />
      )}
    </div>
  );
}

export default Address;
