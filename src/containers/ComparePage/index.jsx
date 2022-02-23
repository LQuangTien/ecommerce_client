import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import Banner from "../../components/UI/Banner";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import { isNew } from "../../utils/isNew";
import "./style.css";
import { getProduct1, getProduct2, getBySearch } from "../../actions";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

const ComparePage = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const { productId1, productId2 } = queryString.parse(search);
  const { product1, product2, products } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.categories);
  const [id2, setId2] = useState(null);

  useEffect(() => {
    if (productId1) {
      dispatch(
        getProduct1({
          id: productId1,
        })
      );
    }
    if (productId2) {
      dispatch(
        getProduct2({
          id: productId2,
        })
      );
    }
  }, [dispatch, productId1, productId2]);

  useEffect(() => {
    if (product1) {
      dispatch(
        getBySearch({
          category: product1.category,
          page: 1,
        })
      );
    }
  }, [dispatch, product1]);

  useEffect(() => {
    if (id2) {
      dispatch(
        getProduct2({
          id: id2,
        })
      );
    }
  }, [dispatch, id2]);

  const onProduct2Change = (value) => {
    setId2(value);
  };

  const renderTable = () => {
    if (categories && categories.length === 0) return;
    const category = categories.find((x) => x.name === product1.category);
    return (
      <table className="order-detail-table compare-table">
        <thead className="order-detail-table__heading">
          <tr className="order-detail-table__heading-row">
            <th></th>
            <th>{product1.name}</th>
            <th>{product2.name}</th>
          </tr>
        </thead>
        <tbody className="order-detail-table__body">
          {category.filterField.map((field) => (
            <tr className="order-detail-table__body-row">
              <td className="uppercase-first-letter">{field.name}</td>
              <td className="table-cell-white">
                {
                  product1.categoryInfo.find((x) => x.name === field.name)
                    ?.value
                }
              </td>
              <td className="table-cell-white">
                {
                  product2.categoryInfo.find((x) => x.name === field.name)
                    ?.value
                }
              </td>
            </tr>
          ))}
          {category.normalField.map((field) => (
            <tr className="order-detail-table__body-row">
              <td className="uppercase-first-letter">{field.name}</td>
              <td className="table-cell-white">
                {
                  product1.categoryInfo.find((x) => x.name === field.name)
                    ?.value
                }
              </td>
              <td className="table-cell-white">
                {
                  product2.categoryInfo.find((x) => x.name === field.name)
                    ?.value
                }
              </td>
            </tr>
          ))}
          <tr className="order-detail-table__body-row">
            <td className="uppercase-first-letter">Description</td>
            <td className="table-cell-white compare-table-description">
              <ul>
                {product1.description.split("\n").map((a) => (
                  <li>{a}</li>
                ))}
              </ul>
            </td>
            <td className="table-cell-white compare-table-description">
              <ul>
                {product2.description.split("\n").map((a) => (
                  <li>{a}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <>
      <Banner slug={"Compare"} />

      <div className="product-wraper">
        <div className="grid wide">
          <div className="row">
            <div className="col sm-o-2 sm-3 product__card">
              {product1 && (
                <Link
                  to={"/product/" + product1._id}
                  className="product__card-wrapper"
                >
                  <div className="product__badge">
                    {Number(product1.sale) > 5 && (
                      <span className="product__badge-item product__badge-item--sale">
                        SALE {product1.sale}%
                      </span>
                    )}
                    {isNew(product1.createdAt) && (
                      <span className="product__badge-item product__badge-item--new">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="product__image">
                    <img
                      src={generatePictureUrl(product1.productPictures[0])}
                      alt=""
                    />
                  </div>
                  <div className="product__info">
                    <div className="product__info-name">{product1.name}</div>
                    <div className="product__info-price">
                      <p className="product__info-price--old">
                        ${formatThousand(product1.regularPrice)}
                      </p>
                      <p className="product__info-price--current">
                        ${formatThousand(product1.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div className="col sm-3">
              <div className="compare-arrow">
                <IoArrowBack />
                <IoArrowForward />
              </div>
            </div>
            <div className="col sm-3 product__card product2">
              <select
                className="compare-select"
                value={id2}
                onChange={(e) => onProduct2Change(e.target.value)}
              >
                {products.length >= 0 &&
                  products.map((p) => (
                    <option
                      className="compare-select"
                      key={p._id}
                      value={p._id}
                    >
                      {p.name}
                    </option>
                  ))}
              </select>
              {product2 && (
                <Link
                  to={"/product/" + product2._id}
                  className="product__card-wrapper"
                >
                  <div className="product__badge">
                    {Number(product2.sale) > 5 && (
                      <span className="product__badge-item product__badge-item--sale">
                        SALE {product2.sale}%
                      </span>
                    )}
                    {isNew(product2.createdAt) && (
                      <span className="product__badge-item product__badge-item--new">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="product__image">
                    <img
                      src={generatePictureUrl(product2.productPictures[0])}
                      alt=""
                    />
                  </div>
                  <div className="product__info">
                    <div className="product__info-name">{product2.name}</div>
                    <div className="product__info-price">
                      <p className="product__info-price--old">
                        ${formatThousand(product2.regularPrice)}
                      </p>
                      <p className="product__info-price--current">
                        ${formatThousand(product2.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
          <div className="row">
            {!product1 ||
            !product2 ||
            product1.category !== product2.category ? (
              <p className="no-compare">
                Please compare 2 items of the same category
              </p>
            ) : (
              renderTable()
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComparePage;
