import queryString from "query-string";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRanger } from "react-ranger";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { getByQuery } from "../../actions";
import Banner from "../../components/UI/Banner";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import { isNew } from "../../utils/isNew";
import "./style.css";
const INIT_PRICE_STATE = [0, 0];
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
function ProductPage(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { category } = useParams();
  const search = useLocation().search;
  const { page, from, to, orderBy, ...otherSearchParam } =
    queryString.parse(search);
  const categoryState = useSelector((state) => state.categories);
  const { products, totalPage } = useSelector((state) => state.products);
  /** Use State */
  const [query, setQuery] = useState(() => {
    const paramFromURL = { ...otherSearchParam };
    Object.keys(paramFromURL).forEach((key) => {
      paramFromURL[key] = paramFromURL[key].split(",");
    });
    return { from, to, page, ...paramFromURL };
  });
  const [searchParam, setSearchParam] = useState(() => ({
    from,
    to,
    orderBy,
    page,
    ...otherSearchParam,
  }));
  const [price, setPrices] = useState([from || 0, to || 0]);
  const [order, setOrder] = useState(orderBy || ORDER_OPTIONS[0].value);

  const { getTrackProps, segments, handles } = useRanger({
    min: 0,
    max: 5000,
    stepSize: 100,
    values: price,
    onChange: (values) => {
      setPrices(values);
      const newQuery = { from: values[0], to: values[1] };
      setQuery((prev) => ({ ...prev, ...newQuery }));
      updateQueryString(newQuery);
    },
  });
  useEffect(() => {
    if (categoryState && categoryState.categories.length === 0) {
      return;
    }
    if (categoryState && categoryState.categories.length > 0) {
      const index = categoryState.categories.findIndex(
        (c) => c.name === category
      );
      if (index < 0) {
        history.push("/");
        return;
      }
    }
  }, [category, categoryState, history]);
  /** End Use State */
  useEffect(() => {
    setPrices(INIT_PRICE_STATE);
    setQuery({});
    setSearchParam({});
    history.push({ search: "" });
  }, [category, history]);
  useEffect(() => {
    dispatch(getByQuery({ ...searchParam, category }));
  }, [category, dispatch, searchParam]);

  /** Function */
  const handlePageClick = (activePage) => {
    const newQuery = { page: +activePage.selected + 1 };
    setQuery({ ...query, ...newQuery });
    updateQueryString(newQuery);
  };
  const formatToSearchParam = (searchForQuery) => {
    const cloneSearch = { ...searchForQuery };
    const currentCate = categoryState.categories.find(
      (cate) => cate.name === category
    );
    const filterFieldNames = currentCate.filterField.map((field) => field.name);
    filterFieldNames.forEach((key) => {
      if (cloneSearch[key] && cloneSearch[key].length > 0) {
        cloneSearch[key] = cloneSearch[key].join(",");
      }
    });
    return cloneSearch;
  };
  const updateQueryString = (newQuery) => {
    const search = {
      ...query,
      ...newQuery,
    };
    const searchParam = formatToSearchParam(search);

    setSearchParam(searchParam);
    const searchString = queryString.stringify(searchParam);
    history.push({
      search: searchString,
    });
  };
  const resetFilter = () => {
    setPrices(INIT_PRICE_STATE);
    setQuery({});
    setSearchParam({});
    const searchString = queryString.stringify({});
    history.push({
      search: searchString,
    });
  };
  const onOrderChange = (value) => {
    setOrder(value);
    const newQuery = { orderBy: value };
    setQuery({ ...query, ...newQuery });
    updateQueryString(newQuery);
  };
  /** End Function */

  /** Render */
  const renderPriceRanger = () => (
    <div>
      <div
        {...getTrackProps({
          style: {
            height: "5px",
            background: "#ddd",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
            borderRadius: "2px",
            top: "1.2rem",
          },
        })}
      >
        {segments.map(({ getSegmentProps }, i) => (
          <div className="range__bar" {...getSegmentProps()} index={i} />
        ))}
        {handles.map(({ value, active, getHandleProps }) => (
          <button
            {...getHandleProps({
              style: {
                appearance: "none",
                border: "none",
                background: "transparent",
                outline: "none",
                top: "calc(-100% - 1px)",
                cursor: "pointer",
              },
            })}
          >
            <span className="range__price">{value}</span>
            <div className="range__dot"></div>
          </button>
        ))}
      </div>
      <div className="range__box-wrapper">
        <input
          className="range__box"
          value={price[0]}
          onChange={(event) => {
            setPrices([event.target.value, price[1]]);
            const newQuery = { from: event.target.value, to: price[1] };
            setQuery((prev) => ({ ...prev, ...newQuery }));
            updateQueryString(newQuery);
          }}
          min={INIT_PRICE_STATE[0]}
          max={5000}
          step="100"
          type="number"
        />
        <input
          className="range__box"
          value={price[1]}
          onChange={(event) => {
            setPrices([price[0], event.target.value]);
            const newQuery = { from: price[0], to: event.target.value };
            setQuery((prev) => ({ ...prev, ...newQuery }));
            updateQueryString(newQuery);
          }}
          min={INIT_PRICE_STATE[0]}
          max={5000}
          step="100"
          type="number"
        />
      </div>
    </div>
  );
  const isChecked = (fieldName, value, vitri) => {
    const hasProperty = !!Object.keys(query).find((key) => key === fieldName);
    if (!hasProperty) return false;
    const isChecked = query[fieldName].includes(value);
    return isChecked;
  };
  const renderDynamicFilterField = () => {
    if (categoryState.categories.length > 0) {
      const currentCategoryFromURL = categoryState.categories.find(
        (cate) => cate.name === category
      );
      if (!currentCategoryFromURL) return;
      return currentCategoryFromURL.filterField.map((field) => {
        const hasField = !!Object.keys(query).find((key) => key === field.name);
        return (
          <div className="filter__field">
            <p className="filter__heading">{field.name}</p>
            {field.value.map((value) => {
              return (
                <>
                  <label
                    className={`filter__checkbox-label ${
                      (() => isChecked(field.name, value))()
                        ? "filter__checkbox-label--active"
                        : ""
                    }  `}
                    key={value}
                  >
                    <input
                      className="filter__checkbox"
                      type="checkbox"
                      name={field.name}
                      onChange={() => {
                        let newQuery = { page: 1 };
                        // kiểm tra field name có trong query chưa
                        // nếu chưa thì tạo thêm property với giá trị là một mảng, có phần tử đầu tiên là value
                        if (!hasField) {
                          newQuery = { ...newQuery, [field.name]: [value] };
                          setQuery((prev) => ({
                            ...prev,
                            ...newQuery,
                          }));
                          updateQueryString(newQuery);
                          return;
                        }
                        // nếu rồi thì
                        // kiếm trả giá trị có trong mảng của field chưa
                        const indexValue = query[field.name].findIndex(
                          (val) => val === value
                        );
                        // nếu chưa thì thêm
                        if (indexValue < 0) {
                          newQuery = {
                            ...newQuery,
                            [field.name]: [...query[field.name], value],
                          };
                          setQuery((prev) => {
                            return {
                              ...prev,
                              ...newQuery,
                            };
                          });
                          updateQueryString(newQuery);
                          return;
                        }
                        // nếu có thì xóa
                        newQuery = { ...query, ...newQuery };
                        const filter = newQuery[field.name].filter(
                          (val) => val !== value
                        );
                        newQuery = {
                          ...newQuery,
                          [field.name]: filter,
                        };

                        setQuery((prev) => {
                          const filter = prev[field.name].filter(
                            (val) => val !== value
                          );
                          return { ...prev, [field.name]: filter };
                        });

                        // kiem tra nếu giá trị là rỗng thì xóa luôn cái property đó
                        if (query[field.name].length === 0) {
                          delete newQuery[field.name];
                          setQuery((prev) => {
                            delete query[field.name];
                            return { ...prev };
                          });
                        }

                        updateQueryString(newQuery);
                      }}
                    />
                    {value}
                  </label>
                </>
              );
            })}
          </div>
        );
      });
    }
  };
  /** Render */

  return (
    <>
      <Banner slug={category} />
      <div className="product">
        <div className="grid wide">
          <div className="row">
            <div className="col lg-3">
              <div className="filter">
                <div className="filter__field">
                  <p className="filter__heading">price</p>
                  {renderPriceRanger()}
                </div>
                {renderDynamicFilterField()}
                <button className="filter__clear" onClick={resetFilter}>
                  X Clear
                </button>
              </div>
            </div>
            <div className="col lg-9">
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
                      <div
                        className="product__card col lg-3"
                        key={products[key]._id}
                      >
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
                      forcePage={Number(query.page - 1) || 0}
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
        </div>
      </div>
    </>
  );
}

export default ProductPage;
