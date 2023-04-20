import axios from "axios";
import {API_BASE_URL} from "./backend_switch";

const RESERVATION_API_URL = API_BASE_URL() + '/api/reservations';

export const getMyReservations = (async (token) => {
    try {
        const response = await axios.get(RESERVATION_API_URL + '/my', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },);
        console.log(response);
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const getPropertyReservations = (async (property_id) => {
    try {
        const response = await axios.get(RESERVATION_API_URL + '/details/' + property_id,);
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const createReservation = (async (token, reservation, propertyid) => {
    const formData = new FormData()
    const start_date = reservation.dateRange[0].format("YYYY-MM-DD")
    const end_date = reservation.dateRange[1].format("YYYY-MM-DD")
    Object.keys(reservation).forEach((key) => {
        if(key !== 'dateRange') {
            formData.append(key, reservation[key])
        }
    })
    formData.append('start_date', start_date)
    formData.append('end_date', end_date)
    for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    console.log(RESERVATION_API_URL + '/create/' + propertyid)
    try {
        const response = await axios.post(RESERVATION_API_URL + '/create/' + propertyid, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        }, {timeout: 5000});
        console.log(response)
        return response.data
    } catch (error) {
        console.error("Error creating reservation", error)
        throw error;
    }
})


export const deleteMyReservation = (async (token, reservationID) => {
    try {
        const response = await axios.delete(RESERVATION_API_URL + '/UD/' + reservationID, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },)
        console.log(response)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
})



