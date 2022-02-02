export const isNew = (date) => {
  // To set two dates to two variables
  const date1 = new Date(date);
  const date2 = new Date();

  // To calculate the time difference of two dates
  const Difference_In_Time = date2.getTime() - date1.getTime();

  // To calculate the no. of days between two dates
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days < 7;
};
