import React, { useEffect, useState } from "react";
import { IoCartOutline, IoMenu, IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import {
  changePassword,
  forgotPassword,
  getAllCategory,
  getCart,
  googleSignin,
  login,
  signout,
  signup,
} from "../../actions";
import kinzy from "../../images/logo/kinzy.jpg";
import Anchor from "../UI/Anchor";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Modal from "../UI/Modal";
import "./style.css";
import { googleApi } from "../../urlConfig";
import FacebookLogin from "react-facebook-login";
import { authConstants } from "../../actions/constants";

const Header = (props) => {
  const [signinModal, setSigninModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [changePasswordModal, setChangePaswordModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const categoryState = useSelector((state) => state.categories);
  const { cartItems } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCart());
    if (auth.authenticate) {
      setSigninModal(false);
      setSignupModal(false);
      resetForm();
    }
  }, [auth.authenticate, dispatch]);
  useEffect(() => {
    if (auth.showLoginModal) {
      setSigninModal(true);
      resetForm();
    }
  }, [auth.showLoginModal]);
  const handleLogin = () => {
    dispatch(login({ email, password }));
  };
  const handleSignUp = () => {
    dispatch(signup({ email, password, firstName, lastName, confirmPassword }));
  };
  const handleForgotPassword = () => {
    dispatch(forgotPassword({ email }));
  };

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      setError("Password not match");
      return;
    }
    dispatch(changePassword({ email: auth.user.email, password })).then(() => {
      setChangePaswordModal(false);
      resetForm();
    });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(signout());
  };
  const handleSearch = () => {
    history.push(`/search?q=${search}&page=1`);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      history.push(`/search?q=${search}&page=1`);
    }
  };
  const responseGoogle = (response) => {
    dispatch(
      googleSignin({
        email: response.profileObj.email,
        firstName: response.profileObj.familyName,
        lastName: response.profileObj.givenName,
      })
    );
  };
  const renderSigninModal = () => {
    return (
      <Modal
        visible={signinModal}
        onClose={() => {
          resetForm();
          closeModals();
        }}
        title="Sign in"
      >
        <div className="row">
          <div className="col sm-12 md-12 lg-12">
            {auth.error && (
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "red",
                  paddingLeft: "0.2rem",
                }}
              >
                {auth.error}
              </p>
            )}
          </div>

          <div className="col sm-12 md-12 lg-12 mt-8">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 text-align-right">
            <Anchor
              title="Forgot password ?"
              onClick={() => {
                resetForm();
                closeModals();
                setForgotPasswordModal(true);
              }}
            />
          </div>

          <div className="col sm-12 md-12 lg-12 mt-16 ">
            <Button
              loading={auth.authenticating}
              title="SIGN IN"
              onClick={handleLogin}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Anchor
              title="No account? Create one here"
              onClick={() => {
                resetForm();
                closeModals();
                setSignupModal(true);
              }}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
            <GoogleLogin
              clientId={googleApi}
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              className="google-button mt-16"
              pluginName="streamy"
            />
            <p className="socials__label mt-16">Hope you have fun with us</p>
            <div className="mt-12">
              <div className="logo">
                <img src={kinzy} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  const renderError = () => {
    if (error !== "") {
      return (
        <p
          style={{
            fontSize: "1.2rem",
            color: "red",
            paddingLeft: "0.2rem",
          }}
        >
          {error}
        </p>
      );
    }
    if (auth.signupError) {
      return (
        <p
          style={{
            fontSize: "1.2rem",
            color: "red",
            paddingLeft: "0.2rem",
          }}
        >
          {auth.signupError}
        </p>
      );
    }
    if (auth.signUpSuccessMessage) {
      return (
        <p
          style={{
            fontSize: "2rem",
            color: "green",
            paddingLeft: "0.2rem",
            textAlign: "center",
          }}
        >
          {auth.signUpSuccessMessage}
        </p>
      );
    }
  };
  const renderSignupModal = () => {
    return (
      <Modal
        visible={signupModal}
        onClose={() => {
          resetForm();
          closeModals();
        }}
        title="Sign up"
      >
        <div className="row">
          <div className="col sm-12 md-12 lg-12">{renderError()}</div>
          {auth.signUpSuccessMessage !==
            "Your account has been created, please check your mail to active it" && (
            <>
              <div className="col sm-12 md-12 lg-12">
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col sm-12 md-12 lg-12 mt-16">
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="col sm-12 md-12 lg-12 mt-16">
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col sm-12 md-12 lg-12 mt-16">
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="col sm-12 md-12 lg-12 mt-16">
                <Input
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="col sm-12 md-12 lg-12 mt-16 ">
                <Button
                  title="SIGN UP"
                  onClick={handleSignUp}
                  loading={auth.signuping}
                />
              </div>
              <div className="col sm-12 md-12 lg-12 mt-16">
                <Anchor
                  title="Already have an account? Login instead here"
                  onClick={() => {
                    resetForm();
                    closeModals();
                    setSigninModal(true);
                  }}
                />
              </div>
            </>
          )}

          <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
            <p className="socials__label">Hope you have fun with us</p>
            <div className="mt-12">
              <div className="logo">
                <img src={kinzy} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  const renderForgotPasswordModal = () => {
    return (
      <Modal
        visible={forgotPasswordModal}
        onClose={() => {
          resetForm();
          closeModals();
        }}
        title="Forgot password"
      >
        <div className="row">
          <div className="col sm-12 md-12 lg-12">
            {auth.forgotPasswordError && (
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "red",
                  paddingLeft: "0.2rem",
                }}
              >
                {auth.forgotPasswordError}
              </p>
            )}
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 ">
            <Button
              title="Reset password"
              onClick={handleForgotPassword}
              loading={auth.isForgotPassword}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Anchor
              title="Go to login"
              onClick={() => {
                resetForm();
                closeModals();
                setSigninModal(true);
              }}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
            <p className="socials__label">Hope you have fun with us</p>
            <div className="mt-12">
              <div className="logo">
                <img src={kinzy} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  const renderChangePasswordModal = () => {
    return (
      <Modal
        visible={changePasswordModal}
        onClose={() => {
          resetForm();
          closeModals();
        }}
        title="Change password"
      >
        <div className="row">
          <div className="col sm-12 md-12 lg-12">
            {auth.chanagePasswordError && (
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "red",
                  paddingLeft: "0.2rem",
                }}
              >
                {auth.chanagePasswordError}
              </p>
            )}
            {error !== "" && (
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "red",
                  paddingLeft: "0.2rem",
                }}
              >
                {error}
              </p>
            )}
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 ">
            <Button
              title="Change password"
              onClick={handleChangePassword}
              loading={auth.isChangePassword}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
            <p className="socials__label">Hope you have fun with us</p>
            <div className="mt-12">
              <div className="logo">
                <img src={kinzy} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  const renderSignedInHeader = () => (
    <>
      <span className="auth__span--not-hover">Hello, {auth.user.fullName}</span>
      <Link className="auth__span" to="/account/order">
        Your orders
      </Link>
      <span className="auth__span" onClick={() => setChangePaswordModal(true)}>
        Change password
      </span>
      <span className="auth__span" onClick={handleLogout}>
        Log out
      </span>
    </>
  );
  const renderUnSignedInHeader = () => (
    <>
      <span className="auth__span" onClick={() => setSigninModal(true)}>
        Sign in
      </span>
      <span className="auth__span" onClick={() => setSignupModal(true)}>
        Register
      </span>
    </>
  );
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setError("");
  };
  const closeModals = () => {
    setSigninModal(false);
    setSignupModal(false);
    setForgotPasswordModal(false);
    setChangePaswordModal(false);
    resetForm();
    dispatch({
      type: authConstants.CLOSE_LOGIN_MODAL,
    });
  };
  const getItemQuantity = () => {
    let sum = 0;
    if (!cartItems) return 0;
    Object.keys(cartItems).forEach((key) => {
      sum += cartItems[key].quantity;
    });
    return sum;
  };
  const renderCategories = (categories) => {
    return categories.map((category) => (
      <li
        key={category._id}
        className="main-menu-item"
        onClick={() => {
          setShowMenu((prev) => false);
        }}
      >
        <Link className="main-menu-link" to={"/products/" + category.name}>
          <span>{category.name}</span>
        </Link>
      </li>
    ));
  };
  return (
    <>
      <header className="header">
        <div className="header__top">
          <div className="grid wide">
            <div className="auth">
              {auth.authenticate
                ? renderSignedInHeader()
                : renderUnSignedInHeader()}
            </div>
          </div>
        </div>
        <div className="header__middle">
          <div className="grid wide">
            <div className="header__middle-container row">
              <Link to="/" className="logo col lg-3">
                <img src={kinzy} alt="" />
              </Link>
              <div className="search-bar col lg-6">
                <Input
                  value={search}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-bar__input"
                  placeholder="Search our item here"
                />
                <button onClick={handleSearch} className="search-bar__button">
                  <IoSearchSharp className="search-bar__button-icon" />
                </button>
              </div>
              <Link to="/cart" className="cart col lg-3">
                <div className="cart__icon">
                  <IoCartOutline />
                </div>
                <div className="cart__info">
                  <p className="cart__info-label">my cart</p>
                  <span className="cart__info-count">
                    {getItemQuantity() > 1
                      ? getItemQuantity() + " items"
                      : getItemQuantity() + " item"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="header__bottom">
          <div className="grid wide menuHeader">
            <div className="row menuHeader">
              <div className="col lg-12 position-relative">
                <ul>
                  <li
                    className="main-menu-item"
                    style={{
                      fontSize: "2.8rem",
                      marginRight: "2rem",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => {
                      setShowMenu((prev) => true);
                    }}
                    onMouseLeave={() => {
                      setShowMenu((prev) => false);
                    }}
                  >
                    <IoMenu />
                    <div
                      className={`header__menu ${
                        showMenu ? "header__menu--show" : "header__menu--hide"
                      }`}
                    >
                      <ul className="header__menu-list">
                        {categoryState.categories.length > 0 &&
                          renderCategories(categoryState.categories)}
                      </ul>
                    </div>
                  </li>
                  {categoryState.categories.length > 0 &&
                    renderCategories(categoryState.categories.slice(0, 10))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      {renderSigninModal()}
      {renderSignupModal()}
      {renderForgotPasswordModal()}
      {renderChangePasswordModal()}
    </>
  );
};

export default Header;
/**'
 * {
    "Ba": "118368065952391642816",
    "wc": {
        "token_type": "Bearer",
        "access_token": "ya29.A0ARrdaM-7ve5jNCpSONWmXDrkpgunn99XiHLyPhgnsQjstRsEj1Y_XV6TUxThgw_h0lxhO3yyBLG5tgb8TiFp5eZHdiRJn7fJFF2HFrhLS6m1KlR-ogfUdD3M3NQU670D5X35rvpk1QX8RDQr8B_iayIt_Rf-",
        "scope": "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
        "login_hint": "AJDLj6JUa8yxXrhHdWRHIV0S13cArko_tYPTwxqWXJ9a2aHaR_b05cDfEj3s0wcShq9vltrrehSR24aFvr_NJFhKfPSJyF2xPg",
        "expires_in": 3599,
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0NTBhMzVhMjA4MWZhYTFkOWFlMWQyZDc1YTBmMjNkOTFkZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjU1NzExNDk1NTYwLXA5bGdpcWVlMzhhdGY5dmQza3J2MG43NHFwYTJoMmIxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjU1NzExNDk1NTYwLXA5bGdpcWVlMzhhdGY5dmQza3J2MG43NHFwYTJoMmIxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MzY4MDY1OTUyMzkxNjQyODE2IiwiZW1haWwiOiJxdWFuZ3RpZW5jbG9uZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ik9kTHdFVFNfcGRta1FMYmdESExBSWciLCJuYW1lIjoiTMawdSBUaeG6v24iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKeERYNEZmY1o4TEtvLXh4TURTRllUQm5weW9acmoydUlLYzd3U3g9czk2LWMiLCJnaXZlbl9uYW1lIjoiTMawdSIsImZhbWlseV9uYW1lIjoiVGnhur9uIiwibG9jYWxlIjoidmkiLCJpYXQiOjE2NDQxNDQwMjEsImV4cCI6MTY0NDE0NzYyMSwianRpIjoiMjc4NWI3ZTIxMmQzOWZlYmM4MDQ1ZDdjZjhiOGJhZGFiNjQwODI5ZSJ9.Z28DZ0xSXWblhe7woypg8WyJnZe0JexQ-X7uMEWMP5MAjk8kBo9qAeSuS3NlFhoWsOZYn5PraDpxxjOdQ2dVFyvKO93ETbeth9nD5bRlyQ4fVj_RLvxIYMCt3grznWg5by1mYOTCAOomTbKh1rqepC5yaDwMxpIYA1bOBldAg2Tg8KShfQD-lInT1yc_3-hw5D57BXOSpMHdY9XbD3xTmiccbvjl-OWCU9f6pIkalNxtAHFrGdYjDkhEZjky1V_n1GpqADHJhrpGilgAtaiNnbe9ztWTAZAJMCaj8UDjrzSIoD5Lg1eqnTYVwkNoqoryKs75sM82tbsN5BQoSmZw1g",
        "session_state": {
            "extraQueryParams": {
                "authuser": "6"
            }
        },
        "first_issued_at": 1644144020396,
        "expires_at": 1644147619396,
        "idpId": "google"
    },
    "Du": {
        "FW": "118368065952391642816",
        "tf": "Lưu Tiến",
        "VX": "Lưu",
        "iW": "Tiến",
        "eN": "https://lh3.googleusercontent.com/a/AATXAJxDX4FfcZ8LKo-xxMDSFYTBnpyoZrj2uIKc7wSx=s96-c",
        "tv": "quangtienclone@gmail.com"
    },
    "googleId": "118368065952391642816",
    "tokenObj": {
        "token_type": "Bearer",
        "access_token": "ya29.A0ARrdaM-7ve5jNCpSONWmXDrkpgunn99XiHLyPhgnsQjstRsEj1Y_XV6TUxThgw_h0lxhO3yyBLG5tgb8TiFp5eZHdiRJn7fJFF2HFrhLS6m1KlR-ogfUdD3M3NQU670D5X35rvpk1QX8RDQr8B_iayIt_Rf-",
        "scope": "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
        "login_hint": "AJDLj6JUa8yxXrhHdWRHIV0S13cArko_tYPTwxqWXJ9a2aHaR_b05cDfEj3s0wcShq9vltrrehSR24aFvr_NJFhKfPSJyF2xPg",
        "expires_in": 3599,
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0NTBhMzVhMjA4MWZhYTFkOWFlMWQyZDc1YTBmMjNkOTFkZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjU1NzExNDk1NTYwLXA5bGdpcWVlMzhhdGY5dmQza3J2MG43NHFwYTJoMmIxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjU1NzExNDk1NTYwLXA5bGdpcWVlMzhhdGY5dmQza3J2MG43NHFwYTJoMmIxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MzY4MDY1OTUyMzkxNjQyODE2IiwiZW1haWwiOiJxdWFuZ3RpZW5jbG9uZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ik9kTHdFVFNfcGRta1FMYmdESExBSWciLCJuYW1lIjoiTMawdSBUaeG6v24iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKeERYNEZmY1o4TEtvLXh4TURTRllUQm5weW9acmoydUlLYzd3U3g9czk2LWMiLCJnaXZlbl9uYW1lIjoiTMawdSIsImZhbWlseV9uYW1lIjoiVGnhur9uIiwibG9jYWxlIjoidmkiLCJpYXQiOjE2NDQxNDQwMjEsImV4cCI6MTY0NDE0NzYyMSwianRpIjoiMjc4NWI3ZTIxMmQzOWZlYmM4MDQ1ZDdjZjhiOGJhZGFiNjQwODI5ZSJ9.Z28DZ0xSXWblhe7woypg8WyJnZe0JexQ-X7uMEWMP5MAjk8kBo9qAeSuS3NlFhoWsOZYn5PraDpxxjOdQ2dVFyvKO93ETbeth9nD5bRlyQ4fVj_RLvxIYMCt3grznWg5by1mYOTCAOomTbKh1rqepC5yaDwMxpIYA1bOBldAg2Tg8KShfQD-lInT1yc_3-hw5D57BXOSpMHdY9XbD3xTmiccbvjl-OWCU9f6pIkalNxtAHFrGdYjDkhEZjky1V_n1GpqADHJhrpGilgAtaiNnbe9ztWTAZAJMCaj8UDjrzSIoD5Lg1eqnTYVwkNoqoryKs75sM82tbsN5BQoSmZw1g",
        "session_state": {
            "extraQueryParams": {
                "authuser": "6"
            }
        },
        "first_issued_at": 1644144020396,
        "expires_at": 1644147619396,
        "idpId": "google"
    },
    "tokenId": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0NTBhMzVhMjA4MWZhYTFkOWFlMWQyZDc1YTBmMjNkOTFkZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjU1NzExNDk1NTYwLXA5bGdpcWVlMzhhdGY5dmQza3J2MG43NHFwYTJoMmIxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjU1NzExNDk1NTYwLXA5bGdpcWVlMzhhdGY5dmQza3J2MG43NHFwYTJoMmIxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MzY4MDY1OTUyMzkxNjQyODE2IiwiZW1haWwiOiJxdWFuZ3RpZW5jbG9uZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ik9kTHdFVFNfcGRta1FMYmdESExBSWciLCJuYW1lIjoiTMawdSBUaeG6v24iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKeERYNEZmY1o4TEtvLXh4TURTRllUQm5weW9acmoydUlLYzd3U3g9czk2LWMiLCJnaXZlbl9uYW1lIjoiTMawdSIsImZhbWlseV9uYW1lIjoiVGnhur9uIiwibG9jYWxlIjoidmkiLCJpYXQiOjE2NDQxNDQwMjEsImV4cCI6MTY0NDE0NzYyMSwianRpIjoiMjc4NWI3ZTIxMmQzOWZlYmM4MDQ1ZDdjZjhiOGJhZGFiNjQwODI5ZSJ9.Z28DZ0xSXWblhe7woypg8WyJnZe0JexQ-X7uMEWMP5MAjk8kBo9qAeSuS3NlFhoWsOZYn5PraDpxxjOdQ2dVFyvKO93ETbeth9nD5bRlyQ4fVj_RLvxIYMCt3grznWg5by1mYOTCAOomTbKh1rqepC5yaDwMxpIYA1bOBldAg2Tg8KShfQD-lInT1yc_3-hw5D57BXOSpMHdY9XbD3xTmiccbvjl-OWCU9f6pIkalNxtAHFrGdYjDkhEZjky1V_n1GpqADHJhrpGilgAtaiNnbe9ztWTAZAJMCaj8UDjrzSIoD5Lg1eqnTYVwkNoqoryKs75sM82tbsN5BQoSmZw1g",
    "accessToken": "ya29.A0ARrdaM-7ve5jNCpSONWmXDrkpgunn99XiHLyPhgnsQjstRsEj1Y_XV6TUxThgw_h0lxhO3yyBLG5tgb8TiFp5eZHdiRJn7fJFF2HFrhLS6m1KlR-ogfUdD3M3NQU670D5X35rvpk1QX8RDQr8B_iayIt_Rf-",
    "profileObj": {
        "googleId": "118368065952391642816",
        "imageUrl": "https://lh3.googleusercontent.com/a/AATXAJxDX4FfcZ8LKo-xxMDSFYTBnpyoZrj2uIKc7wSx=s96-c",
        "email": "quangtienclone@gmail.com",
        "name": "Lưu Tiến",
        "givenName": "Lưu",
        "familyName": "Tiến"
    }
}
 */
