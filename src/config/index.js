const dotenv = require('dotenv');

dotenv.config();

export const config = {
  apis: {
    bos: process.env.REACT_APP_API_BOS,
  }
}