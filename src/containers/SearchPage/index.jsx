import queryString from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useRanger } from "react-ranger";
import { getBySearch } from "../../actions";
import axiosInstance from "../../helpers/axios";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import { isNew } from "../../utils/isNew";
import ReactLoading from "react-loading";
import "./style.css";
const getBySearchSearchPage2 = async (params) => {
  const sort = params.orderBy
    ? {
        sortOrder: ORDER_OPTIONS.find((x) => x.value === params.orderBy)
          .sortOrder,
        sortBy: ORDER_OPTIONS.find((x) => x.value === params.orderBy).sortBy,
      }
    : {
        sortOrder: ORDER_OPTIONS[0].sortOrder,
        sortBy: ORDER_OPTIONS[0].sortBy,
      };
  const { orderBy, page, ...orderParams } = params;
  try {
    const res = await axiosInstance.get(`products/search/${params.page}/${8}`, {
      params: { ...orderParams, ...sort },
    });
    console.log(res);
    const result = {
      ...res.data.data,
      products: res.data.data.result.items.map((product) => ({
        ...product,
        price: product.salePrice,
      })),
    };
    return result;
  } catch (error) {
    console.log({ error });
  }
};
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
const INIT_PRICE_STATE = [0, 0];
function SearchPage(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const { q, page, from, to, orderBy, labels, ...otherSearchParam } =
    queryString.parse(search);
  const [metadata, setMetadata] = useState(null);
  const [loadMetadata, setLoadMetadata] = useState(true);
  const { products, totalPage, loading } = useSelector(
    (state) => state.products
  );
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [shouldChangeFilter, setShouldChangeFilter] = useState(true);
  const [price, setPrices] = useState([from || 0, to || 0]);
  const labelState = useSelector((state) => state.labels);
  /** Use State */
  const [order, setOrder] = useState(orderBy || ORDER_OPTIONS[0].value);
  const { getTrackProps, segments, handles } = useRanger({
    min: 0,
    max: 5000,
    stepSize: 100,
    values: price,
    onChange: (values) => {
      setPrices(values);
      const newQuery = fulfillQuery({ from: values[0], to: values[1] });
      setQuery((prev) => ({ ...prev, ...newQuery }));
      updateQueryString({ ...query, ...newQuery });
    },
  });

  const [searchParam, setSearchParam] = useState(() => ({
    q,
    from,
    to,
    orderBy,
    page,
    ...otherSearchParam,
  }));

  const [query, setQuery] = useState(() => {
    const paramFromURL = { ...otherSearchParam };
    Object.keys(paramFromURL).forEach((key) => {
      paramFromURL[key] = paramFromURL[key].split(",");
    });
    return { q, from, to, page, orderBy, ...paramFromURL };
  });

  const updateQueryString = useCallback((newQuery) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** End Use State */
  useEffect(() => {
    (async () => {
      dispatch(getBySearch({ ...searchParam }));
      setLoadMetadata((prev) => true);
      const { from, to, ...others } = searchParam;
      const data = await getBySearchSearchPage2({ ...others });
      setLoadMetadata((prev) => false);
      setMetadata(data.metadata);
    })();
  }, [dispatch, searchParam]);

  useEffect(() => {
    setQuery({ ...query, q });
    updateQueryString({ q });
    setMetadata((prev) => null);
    // setCategories((prev) => []);
    // setBrands((prev) => []);
    setShouldChangeFilter((prev) => true);
  }, [q]);

  const checkArrayDiff = (cate1, cate2) => {
    if (cate1.length !== cate2.length) return true;
    if (
      cate1.every(function (element, index) {
        return element === cate2[index];
      })
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!metadata) return;
    if (metadata.categories.length > 0) {
      const cateList = metadata.categories;
      if (
        checkArrayDiff(categories, cateList) &&
        shouldChangeFilter &&
        !loadMetadata
      ) {
        setCategories((prev) => cateList);
      }
    }
    if (metadata.brands.length > 0) {
      const brandList = metadata.brands;
      if (
        checkArrayDiff(brands, brandList) &&
        shouldChangeFilter &&
        !loadMetadata
      ) {
        setBrands((prev) => brandList);
      }
    }
    setShouldChangeFilter((prev) => false);
  }, [metadata, shouldChangeFilter]);

  /** Function */
  const fulfillQuery = (newQuery) => {
    const q = { ...newQuery };
    if (query.category) {
      q.category = query.category;
    }
    if (query.Brand) {
      q.Brand = query.Brand;
    }
    if (query.from) {
      q.from = query.from;
    }
    if (query.to) {
      q.to = query.to;
    }
    if (query.orderBy) {
      q.orderBy = query.orderBy;
    }

    return { ...q, ...newQuery };
  };

  const resetFilter = () => {
    setPrices(INIT_PRICE_STATE);
    setQuery({ q: query.q, page: 1 });
    setSearchParam({ q: query.q, page: 1 });
    const searchString = queryString.stringify({ q: query.q, page: 1 });
    history.push({
      search: searchString,
    });
  };

  const handlePageClick = (activePage) => {
    const newQuery = fulfillQuery({
      page: +activePage.selected + 1,
    });
    setQuery((prev) => ({ ...query, ...newQuery }));
    updateQueryString(newQuery);
  };

  const onOrderChange = (value) => {
    setOrder((prev) => value);
    const newQuery = fulfillQuery({ orderBy: value });
    setQuery({ ...query, ...newQuery });
    updateQueryString(newQuery);
  };
  /** End Function */
  const isChecked = (fieldName, value) => {
    const hasProperty = !!Object.keys(query).find((key) => key === fieldName);
    if (!hasProperty) return false;
    const isChecked = query[fieldName].includes(value);
    return isChecked;
  };
  const formatToSearchParam = (searchForQuery) => {
    const cloneSearch = { ...searchForQuery };
    Object.keys(cloneSearch).forEach((key) => {
      if (
        cloneSearch[key] &&
        Array.isArray(cloneSearch[key]) &&
        cloneSearch[key].length > 0
      ) {
        cloneSearch[key] = cloneSearch[key].join(",");
      }
    });
    return cloneSearch;
  };

  const renderCategoryFilterField = () => {
    if (categories.length <= 0) return;
    return (
      <div className="filter__field">
        <p className="filter__heading">Category</p>
        {categories.length > 0 &&
          categories.map((field) => {
            const hasField = !!Object.keys(query).find(
              (key) => key === "category"
            );

            return (
              <div style={{ display: "inline-block" }} key={field}>
                <label
                  className={`filter__checkbox-label ${
                    (() => isChecked("category", field))()
                      ? "filter__checkbox-label--active"
                      : ""
                  }  `}
                >
                  <input
                    className="filter__checkbox"
                    type="checkbox"
                    name={field}
                    onChange={() => {
                      let newQuery = fulfillQuery({ page: 1, q });
                      // kiểm tra field name có trong query chưa
                      // nếu chưa thì tạo thêm property với giá trị là một mảng, có phần tử đầu tiên là value
                      if (!hasField) {
                        newQuery = {
                          ...newQuery,
                          category: [field],
                        };
                        setQuery((prev) => ({
                          ...prev,
                          ...newQuery,
                        }));
                        updateQueryString(newQuery);
                        return;
                      }
                      // nếu rồi thì
                      // kiếm trả giá trị có trong mảng của field chưa
                      const indexValue = query.category.findIndex(
                        (val) => val === field
                      );
                      // nếu chưa thì thêm
                      if (indexValue < 0) {
                        newQuery = {
                          ...newQuery,
                          category: [...query.category, field],
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

                      const filter = newQuery.category.filter(
                        (val) => val !== field
                      );
                      newQuery = {
                        ...newQuery,
                        category: filter,
                      };

                      setQuery((prev) => {
                        const filter = prev.category.filter(
                          (val) => val !== field
                        );
                        return { ...prev, category: filter };
                      });

                      // kiem tra nếu giá trị là rỗng thì xóa luôn cái property đó
                      if (query.category.length === 0) {
                        delete newQuery.category;
                        setQuery((prev) => {
                          delete query.category;
                          return { ...prev };
                        });
                      }

                      updateQueryString(newQuery);
                    }}
                  />
                  {field}
                </label>
              </div>
            );
          })}
      </div>
    );
  };

  const renderBrandFilterField = () => {
    if (brands.length <= 0) return;
    return (
      <div className="filter__field">
        <p className="filter__heading">Brands</p>
        {brands.length > 0 &&
          brands.map((field) => {
            const hasField = !!Object.keys(query).find(
              (key) => key === "Brand"
            );

            return (
              <div style={{ display: "inline-block" }} key={field}>
                <label
                  className={`filter__checkbox-label ${
                    (() => isChecked("Brand", field))()
                      ? "filter__checkbox-label--active"
                      : ""
                  }  `}
                >
                  <input
                    className="filter__checkbox"
                    type="checkbox"
                    name={field}
                    onChange={() => {
                      let newQuery = fulfillQuery({ page: 1, q });
                      // kiểm tra field name có trong query chưa
                      // nếu chưa thì tạo thêm property với giá trị là một mảng, có phần tử đầu tiên là value
                      if (!hasField) {
                        newQuery = { ...newQuery, Brand: [field] };
                        setQuery((prev) => ({
                          ...prev,
                          ...newQuery,
                        }));
                        updateQueryString(newQuery);
                        return;
                      }
                      // nếu rồi thì
                      // kiếm trả giá trị có trong mảng của field chưa
                      const indexValue = query.Brand.findIndex(
                        (val) => val === field
                      );
                      // nếu chưa thì thêm
                      if (indexValue < 0) {
                        newQuery = {
                          ...newQuery,
                          Brand: [...query.Brand, field],
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

                      const filter = newQuery.Brand.filter(
                        (val) => val !== field
                      );
                      newQuery = {
                        ...newQuery,
                        Brand: filter,
                      };

                      setQuery((prev) => {
                        const filter = prev.Brand.filter(
                          (val) => val !== field
                        );
                        return { ...prev, Brand: filter };
                      });

                      // kiem tra nếu giá trị là rỗng thì xóa luôn cái property đó
                      if (query.Brand.length === 0) {
                        delete newQuery.Brand;
                        setQuery((prev) => {
                          delete query.Brand;
                          return { ...prev };
                        });
                      }

                      updateQueryString(newQuery);
                    }}
                  />
                  {field}
                </label>
              </div>
            );
          })}
      </div>
    );
  };

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
            const newQuery = fulfillQuery({
              from: event.target.value,
              to: price[1],
            });
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
            const newQuery = fulfillQuery({
              from: price[0],
              to: event.target.value,
            });
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

  const renderLabels = () => {
    if (labelState.labels.length > 0) {
      return (
        <div className="filter__field">
          <p className="filter__heading">Labels</p>
          {labelState.labels.map((field) => {
            const hasField = !!Object.keys(query).find(
              (key) => key === "labels"
            );
            return (
              <>
                <label
                  className={`filter__checkbox-label ${
                    (() => isChecked("labels", field.name))()
                      ? "filter__checkbox-label--active"
                      : ""
                  }  `}
                  style={
                    (() => isChecked("labels", field.name))()
                      ? {
                          color: "white",
                          borderColor: field.color,
                          backgroundColor: field.color,
                        }
                      : {
                          color: field.color,
                          borderColor: field.color,
                        }
                  }
                  key={field.name}
                >
                  <input
                    className="filter__checkbox"
                    type="checkbox"
                    name={field.name}
                    onChange={() => {
                      let newQuery = { page: 1, q };

                      // kiểm tra field name có trong query chưa
                      // nếu chưa thì tạo thêm property với giá trị là một mảng, có phần tử đầu tiên là value
                      if (!hasField) {
                        newQuery = { ...newQuery, labels: [field.name] };
                        setQuery((prev) => ({
                          ...prev,
                          ...newQuery,
                        }));
                        updateQueryString(newQuery);
                        return;
                      }
                      // nếu rồi thì
                      // kiếm trả giá trị có trong mảng của field chưa
                      const indexValue = query.labels.findIndex(
                        (val) => val === field.name
                      );
                      // nếu chưa thì thêm
                      if (indexValue < 0) {
                        newQuery = {
                          ...newQuery,
                          labels: [...query.labels, field.name],
                        };
                        setQuery((prev) => {
                          return {
                            ...prev,
                            ...newQuery,
                          };
                        });
                        updateQueryString({
                          ...query,
                          ...newQuery,
                        });
                        return;
                      }
                      // nếu có thì xóa
                      newQuery = { ...query, ...newQuery };
                      const filter = newQuery.labels.filter(
                        (val) => val !== field.name
                      );
                      newQuery = {
                        ...newQuery,
                        labels: filter,
                      };
                      console.log({ newQuery });
                      setQuery((prev) => {
                        const filter = prev.labels.filter(
                          (val) => val !== field.name
                        );
                        return { ...prev, labels: filter };
                      });

                      // kiem tra nếu giá trị là rỗng thì xóa luôn cái property đó
                      if (query.labels.length === 0) {
                        delete newQuery.labels;
                        setQuery((prev) => {
                          delete query.labels;
                          return { ...prev };
                        });
                      }

                      updateQueryString(newQuery);
                    }}
                  />
                  {field.name}
                </label>
              </>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className="product">
      <div className="grid wide">
        <div className="row">
          <div className="col lg-3 md-12">
            <div className="filter__field">
              <p className="filter__heading">price</p>
              {renderPriceRanger()}
            </div>
            <div>{renderCategoryFilterField()}</div>
            <div>{renderBrandFilterField()}</div>
            <div>{renderLabels()}</div>
            <button className="filter__clear" onClick={resetFilter}>
              X Clear
            </button>
          </div>
          <div className="col lg-9 md-12">
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
                      className="product__card col lg-3 md-6 sm-12"
                      key={products[key]._id}
                    >
                      <Link
                        to={"/product/" + products[key]._id}
                        className="product__card-wrapper"
                      >
                        <div className="product__badge">
                          {Number(products[key].sale) > 5 && (
                            <span className="product__badge-item product__badge-item--sale">
                              SALE {products[key].sale}%
                            </span>
                          )}
                          {products[key].labels &&
                            products[key].labels.length > 0 &&
                            products[key].labels.slice(0, 3).map((l) => {
                              const lab = labelState.labels.find(
                                (la) => la.name === l
                              );
                              if (lab) {
                                return (
                                  <span
                                    className="product__badge-item"
                                    style={{ color: lab.color }}
                                  >
                                    {l}
                                  </span>
                                );
                              } else {
                                return <></>;
                              }
                            })}
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
            {products.length <= 0 && !loading && (
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
            {products.length <= 0 && loading && (
              <>
                <div
                  style={{
                    margin: "200px auto auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ReactLoading
                    type={"spin"}
                    color={"#1467c1"}
                    height={"10%"}
                    width={"10%"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
