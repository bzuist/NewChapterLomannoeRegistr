const route = '/users';

const config = {
  target: "http://localhost:3000",
  changeOrigin: true,
  secure: false,
  logLevel: "debug",
};

const PROXY_CONFIG = {
  [route]: config,
}

module.exports = PROXY_CONFIG
