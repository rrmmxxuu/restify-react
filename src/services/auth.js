import axios from "axios";
import {API_BASE_URL} from "./backend_switch";

const REG_API_URL =  '/api/accounts/register';
const AUTH_API_URL = '/api/auth/token';

export const signup = (email, first_name, last_name, password) => {
    return axios
        .post(REG_API_URL, {
            email: email,
            first_name: first_name,
            last_name: last_name,
            password: password
        },)
        .then((response) => {
            if (response.headers.status === 200) {
            }
            return response.data;
        })
}

export const login = async (email, password, remember) => {
    try {
        const response = await axios.post(AUTH_API_URL + '/get', {
            email: email,
            password: password,
        });

        if (remember) {
            localStorage.setItem('token', JSON.stringify(response.data));
            return '200';
        } else {
            sessionStorage.setItem('token', JSON.stringify(response.data));
            return '200';
        }
    } catch (error) {
        // Check for network error
        if (error.message === 'Request failed with status code 401') {
            return '401'
        } else if (error.message === 'Network Error') {
            console.error('Network error occurred:', error);
            return 'ERR_NETWORK';
        } else {
            console.error('An error occurred:', error);
            return 'ERR_UNKNOWN';
        }
    }
};


export const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
}

export const isAuthed = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
        const parsedToken = JSON.parse(token).access;
        try {
            const response = await axios.post(AUTH_API_URL + '/verify', {
                token: parsedToken,
            });
            if (Object.keys(response.data).length === 0) {
                return parsedToken;
            } else {
                return await refreshToken();
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    } else {
        return false;
    }
};


export const refreshToken = async () => {
    const refresh_token = JSON.parse(localStorage.getItem('token')).refresh
    return axios
        .post(AUTH_API_URL + '/refresh', {
            refresh: refresh_token
        })
        .then((response) => {
            if (response.data.access) {
                localStorage.removeItem('token');
                let new_token_pair = response.data;
                new_token_pair["refresh"] = refresh_token;
                localStorage.setItem('token', JSON.stringify(new_token_pair));
                return new_token_pair["access"]
            }
        })
        .catch((error) => {
            console.error(error)
            return false
        })
}

