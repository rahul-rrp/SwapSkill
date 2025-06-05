import { authEndpoits,userEndpoints } from "../Apis";
import axios from "axios";
import toast from "react-hot-toast";
import { CiGlass } from "react-icons/ci";
const { SIGNIN_API, SIGNUP_API } = authEndpoits;
const {GET_USER_DEL} =userEndpoints


export const signIn = async (email, password, navigate, setIsAuthenticated) => {
  // Show loading toast
  const toastId = toast.loading("Processing...");

  try {
    const response = await axios.post(SIGNIN_API, { email, password });

    // Save token and show success message
    const { token } = response.data;

    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    toast.success("LogIn Successfully", { id: toastId });
    navigate("/");
  } catch (error) {
    // Handle error
    console.log(error);
    toast.error(error.response?.data?.message || "Login Failed", {
      id: toastId,
    });
  }
};

export const signUp = async (data, navigate) => {
  const toastId = toast.loading("Signing Up...");

  try {
       console.log(data.confirmPassword);
    const response = await axios.post(SIGNUP_API, {
   
      
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      
      skillsOffered: data.skillsOffered, // should be an array
      bio: data.bio,
      confirmPassword:data.confirm_password,
    
    });

    toast.success("Sign Up Successfully!", { id: toastId });
    navigate("/signin");
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(error.response?.data?.message || "Sign Up Failed", {
      id: toastId,
    });
  }
};


export const getUserDetails = async () => {
  try {
    const token = localStorage.getItem("token");

    console.log(token)
    const response = await axios.get(GET_USER_DEL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
console.log(response.data);
    return response.data; 

  } catch (error) {
    console.error("Error fetching user details:", error.response?.data || error.message);
    return null;
  }
};



