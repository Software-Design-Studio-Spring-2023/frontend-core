//The User object and lift of users from the database are exported from here

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
    ready: boolean;
    warningOne: string;
    warningTwo: string;
}  
  
const useUsers = () => (useData<User>("/all_users"))

export default useUsers