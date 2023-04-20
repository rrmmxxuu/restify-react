import axios from "axios";
import {API_BASE_URL} from "./backend_switch";

const USER_INFO_URL = API_BASE_URL() + '/api/accounts/user';
const PROFILE_URL = API_BASE_URL() + '/api/accounts/profile';

export const getUserInfo = async (token) => {
    try {
        const response = await axios.get(USER_INFO_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },);
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
};

export const getUserProfile = async (token) => {
    try {
        const response = await axios.get(PROFILE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export const updateUserInfo = async (token, info) => {
    try {
        const response = await axios.put(USER_INFO_URL,
            {
                email: info.email,
                first_name: info.firstName,
                last_name: info.lastName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updateUserProfile = async (token, profile) => {
    const formData = new FormData()

    if (profile.phone) {
        formData.append("phone", profile.phone)
    }
    if (profile.dateOfBirth) {
        formData.append("date_of_birth", profile.dateOfBirth)
    }
    if (profile.avatar) {
        console.log(profile.avatar)
        formData.append("avatar", profile.avatar)
    }
    if (profile.gender) {
        formData.append("gender", profile.gender)
    }

    try {
        const response = await axios.patch(PROFILE_URL, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        }, {timeout: 5000});
        return response.data
    } catch (error) {
        console.error("Error uploading", error)
        throw error;
    }
}

