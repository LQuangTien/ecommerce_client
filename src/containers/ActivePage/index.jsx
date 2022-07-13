import React, { useEffect, useState } from "react";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { activeAccount } from "../../actions";
import "./style.css";
function ActivePage(props) {
  const dispatch = useDispatch();
  const { userId, activeCode } = useParams();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId && activeCode) {
      dispatch(activeAccount(userId, activeCode));
    }
  }, [userId, activeCode, dispatch]);
  return (
    <div className="grid wide">
      <div className="row" style={{ justifyContent: "center" }}>
        <div className="col lg-12">
          <div
            style={{
              fontSize: "2rem",
              textAlign: "center",
              paddingTop: "150px",
              paddingBottom: "150px",
            }}
          >
            {auth.activeSuccessMessage && (
              <>
                <div style={{ color: "green", fontSize: "12rem" }}>
                  <IoCheckmarkCircleSharp />
                </div>
                <p>Congratulation! {auth.activeSuccessMessage}</p>
                <p>
                  <a
                    style={{
                      fontSize: "1.5rem",
                      textDecoration: "none",
                      color: "var(--primary)",
                    }}
                    href="/"
                  >
                    Back to home
                  </a>
                </p>
              </>
            )}
            {auth.activeErrorMessage && (
              <>
                <div style={{ color: "red", fontSize: "12rem" }}>
                  <IoCloseCircleSharp />
                </div>
                <p style={{ color: "red" }}>{auth.activeErrorMessage}</p>
                <p>
                  <a
                    style={{
                      fontSize: "1.5rem",
                      textDecoration: "none",
                      color: "var(--primary)",
                    }}
                    href="/"
                  >
                    Back to home
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ActivePage;
