import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetail } from "../../actions/user.actions";
import Banner from "../../components/UI/Banner";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import "./style.css";

function OrderDetailPage(props) {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.user);
  const { _id } = useParams();

  useEffect(() => {
    dispatch(getOrderDetail(_id));
  }, [_id, dispatch]);
  const getTotal = () => {
    if (!order.items) return 0;
    return order.items.reduce((totalPrice, currentItem) => {
      totalPrice += currentItem.quantity * currentItem.paidPrice;
      return totalPrice;
    }, 0);
  };
  return (
    <div>
      <Banner slug={"Order Detail"} />
      {order && (
        <div className="grid wide">
          <div className="order-detail-card">
            <strong>
              Order Reference: {order._id} - placed on{" "}
              {new Date(order.createdAt).toLocaleString()}
            </strong>
          </div>
          <div className="order-detail-card">
            <strong>FOLLOW YOUR ORDER'S STATUS STEP-BY-STEP</strong>
            <table className="order-detail-table">
              <thead className="order-detail-table__heading">
                <tr className="order-detail-table__heading-row">
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="order-detail-table__body">
                {order.process &&
                  order.process.map((p) => {
                    return (
                      <tr className="order-detail-table__body-row">
                        <td className="uppercase-first-letter">{p.type}</td>
                        <td>
                          {p.isCompleted
                            ? new Date(p.date).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {order.address && (
            <div className="order-detail-card">
              <strong>YOUR ORDER'S DELIVERY ADDRESS</strong>
              <p className="mt-12">
                <span className="mr-16">
                  <strong className="mr-8">Receiver: </strong>
                  {order.address.name}
                </span>
                <span className="mr-16">
                  <strong className="mr-8">Phone: </strong>
                  {order.address.phone}
                </span>
              </p>
              <p className="mt-12">
                <span className="mr-16">
                  <strong className="mr-8">Address: </strong>
                  {order.address.address}
                </span>
                <span className="mr-16">
                  <strong className="mr-8">Ward: </strong>
                  {order.address.ward}
                </span>
                <span className="mr-16">
                  <strong className="mr-8">District: </strong>
                  {order.address.district}
                </span>
                <span className="mr-16">
                  <strong className="mr-8">City: </strong>
                  {order.address.city}
                </span>
              </p>
            </div>
          )}

          <div className="order-detail-card">
            <table className="order-detail__product-table">
              <thead>
                <th className="order-detail__product-table-heading"></th>
                <th className="order-detail__product-table-heading">Product</th>
                <th className="order-detail__product-table-heading">
                  Quantity
                </th>
                <th className="order-detail__product-table-heading">
                  Unit price
                </th>
                <th className="order-detail__product-table-heading">
                  Total Price
                </th>
              </thead>
              <tbody>
                {order.items &&
                  order.items.map((item) => (
                    <tr>
                      <td className="order-detail__product-table-image-wrapper">
                        <img
                          className="order-detail__product-table-image"
                          src={generatePictureUrl(
                            item.productId.productPictures[0]
                          )}
                          alt=""
                        />
                      </td>
                      <td>{item.productId.name}</td>
                      <td>{item.quantity}</td>
                      <td className="text-align-right">
                        ${formatThousand(item.paidPrice)}
                      </td>
                      <td className="text-align-right">
                        ${formatThousand(item.quantity * item.paidPrice)}
                      </td>
                    </tr>
                  ))}
                {/* <tr className="text-align-right">
                  <td colSpan="4">Subtotal</td>
                  <td>${formatThousand(getTotal())}</td>
                </tr>
                <tr className="text-align-right">
                  <td colSpan="4">Shipping</td>
                  <td>0</td>
                </tr> */}
                <tr className="text-align-right">
                  <td colSpan="4">Total</td>
                  <td>${formatThousand(getTotal())}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetailPage;
