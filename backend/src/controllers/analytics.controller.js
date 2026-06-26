const { getUserInsights } = require('../services/analytics.service');

const getInsights = async (req, res, next) => {
  try {
    const data = await getUserInsights(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

module.exports = { getInsights };
