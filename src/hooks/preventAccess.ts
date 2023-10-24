//This hook prevents students accessing teacher URLs and vice versa
//and also prevents not logged in users accessing pages

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../pages/LoginForm';

const preventAccess = (userType: string) => {
    const navigate = useNavigate();
    if (currentUser?.loggedIn === false) {
        useEffect(() => {
          navigate("/");
        }, []);
    } else if (currentUser?.userType === userType) {
        useEffect(() => {
        navigate("/*");
        }, []);
    } else if (currentUser?.userType === "student" && /Android|iPhone/i.test(navigator.userAgent)) {
        useEffect(() => {
        navigate("/*");
        }, []);
    }
}

export default preventAccess