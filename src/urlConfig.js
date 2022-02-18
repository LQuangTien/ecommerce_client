export const api =
  process.env.REACT_APP_MODE === "production"
    ? "https://quangtien-ecommerce-be.herokuapp.com/api"
    : "http://localhost:8080/api";
export const googleApi =
  process.env.REACT_APP_MODE === "production"
    ? "255711495560-a3n44htsjq498m1oou5lmnkbkrv015c7.apps.googleusercontent.com"
    : "255711495560-p9lgiqee38atf9vd3krv0n74qpa2h2b1.apps.googleusercontent.com";

export const generatePictureUrl = (filename) => filename;
// `http://localhost:8000/public/${filename}`;
