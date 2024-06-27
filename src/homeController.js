let name = "John";

const getHome = (_req, res) => {
  res.json({
    data: `${new Date().toISOString()} - Hello ${name}`,
  });
};

const setName = (req, res) => {
  name = req.body.data.name;
  res.json({
    data: {
      status: 1,
    },
  });
};

module.exports = {
  getHome,
  setName
};
