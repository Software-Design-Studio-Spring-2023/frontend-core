import { useEffect, useState } from "react";

const getToken = () => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("http://localhost:4000/token");
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  return token;
};

export default getToken;
