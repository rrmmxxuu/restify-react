import axios from "axios";
import {API_BASE_URL} from "./backend_switch";

const NOTIFICATION_URL = API_BASE_URL() + '/api/notifications/';

export const getNotification = async (token) => {
    try {
        const response = await axios.get(NOTIFICATION_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },);
        return response.data
    } catch (error) {
        return error
    }
}

export const sendNotification = async (token, receiver, message) => {
    try {
        const response = await axios.post(NOTIFICATION_URL,
            {
                receiver: receiver,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },);
        return response.data
    } catch (error) {
        return error
    }
}

export const notificationSetRead = async (token, notification_id) => {
    try {
        const response = await axios.post(NOTIFICATION_URL + 'is_read/' + notification_id,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },);
        return response.data
    } catch (error) {
        return error
    }
}