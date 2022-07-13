import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { isUserLoggedIn, getLabels } from "./actions";
import { updateCart } from "./actions/cart.actions";
import "./App.css";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./containers/CartPage";
import CheckoutPage from "./containers/CheckoutPage";
import ComparePage from "./containers/ComparePage";
import HomePage from "./containers/HomePage";
import OrderDetailPage from "./containers/OrderDetailPage";
import OrderPage from "./containers/OrderPage";
import ProductDetailsPage from "./containers/ProductDetailsPage";
import ProductPage from "./containers/ProductsPage";
import SearchPage from "./containers/SearchPage";
import ActivePage from "./containers/ActivePage";
import PrivateRoute from "./helpers/privateRoute";
import { io } from "socket.io-client";
import { domain } from "./urlConfig";

let socket;

export const initiateSocketConnection = () => {
  socket = io(domain);
  console.log(`Connecting socket...`);
};

function App() {
  const auth = useSelector((state) => state.auth);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    initiateSocketConnection();
    dispatch(getLabels());
  }, []);

  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
  }, [auth.authenticate, dispatch]);
  useEffect(() => {
    dispatch(updateCart());
  }, [auth.authenticate, dispatch]);

  useEffect(() => {
    if (auth.authenticate) {
      console.log(token);
      socket.emit("onUserLoggedIn", token);
    }
  }, [auth.authenticate, dispatch, token]);
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <ScrollToTop />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              exact
              path="/active/:userId/:activeCode"
              component={ActivePage}
            />

            <Route path="/cart" component={CartPage} />
            <PrivateRoute path="/checkout" isAuthenticated={user}>
              <CheckoutPage />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/account/order/:_id"
              isAuthenticated={user}
            >
              <OrderDetailPage />
            </PrivateRoute>
            <PrivateRoute path="/account/order" isAuthenticated={user}>
              <OrderPage />
            </PrivateRoute>
            <Route path="/product/:productId">
              <ProductDetailsPage socket={socket} />
            </Route>
            <Route path="/products/:category" component={ProductPage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/compare" component={ComparePage} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
