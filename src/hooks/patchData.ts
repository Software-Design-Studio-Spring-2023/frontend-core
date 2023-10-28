import apiClient from "../services/api-client";

const patchData = async (updatedData: any, endpoint: string, id: number) => {
  try {
    const url = `${endpoint}/${id}`;
    const response = await apiClient.patch(url, updatedData);
    return response.data;
  } catch (error) {
    console.error("There was an error updating the database!", error);
    throw error;
  }
};

export default patchData;
