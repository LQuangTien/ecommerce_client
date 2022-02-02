import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { isUserLoggedIn } from "./actions";
import { updateCart } from "./actions/cart.actions";
import "./App.css";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./containers/CartPage";
import CheckoutPage from "./containers/CheckoutPage";
import HomePage from "./containers/HomePage";
import OrderDetailPage from "./containers/OrderDetailPage";
import OrderPage from "./containers/OrderPage";
import ProductDetailsPage from "./containers/ProductDetailsPage";
import ProductPage from "./containers/ProductsPage";
import SearchPage from "./containers/SearchPage";
import PrivateRoute from "./helpers/privateRoute";

function App() {
  const auth = useSelector((state) => state.auth);
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
  }, [auth.authenticate, dispatch]);
  useEffect(() => {
    dispatch(updateCart());
  }, [auth.authenticate, dispatch]);
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <ScrollToTop />
          <Switch>
            <Route exact path="/" component={HomePage} />
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
            <Route path="/product/:productId" component={ProductDetailsPage} />
            <Route path="/products/:category" component={ProductPage} />
            <Route path="/search" component={SearchPage} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
