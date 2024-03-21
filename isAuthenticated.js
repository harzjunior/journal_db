module.exports = {
  isLoggedIn: localStorage.getItem("token") !== null,
};
