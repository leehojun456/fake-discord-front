import axios from "axios";

const instance = axios.create({
  baseURL: "http://218.233.90.252:3000", // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
instance.interceptors.response.use(
  (response) => {
    return response; // Return the response data directly
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized access (e.g., redirect to login page)
        console.error("Unauthorized access - redirecting to login.");
        // Optionally, you can redirect to the login page here
        localStorage.removeItem("accessToken"); // Clear the token
        window.location.href = "/login";
      }
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error); // Reject the promise with the error
  }
);

export default instance;
