const proxy = require("http-proxy-middleware");

const target = process.env.BACKEND_PROXY || "http://localhost:3001/";

module.exports = function (app) {
  app.use(
    proxy("/socket.io", {
      target,
      ws: true,
      logLevel: "error",
    }),

    proxy("/api", {
      target,
      headers: {Accept: "application/json"},
    }),

    proxy("/admin", {
      target,
      headers: {Accept: "application/json"},
    })
  );
};
