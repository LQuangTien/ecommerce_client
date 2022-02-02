import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useHistory, useParams } from "react-router-dom";
import { getByQuery } from "../../actions";
import Banner from "../../components/UI/Banner";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import queryString from "query-string";
import ReactPaginate from "react-paginate";
import { useRanger } from "react-ranger";
import "./style.css";

function ProductPage(props) {
  const categoryState = useSelector((state) => state.categories);
  const { brand } = useParams();
  const getInitField = (fieldName) => {
    if (!categoryState.categories) return;
    const category = categoryState.categories.find((category) =>
      category.filterField.find((field) => field.value.includes(brand))
    );
    return (
      category &&
      category.filterField.find((field) => field.name === fieldName).value
    );
  };
  const COLOR_LIST = getInitField("color");
  const INIT_COLORS_STATE = COLOR_LIST && Array(COLOR_LIST.length).fill(false);
  const INIT_PRICE_STATE = [0, 0];
  const RAM_LIST = getInitField("ram");
  const INIT_RAM_STATE = RAM_LIST && Array(RAM_LIST.length).fill(false);
  const ROM_LIST = getInitField("rom");
  const INIT_ROM_STATE = ROM_LIST && Array(ROM_LIST.length).fill(false);
  const ORDER_OPTIONS = [
    {
      name: "Newest",
      value: "newest",
    },
    {
      name: "Price - Low to high",
      value: "asc",
    },
    {
      name: "Price - High to low",
      value: "desc",
    },
  ];
  const history = useHistory();
  const dispatch = useDispatch();
  const { products, totalPage } = useSelector((state) => state.products);
  const search = useLocation().search;
  const { page, from, to, ram, rom, orderBy, color } =
    queryString.parse(search);
  const [price, setPrices] = useState([from || 0, to || 0]);
  const [order, setOrder] = useState(orderBy || ORDER_OPTIONS[0].value);
  const [query, setQuery] = useState(() => ({
    page,
    from,
    to,
    ram,
    rom,
    orderBy,
    color,
  }));
  const handleInitState = (param, CONST_LIST, INIT_LIST) => {
    if (!param) return INIT_LIST || [];
    const selectedIndex = param
      .split("+")
      .map((value) => CONST_LIST.findIndex((x) => x === value));
    const initState = INIT_LIST;
    selectedIndex.forEach((index) => {
      initState[index] = true;
    });
    return initState;
  };
  const [ramQuery, setRamQuery] = useState(() => {
    return handleInitState(ram, RAM_LIST, INIT_RAM_STATE);
  });
  const [romQuery, setRomQuery] = useState(() => {
    return handleInitState(rom, ROM_LIST, INIT_ROM_STATE);
  });
  const [colorQuery, setColorQuery] = useState(() => {
    return handleInitState(color, COLOR_LIST, INIT_COLORS_STATE);
  });

  const { getTrackProps, segments, handles } = useRanger({
    min: 0,
    max: 15000,
    stepSize: 500,
    values: price,
    onChange: (values) => {
      setPrices(values);
      const newQuery = { from: values[0], to: values[1] };
      setQuery({ ...query, ...newQuery });
      updateQueryString(newQuery);
    },
  });
  useEffect(() => {
    dispatch(getByQuery({ brand, page, from, to, ram, rom, orderBy }));
  }, [brand, dispatch, from, page, to, ram, rom, orderBy]);

  const handlePageClick = (activePage) => {
    const newQuery = { page: +activePage.selected + 1 };
    setQuery({ ...query, ...newQuery });
    updateQueryString(newQuery);
  };
  const updateQueryString = (newQuery) => {
    const searchString = queryString.stringify({
      ...query,
      ...newQuery,
    });
    history.push({
      search: searchString,
    });
  };
  const renderPriceRanger = () => (
    <div>
      <div
        {...getTrackProps({
          style: {
            height: "4px",
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
          }}
          min={INIT_PRICE_STATE[0]}
          max={INIT_PRICE_STATE[1]}
          step="500"
          type="number"
        />
        <input
          className="range__box"
          value={price[1]}
          onChange={(event) => {
            setPrices([price[0], event.target.value]);
          }}
          min={INIT_PRICE_STATE[0]}
          max={INIT_PRICE_STATE[1]}
          step="500"
          type="number"
        />
      </div>
    </div>
  );
  const handleFieldChange = (
    position,
    fieldQuery,
    setFieldQuery,
    FIELD_LIST,
    param
  ) => {
    const updatedCheckedState = fieldQuery.map((item, index) =>
      index === position ? !item : item
    );
    setFieldQuery(updatedCheckedState);
    const queryString = FIELD_LIST.map(
      (value, index) => updatedCheckedState[index] === true && value
    )
      .filter((x) => x)
      .join("+");
    const newQuery = { [param]: queryString };
    setQuery({ ...query, ...newQuery });
    updateQueryString(newQuery);
  };
  const resetFilter = () => {
    setPrices(INIT_PRICE_STATE);
    setRamQuery(Array(RAM_LIST.length).fill(false));
    setRomQuery(Array(ROM_LIST.length).fill(false));
    setColorQuery(Array(COLOR_LIST.length).fill(false));
    setQuery({});
    const searchString = queryString.stringify({});

    history.push({
      search: searchString,
    });
  };
  const renderMultipleFilter = (
    fieldQuery,
    setFieldQuery,
    FIELD_LIST,
    param
  ) => {
    return (
      FIELD_LIST &&
      FIELD_LIST.map((value, index) => (
        <label
          className={`filter__checkbox-label ${
            fieldQuery[index] ? "filter__checkbox-label--active" : ""
          } `}
          key={value}
        >
          <input
            className="filter__checkbox"
            type="checkbox"
            name={param}
            value={value}
            checked={fieldQuery[index]}
            onChange={() =>
              handleFieldChange(
                index,
                fieldQuery,
                setFieldQuery,
                FIELD_LIST,
                param
              )
            }
          />
          {value}
        </label>
      ))
    );
  };
  const onOrderChange = (value) => {
    setOrder(value);
    const newQuery = { orderBy: value };
    setQuery({ ...query, ...newQuery });
    updateQueryString(newQuery);
  };
  return (
    <>
      <Banner slug={brand} />
      <div className="product">
        <div className="grid wide">
          <div className="row">
            <div className="col lg-3">
              <div className="filter">
                <div className="filter__field">
                  <p className="filter__heading">ram</p>
                  {renderMultipleFilter(ramQuery, setRamQuery, RAM_LIST, "ram")}
                </div>

                <div className="filter__field">
                  <p className="filter__heading">price</p>
                  {renderPriceRanger()}
                </div>
                <div className="filter__field">
                  <p className="filter__heading">rom</p>
                  {renderMultipleFilter(romQuery, setRomQuery, ROM_LIST, "rom")}
                </div>
                <div className="filter__field">
                  <p className="filter__heading">color</p>
                  {renderMultipleFilter(
                    colorQuery,
                    setColorQuery,
                    COLOR_LIST,
                    "color"
                  )}
                </div>
                <button className="filter__clear" onClick={() => resetFilter()}>
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
                              <span className="product__info-price--current">
                                ${formatThousand(products[key].price)}
                              </span>
                              <span className="product__info-price--old">
                                ${formatThousand(12000)}
                              </span>
                            </div>
                            <div className="product__rating">
                              <IoStar />
                              <IoStar />
                              <IoStar />
                              <IoStar />
                              <IoStar />
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
                      initialPage={Number(query.page - 1) || 0}
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
