export const api =
  process.env.REACT_APP_MODE === "production"
    ? "https://quangtien-ecommerce-be.herokuapp.com/api"
    : "http://localhost:8080/api";
export const generatePictureUrl = (filename) => filename;
// `http://localhost:8000/public/${filename}`;
