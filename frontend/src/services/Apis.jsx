// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = "https://swapskill-3546.onrender.com";
// const BASE_URL = "http://localhost:5001";
//https://swapskill-3546.onrender.com
export const authEndpoits = {
  SIGNUP_API: `${BASE_URL}/api/v1/auth/signUp`,
  SIGNIN_API: `${BASE_URL}/api/v1/auth/login`,

};


export const userEndpoints={
GET_USER_DEL :`${BASE_URL}/api/v1/auth/getUserDetails`

}

