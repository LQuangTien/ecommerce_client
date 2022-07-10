import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import {
  getAll,
  getComments,
  getProductById,
  submitComment,
} from "../../actions";
import { addToCart } from "../../actions/cart.actions";
import Banner from "../../components/UI/Banner";
import Button from "../../components/UI/Button";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import { isNew } from "../../utils/isNew";
import { IoStar } from "react-icons/io5";
import "./style.css";
import ReactPaginate from "react-paginate";
import queryString from "query-string";
import axios from "../../helpers/axios";
import toDate from "../../utils/toDate";
import { authConstants } from "../../actions/constants";

/**
 * @author
 * @function ProductDetailsPage
 **/

const ProductDetailsPage = (props) => {
  const history = useHistory();
  const { socket } = props;
  const dispatch = useDispatch();
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [commentPage, setCommentPage] = useState(1);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [showReply, setShowReply] = useState("");
  const [reply, setReply] = useState("");
  const [canComment, setCanComment] = useState(true);
  const [yourComment, setYourComment] = useState(null);
  const product = useSelector((state) => state.products);
  const auth = useSelector((state) => state.auth);

  const search = useLocation().search;
  const { commentId } = queryString.parse(search);
  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);
  const {
    products,
    comments,
    totalCommentPage,
    ratings,
    avgRating,
    totalComment,
  } = useSelector((state) => state.products);
  const { productId } = useParams();

  useEffect(() => {
    if (auth.authenticate) {
      const checkCanComment = async () => {
        const response = await axios.get(
          `/product/checkUserCanComment/${productId}`
        );
        if (response.data.data.canComment === false) {
          setCanComment(false);
          setYourComment(response.data.data.comment);
        }
        return response;
      };

      checkCanComment();
    }
  }, [auth.authenticate, productId]);

  useEffect(() => {
    if (commentId && comments && products && productId) {
      const getCommentPosition = async () => {
        const res = await axios.get(
          `products/getCommentPosition/10/${productId}/${commentId}`
        );
        const { page } = res.data.data;
        if (page !== commentPage) {
          setCommentPage(() => page);
        }
        const element = document.getElementById(commentId);
        if (element) {
          setTimeout(() => {
            window.scrollTo({
              behavior: element ? "smooth" : "auto",
              top: element ? element.offsetTop : 0,
            });
          }, 100);
        }
      };
      getCommentPosition();
    }
  }, [commentId, commentPage, comments, productId, products]);

  useEffect(() => {
    const params = {
      id: productId,
    };
    dispatch(getProductById(params));
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(getComments({ id: productId, page: commentPage }));
  }, [dispatch, productId, commentPage]);

  useEffect(() => {
    if (socket) {
      const listener = (message) => {
        dispatch(getComments({ id: productId, page: 1 }));
      };
      const listener2 = () => {
        dispatch(getComments({ id: productId, page: commentPage }));
      };
      socket.on("submit", listener);
      socket.on("reply", listener2);

      return () => {
        socket.off("submit", listener);
        socket.off("reply", listener2);
      };
    }
  }, [dispatch, productId, socket]);
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

  const handleSubmitComment = async () => {
    if (auth.authenticate) {
      const data = {
        rating,
        comment,
        productId,
        productName: product.productDetails.name,
      };
      const isPositive = await isPositiveComment(comment);
      if (isPositive) {
        if (commentPage !== 1) {
          handleCommentPageChange(1);
        }
        setComment("");
        setCommentError("");
        setCanComment(false);
        socket.emit("submit", data);
      } else {
        setCommentError("Please reconsider your comment");
      }
    } else {
      dispatch({
        type: authConstants.SHOW_LOGIN_MODAL,
      });
    }

    // dispatch(submitComment({ rating, comment }));
  };

  const handleSubmitReply = (id) => {
    if (auth.authenticate) {
      const data = { commentId: id, content: reply, productId };
      setReply("");
      setShowReply(null);
      socket.emit("reply", data);
    } else {
      dispatch({
        type: authConstants.SHOW_LOGIN_MODAL,
      });
    }
  };

  const handleCommentPageChange = (activePage) => {
    const { commentId } = queryString.parse(search);
    if (commentId) {
      history.replace({
        search: "",
      });
    }
    setCommentPage(() => +activePage.selected + 1);
  };

  async function textSentimentAnalysis(comment) {
    const encodedParams = new URLSearchParams();
    encodedParams.append("text", comment);

    const options = {
      method: "POST",
      url: "https://text-sentiment.p.rapidapi.com/analyze",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Host": "text-sentiment.p.rapidapi.com",
        "X-RapidAPI-Key": "ef38a2e0a2mshc7dc123112124a5p163e08jsn6ceae79072eb",
      },
      data: encodedParams,
    };
    try {
      const response = await axios.request(options);
      console.log({ res: response.data });
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async function isPositiveComment(comment) {
    const resultAnalysisComment = await textSentimentAnalysis(comment);

    if (parseFloat(resultAnalysisComment.pos) === 1) return true;
    return false;
  }
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
                {product.productDetails.productPictures.map(
                  (picture, index) => (
                    <div key={index} className="picture__main">
                      <img alt="" src={generatePictureUrl(picture)} />
                    </div>
                  )
                )}
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
                    {product.productDetails.description
                      .split("\n")
                      .map((a, index) => (
                        <li key={index}>{a}</li>
                      ))}
                  </ul>
                </div>
                <p className="system__title">
                  <strong>System:</strong>
                </p>
                <table className="system__table">
                  <tbody>
                    {product.productDetails.categoryInfo.map((info) => (
                      <tr key={info.name} className="system__table-row">
                        <th>{info.name}</th>
                        <td>{info.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row comment">
            <p className="col lg-12 product__additional-products-tittle">
              Comments ({totalComment ?? 0})
            </p>
            <div className="col sm-12">
              <div className="row">
                <div className="col sm-3 comment__average">
                  <p className="comment__average-title">Average Rating</p>
                  <p className="comment__rating">{avgRating}/5</p>
                  <div className="comment__stars">
                    {[...Array(5)].map((star, index) => {
                      index += 1;
                      return (
                        <IoStar
                          key={index}
                          className={
                            index <= avgRating
                              ? "comment__star"
                              : "comment__star--gray"
                          }
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="col sm-3 comment__rating-bars">
                  {ratings.map((r) => (
                    <div key={r.star} className="comment__rating-bar-wrapper">
                      <div className="comment__rating-title">
                        {r.star} <IoStar className="comment__star" />
                      </div>
                      <div className="comment__rating-bar comment__rating-bar--gray">
                        <div
                          style={{ width: `${r.percent}%` }}
                          className="comment__rating-bar-percent"
                        ></div>
                      </div>
                      <div className="comment__rating-count">
                        {r.count} ({r.percent}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!canComment ? (
                <>
                  {yourComment ? (
                    <>
                      <div class="your-comment">Your comment: </div>
                      <div className="cmt cmt__your-comment">
                        <p className="cmt__username">
                          {yourComment.comment[0].userName}
                        </p>
                        <p className="cmt__stars-wrapper">
                          <span className="cmt__stars">
                            {[...Array(5)].map((star, index) => (
                              <IoStar
                                key={index}
                                className={
                                  yourComment.comment[0].rating >= index + 1
                                    ? ""
                                    : "comment__star--gray"
                                }
                              />
                            ))}
                          </span>
                          <span>
                            {" "}
                            at{" "}
                            {toDate(new Date(yourComment.comment[0].createdAt))}
                          </span>
                        </p>
                        <p className="cmt__content">
                          {yourComment.comment[0].content}
                        </p>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div className="row">
                  <div className="col sm-4 give-rating-wrapper">
                    <p className="give-rating-title">
                      How many stars do you rate this product?
                    </p>
                    <div className="give-rating-star">
                      {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                          <IoStar
                            key={index}
                            className={
                              index <= (hover || rating)
                                ? "comment__star"
                                : "comment__star--gray"
                            }
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="col sm-8">
                    <p className="cmt__heading">Leave your comment here</p>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="cmt__input"
                    ></textarea>
                    {commentError !== "" && (
                      <p
                        style={{
                          fontSize: "1.2rem",
                          color: "red",
                          paddingLeft: "0.2rem",
                          marginBottom: "10px",
                        }}
                      >
                        {commentError}
                      </p>
                    )}
                    <Button
                      onClick={handleSubmitComment}
                      className="cmt__button"
                      title={"Submit"}
                    ></Button>
                  </div>
                </div>
              )}
              <div className=" mt-12 row">
                <div className="col sm-12">
                  {comments?.length > 0 &&
                    comments.map((c, index) => (
                      <div
                        id={c.id}
                        key={c.id}
                        className={`cmt ${
                          index + 1 === comments.length
                            ? "cmt__your-comment"
                            : ""
                        }`}
                      >
                        <p className="cmt__username">{c.username}</p>
                        <p className="cmt__stars-wrapper">
                          <span className="cmt__stars">
                            {[...Array(5)].map((star, index) => (
                              <IoStar
                                key={index}
                                className={
                                  c.rating >= index + 1
                                    ? ""
                                    : "comment__star--gray"
                                }
                              />
                            ))}
                          </span>
                          <span> at {toDate(new Date(c.createdAt))}</span>
                        </p>
                        <p className="cmt__content">{c.comment}</p>
                        <p
                          className="cmt__reply"
                          onClick={() => {
                            setShowReply(c.id);
                            setReply("");
                          }}
                        >
                          Reply
                        </p>
                        {showReply === c.id && (
                          <>
                            <textarea
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                              className="cmt__input mt-8"
                            ></textarea>
                            <Button
                              onClick={() => handleSubmitReply(c.id)}
                              className="cmt__button"
                              title={"Submit"}
                            ></Button>
                          </>
                        )}
                        {c.subComment?.length > 0 &&
                          c.subComment.map((r, index) => (
                            <div key={index} className="cmt--sub">
                              <p className="cmt__username">{r.userName}</p>
                              <p className="cmt__stars-wrapper">
                                <span>At {toDate(new Date(r.createdAt))}</span>
                              </p>
                              <p className="cmt__content">{r.content}</p>
                            </div>
                          ))}
                      </div>
                    ))}
                  <div className="mt-12">
                    {comments?.length > 0 && (
                      <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={totalCommentPage}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        forcePage={Number(commentPage - 1) || 0}
                        onPageChange={handleCommentPageChange}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                      />
                    )}
                  </div>
                </div>
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
                      <Link
                        to={"/product/" + product._id}
                        className="product__card-wrapper"
                      >
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
                    <Link
                      to={"/product/" + product._id}
                      className="product__card-wrapper"
                    >
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
