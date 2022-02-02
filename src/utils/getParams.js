export default function getParams(query) {
  const queryString = query.split("?")[1];
  if (queryString.length > 0) {
    const params = queryString.split("&");
    return params.reduce((accumulator, currentParam) => {
      const keyValue = currentParam.split("=");
      accumulator[keyValue[0]] = keyValue[1];
      return accumulator;
    }, {});
  }
}
