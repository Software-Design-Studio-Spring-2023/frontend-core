import apiClient from "./api-client";

export const update_loggedin = async (id: number, loggedIn: boolean) => {
    try {
      const response = await apiClient.patch(`/update_login/${id}`, { loggedIn });
      return response.data;
    } catch (error) {
      console.error("There was an error updating the database!", error);
      throw error;
    }
  };

export const update_warnings = async (id: number, warnings: number) => {
    try {
      const response = await apiClient.patch(`/update_warnings/${id}`, { warnings });
      return response.data;
    } catch (error) {
      console.error("There was an error updating the database!", error);
      throw error;
    }
  };

  export const get_warnings = async (id: number) => {
    try {
      const response = await apiClient.get(`/get_warnings/${id}`);
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the warning count!", error);
      throw error;
    }
  };