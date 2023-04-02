import env from "react-dotenv";

console.log(env, '')
export const config = {
  apis: {
    bos: env.REACT_BOS_API_URL,
  }
}