import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API base URL
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
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // 현재 경로가 로그인 페이지인지 확인
        if (window.location.pathname !== "/login") {
          console.error("Unauthorized access - redirecting to login.");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        } else {
          console.log("로그인 페이지에서 401 발생 - 리다이렉트 안함");
        }
      }
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);
export default instance;
