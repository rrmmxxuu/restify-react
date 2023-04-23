import axios from "axios";
import {API_BASE_URL} from "./backend_switch";

const COMMENTS_API_URL = API_BASE_URL() + '/api/comments';

export const getReservationComments = (async (reservationID) => {
    try {
        const response = await axios.get(COMMENTS_API_URL + '/details/' + reservationID,);
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const getComment = (async (commentID) => {
    try {
        const response = await axios.get(COMMENTS_API_URL + '/get/' + commentID,
            )
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const getPropertyComments = (async (property_id) => {
    try {
        const response = await axios.get(COMMENTS_API_URL + '/property/' + property_id,);
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const createComments = (async (token, reservationID, comment) => {
    try {
        const response = await axios.post(COMMENTS_API_URL + '/create/' + reservationID, comment, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        }, {timeout: 5000});
        return response.data
    } catch (error) {
        console.error("Error creating Comments", error)
        throw error;
    }
})

export const updateComment = (async (token, comment) => {
    try {
        const response = await axios.patch(COMMENTS_API_URL + '/UD/' + comment.id,
            {content: comment.content}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        },)
        return response.data
    } catch (error) {
        console.error(error)
        return error
    }
})

export const deleteComment = (async (token, CommentID) => {
    try {
        await axios.delete(COMMENTS_API_URL + '/UD/' + CommentID, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
})