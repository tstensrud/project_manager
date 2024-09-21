import { useState } from "react";

function useToken() {
    function getToken() {
        const userToken = sessionStorage.getItem('token');
        return userToken && userToken
    }

    const [token, setToken] = useState(getToken());

    function saveToken(userToken) {
        sessionStorage.setItem('token', userToken);
        setToken(userToken);
    }

    function removeToken() {
        sessionStorage.removeItem('token');
        setToken(null);
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}

export default useToken;