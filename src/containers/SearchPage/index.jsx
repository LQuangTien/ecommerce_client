import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { useRanger } from "react-ranger";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import Banner from "../../components/UI/Banner";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import "./style.css";
import { getByQuery, getBySearch } from "../../actions";
import { isNew } from "../../utils/isNew";
const ORDER_OPTIONS = [
  {
    value: "newest",
    name: "Newest",
  },
  {
    value: "priceLowToHigh",
    name: "Price - Low to high",
  },
  {
    value: "priceHighToLow",
    name: "Price - High to low",
  },
];
function SearchPage(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const { q, page, orderBy } = queryString.parse(search);
  const { products, totalPage } = useSelector((state) => state.products);
  /** Use State */
  const [order, setOrder] = useState(orderBy || ORDER_OPTIONS[0].value);

  /** End Use State */
  useEffect(() => {
    dispatch(getBySearch({ q, page, orderBy }));
  }, [dispatch, q, page, orderBy]);

  /** Function */
  const handlePageClick = (activePage) => {
    const newQuery = { page: +activePage.selected + 1 };
    const searchString = queryString.stringify({
      q,
      orderBy,
      ...newQuery,
    });
    history.push({
      search: searchString,
    });
  };

  const onOrderChange = (value) => {
    setOrder(value);
    const searchString = queryString.stringify({
      q,
      page: 1,
      orderBy: value,
    });
    history.push({
      search: searchString,
    });
  };
  /** End Function */

  return (
    <div className="product">
      <div className="grid wide">
        {products.length > 0 && (
          <>
            <div className="row">
              <div className="col col-1">
                <select
                  name="order"
                  className="product__selectbox"
                  value={order}
                  onChange={(e) => onOrderChange(e.target.value)}
                >
                  {ORDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              {Object.keys(products).map((key, index) => (
                <div className="product__card col lg-3" key={products[key]._id}>
                  <Link to={"/product/" + products[key]._id} className="">
                    <div className="product__badge">
                      {Number(products[key].sale) > 5 && (
                        <span className="product__badge-item product__badge-item--sale">
                          SALE {products[key].sale}%
                        </span>
                      )}
                      {isNew(products[key].createdAt) && (
                        <span className="product__badge-item product__badge-item--new">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="product__image">
                      <img
                        src={generatePictureUrl(
                          products[key].productPictures[0]
                        )}
                        alt=""
                      />
                    </div>
                    <div className="product__info">
                      <div className="product__info-name">
                        {products[key].name}
                      </div>
                      <div className="product__info-price">
                        <p className="product__info-price--old">
                          ${formatThousand(products[key].regularPrice)}
                        </p>
                        <p className="product__info-price--current">
                          ${formatThousand(products[key].price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="row">
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                forcePage={Number(page - 1) || 0}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          </>
        )}
        {products.length <= 0 && (
          <>
            <p className="not-found-title">
              We couldn't find the product you're looking for
            </p>
            <p className="not-found-title">
              <Link className="not-found-link" to="/">
                Go back and continue shopping
              </Link>
            </p>
            <div className="not-found">
              <img
                src="https://res.cloudinary.com/quangtien/image/upload/v1634491963/ccef151a3e6dfc9c07e7e195daa3fe25_v6spgl.png"
                alt=""
                className="not-found__image"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
