const config = require("dotenv"),
  ambiente = config.config();

if (ambiente.error) {
  throw ambiente.error;
}

const { parsed: env } = ambiente;
module.exports = env;