const getHome = (_req, res) => {
  res.json({
    data: new Date().toISOString(),
  });
};

module.exports = {
  getHome,
};
