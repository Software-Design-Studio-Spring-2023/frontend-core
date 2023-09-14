
import useData from "./useData";

export interface User {
    id: number;
    name: string;
    loggedIn: boolean;
    userType: string;
    email: string;
    password: string;
    imageURL: string;
    encodeIP: number;
    warnings: number;
    terminated: boolean;
}  
  
const useUsers = () => (useData<User>("/all_users"))

export default useUsers