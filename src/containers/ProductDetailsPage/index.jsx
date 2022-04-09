import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { Link, useParams, useLocation } from "react-router-dom";
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

/**
 * @author
 * @function ProductDetailsPage
 **/

const ProductDetailsPage = (props) => {
  const { socket } = props;
  const dispatch = useDispatch();
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentPage, setCommentPage] = useState(1);
  const [comment, setComment] = useState("");
  const [showReply, setShowReply] = useState("");
  const [reply, setReply] = useState("");
  const product = useSelector((state) => state.products);
  const auth = useSelector((state) => state.auth);

  const search = useLocation().search;
  const { commentId } = queryString.parse(search);
  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);
  const { products, comments, totalCommentPage } = useSelector(
    (state) => state.products
  );
  const { productId } = useParams();

  useEffect(() => {
    if (commentId && comments && products && productId) {
      const getCommentPosition = async () => {
        const res = await axios.get(
          `products/getCommentPosition/10/${productId}/${commentId}`
        );
        console.log(res.data);
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
  }, [commentId, comments, productId, products]);

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
      socket.on("submit", listener);

      return () => socket.off("submit", listener);
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

  const handleSubmitComment = () => {
    if (auth.authenticate) {
      const data = {
        rating,
        comment,
        productId,
        productName: product.productDetails.name,
      };
      console.log(data);
      socket.emit("submit", data);
    } else {
      alert("please login");
    }

    // dispatch(submitComment({ rating, comment }));
  };

  const handleSubmitReply = (id) => {
    console.log({ id, reply });
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
          <div className="row comment">
            <p className="col lg-12 product__additional-products-tittle">
              Comments (0)
            </p>
            <div className="col sm-12">
              <div className="row">
                <div className="col sm-3 comment__average">
                  <p className="comment__average-title">Average Rating</p>
                  <p className="comment__rating">5/5</p>
                  <div className="comment__stars">
                    <IoStar className="comment__star" />
                    <IoStar className="comment__star" />
                    <IoStar className="comment__star" />
                    <IoStar className="comment__star" />
                    <IoStar className="comment__star--gray" />
                  </div>
                </div>
                <div className="col sm-3 comment__rating-bars">
                  <div className="comment__rating-bar-wrapper">
                    <div className="comment__rating-title">
                      5 <IoStar className="comment__star" />
                    </div>
                    <div className="comment__rating-bar"></div>
                    <div className="comment__rating-count">9</div>
                  </div>
                  <div className="comment__rating-bar-wrapper">
                    <div className="comment__rating-title">
                      4 <IoStar className="comment__star" />
                    </div>
                    <div className="comment__rating-bar"></div>
                    <div className="comment__rating-count">4</div>
                  </div>
                  <div className="comment__rating-bar-wrapper">
                    <div className="comment__rating-title">
                      3 <IoStar className="comment__star" />
                    </div>
                    <div className="comment__rating-bar"></div>
                    <div className="comment__rating-count">7</div>
                  </div>
                  <div className="comment__rating-bar-wrapper">
                    <div className="comment__rating-title">
                      2 <IoStar className="comment__star" />
                    </div>
                    <div className="comment__rating-bar"></div>
                    <div className="comment__rating-count">3</div>
                  </div>
                  <div className="comment__rating-bar-wrapper">
                    <div className="comment__rating-title">
                      1 <IoStar className="comment__star" />
                    </div>
                    <div className="comment__rating-bar comment__rating-bar--gray"></div>
                    <div className="comment__rating-count">2</div>
                  </div>
                </div>
              </div>
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
                  <Button
                    onClick={handleSubmitComment}
                    className="cmt__button"
                    title={"Submit"}
                  ></Button>
                </div>
              </div>
              <div className="row">
                <div className="col sm-12">
                  {comments[0] &&
                    comments.map((c, index) => (
                      <div id={c.id} key={c.id} className="cmt">
                        <p className="cmt__username">{c.username}</p>
                        <p className="cmt__stars-wrapper">
                          <span className="cmt__stars">
                            {[...Array(5)].map((star, index) => (
                              <IoStar
                                className={
                                  c.rating >= index + 1
                                    ? ""
                                    : "comment__star--gray"
                                }
                              />
                            ))}
                          </span>
                          <span>
                            {" "}
                            at {new Date(c.createdAt).toLocaleString("vi-VN")}
                          </span>
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
                        {c.replies.map((r) => (
                          <div className="cmt--sub">
                            <p className="cmt__username">{r.username}</p>
                            <p className="cmt__stars-wrapper">
                              <span>At 19/01/2022</span>
                            </p>
                            <p className="cmt__content">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  {comments[0] && (
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={totalCommentPage}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      forcePage={Number(commentPage - 1) || 0}
                      onPageChange={(activePage) =>
                        setCommentPage(() => +activePage.selected + 1)
                      }
                      containerClassName={"pagination"}
                      activeClassName={"active"}
                    />
                  )}
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
