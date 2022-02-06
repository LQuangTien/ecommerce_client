import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { getAll, getProductById } from "../../actions";
import { addToCart } from "../../actions/cart.actions";
import Banner from "../../components/UI/Banner";
import Button from "../../components/UI/Button";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import { isNew } from "../../utils/isNew";
import "./style.css";

/**
 * @author
 * @function ProductDetailsPage
 **/

const ProductDetailsPage = (props) => {
  const dispatch = useDispatch();
  const [brand, setBrand] = useState("");
  const product = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);
  const { products } = useSelector((state) => state.products);
  const { productId } = props.match.params;
  useEffect(() => {
    const params = {
      id: productId,
    };
    dispatch(getProductById(params));
  }, [dispatch, productId]);
  useEffect(() => {
    if (Object.keys(product.productDetails).length <= 0) return;
    const index = product.productDetails.categoryInfo.findIndex(
      (x) => x.name.toLowerCase() === "brand"
    );
    if (index > -1) {
      setBrand(product.productDetails.categoryInfo[index].value);
    }
  }, [product, product.productDetails.categoryInfo]);
  if (Object.keys(product.productDetails).length === 0) {
    return null;
  }

  const handleAddToCart = () => {
    const { _id, name, price, quantity } = product.productDetails;
    const img = product.productDetails.productPictures[0];
    dispatch(addToCart({ _id, name, price, img, stock: quantity }));
  };

  const hasSamebrand = () => {
    const items = [...products].filter((p) => {
      if (p.name === product.productDetails.name) return false;
      const index = p.categoryInfo.findIndex((c) => {
        if (c.name.toLowerCase() === "brand") {
          return c.value.toLowerCase() === brand.toLowerCase();
        }
        return false;
      });
      if (index > -1) return true;
      return false;
    });
    return items.length > 0;
  };
  return (
    <>
      <Banner slug={product.productDetails.category} />
      <div className="product-wraper">
        <div className="grid wide">
          <div className="row">
            <div className="col lg-5 md-5 sm-12">
              <Carousel
                autoPlay
                infiniteLoop
                showStatus={false}
                showThumbs={false}
              >
                {product.productDetails.productPictures.map((picture) => (
                  <div className="picture__main">
                    <img alt="" src={generatePictureUrl(picture)} />
                  </div>
                ))}
              </Carousel>
              <Button
                onClick={handleAddToCart}
                title="Add to cart"
                className="detail__btn mt-16"
              ></Button>
            </div>
            <div className="col lg-7 md-7 sm-12 detail">
              <h1 className="detail__name">{product.productDetails.name}</h1>
              {/* <div className="detail__rating">
                <div className="detail__star">
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStar />
                </div>
                <div className="detail__review">
                  <IoChatbubblesOutline /> Reviews (1)
                </div>
              </div> */}
              <p className="detail__price">
                <span className="detail__price--current">
                  ${formatThousand(product.productDetails.price)}
                </span>
                <span className="detail__price--discount">
                  (Save {product.productDetails.sale}%)
                </span>
                <span className="detail__price--old">
                  ${formatThousand(product.productDetails.regularPrice)}
                </span>
              </p>
              <p className="detail__tax">Tax Excluded</p>
              <table className="detail__brand">
                <tbody>
                  <tr>
                    <th>Stock:</th>
                    <td>{formatThousand(product.productDetails.quantity)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="system">
                <div>
                  <p className="system__title">
                    <strong>Description</strong>
                  </p>
                  <ul className="detail__description">
                    {product.productDetails.description.split("\n").map((a) => (
                      <li>{a}</li>
                    ))}
                  </ul>
                </div>
                <p className="system__title">
                  <strong>System:</strong>
                </p>
                <table className="system__table">
                  <tbody>
                    {product.productDetails.categoryInfo.map((info) => (
                      <tr className="system__table-row">
                        <th>{info.name}</th>
                        <td>{info.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {hasSamebrand() && (
            <div className="row">
              <p className="col lg-12 product__additional-products-tittle">
                From same brand
              </p>
              {products &&
                product &&
                [...products]
                  .filter((p) => {
                    if (p.name === product.productDetails.name) return false;
                    const index = p.categoryInfo.findIndex((c) => {
                      if (c.name.toLowerCase() === "brand") {
                        return c.value.toLowerCase() === brand.toLowerCase();
                      }
                      return false;
                    });
                    if (index > -1) return true;
                    return false;
                  })
                  .sort(
                    (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
                  )
                  .slice(0, 8)
                  .map((product, index) => (
                    <div className="product__card col lg-3" key={product._id}>
                      <Link to={"/product/" + product._id}>
                        <div className="product__badge">
                          {Number(product.sale) > 5 && (
                            <span className="product__badge-item product__badge-item--sale">
                              SALE {product.sale}%
                            </span>
                          )}
                          {isNew(product.createdAt) && (
                            <span className="product__badge-item product__badge-item--new">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="product__image">
                          <img
                            src={generatePictureUrl(product.productPictures[0])}
                            alt=""
                          />
                        </div>
                        <div className="product__info">
                          <div className="product__info-name">
                            {product.name}
                          </div>
                          <div className="product__info-price">
                            <span className="product__info-price--current">
                              ${formatThousand(product.price)}
                            </span>
                            <span className="product__info-price--old">
                              ${formatThousand(12000)}
                            </span>
                          </div>
                          {/* <div className="product__rating">
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                        </div> */}
                        </div>
                      </Link>
                    </div>
                  ))}
            </div>
          )}
          <div className="row">
            <p className="col lg-12 product__additional-products-tittle">
              close to the your viewed product's price
            </p>
            {products &&
              product &&
              [...products]
                .filter((p) => {
                  if (p.name === product.productDetails.name) return false;
                  return (
                    Math.abs(
                      Number(product.productDetails.price) - Number(p.price)
                    ) < 2000 ||
                    Math.abs(
                      Number(p.price) - Number(product.productDetails.price)
                    ) < 2000
                  );
                })
                .sort(
                  (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
                )
                .slice(0, 8)
                .map((product, index) => (
                  <div className="product__card col lg-3" key={product._id}>
                    <Link to={"/product/" + product._id}>
                      <div className="product__badge">
                        {Number(product.sale) > 5 && (
                          <span className="product__badge-item product__badge-item--sale">
                            SALE {product.sale}%
                          </span>
                        )}
                        {isNew(product.createdAt) && (
                          <span className="product__badge-item product__badge-item--new">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="product__image">
                        <img
                          src={generatePictureUrl(product.productPictures[0])}
                          alt=""
                        />
                      </div>
                      <div className="product__info">
                        <div className="product__info-name">{product.name}</div>
                        <div className="product__info-price">
                          <span className="product__info-price--current">
                            ${formatThousand(product.price)}
                          </span>
                          <span className="product__info-price--old">
                            ${formatThousand(12000)}
                          </span>
                        </div>
                        {/* <div className="product__rating">
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                        </div> */}
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
