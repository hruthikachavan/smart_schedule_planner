const getWeekRange = () => {
  const start = new Date(); start.setHours(0,0,0,0);
  const end   = new Date(start); end.setDate(end.getDate()+6); end.setHours(23,59,59,999);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

module.exports = { getWeekRange };