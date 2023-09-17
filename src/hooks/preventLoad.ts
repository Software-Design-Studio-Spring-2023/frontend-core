//This hook prevents users from going back or refreshing a page due to their 
//info being added and being active

import { useEffect } from 'react';

const preventLoad = (backDisabled: boolean, refreshDisabled: boolean = true) => {
    useEffect(() => {
        let handleBackButtonEvent: ((e: PopStateEvent) => void) | undefined;
        let handleBeforeUnloadEvent: ((e: BeforeUnloadEvent) => void) | undefined;

        if (backDisabled) {
            handleBackButtonEvent = (e: PopStateEvent) => {
                e.preventDefault();
                window.history.pushState({}, "", window.location.pathname);
            };

            window.addEventListener("popstate", handleBackButtonEvent);
            window.history.pushState({}, "", window.location.pathname);
        }

        if (refreshDisabled) {
            handleBeforeUnloadEvent = (e: BeforeUnloadEvent) => {
                e.preventDefault();
                e.returnValue = "";
                return "";
            };

            window.addEventListener("beforeunload", handleBeforeUnloadEvent);
        }

        return () => {
            if (handleBackButtonEvent) {
                window.removeEventListener("popstate", handleBackButtonEvent);
            }

            if (handleBeforeUnloadEvent) {
                window.removeEventListener("beforeunload", handleBeforeUnloadEvent);
            }
        };
    }, [backDisabled, refreshDisabled]);
};

export default preventLoad;
