import axios from "axios";
import {API_BASE_URL} from "./backend_switch";

const PROPERTY_API_URL = API_BASE_URL() + '/api/properties';

export const getMyProperties = (async (token) => {
    try {
        const response = await axios.get(PROPERTY_API_URL + '/my', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },);
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const getPropertyImages = (async (property_id) => {
    try {
        const response = await axios.get(PROPERTY_API_URL + '/image-view/' + property_id,);
        return response.data
    } catch (error) {
        console.error(error)
        return false
    }
})

export const createProperty = (async (token, property) => {
    const formData = new FormData()
    const amenities = property.amenities
    Object.keys(property).forEach((key) => {
        if (key !== 'amenities') {
            formData.append(key, property[key])
        }
    })
    if (amenities) {
        amenities.forEach((amenity) => {
            formData.append('amenities', amenity)
        })
    }

    try {
        const response = await axios.post(PROPERTY_API_URL + '/create', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        }, {timeout: 5000});
        return response.data
    } catch (error) {
        console.error("Error creating property", error)
        throw error;
    }
})

export const uploadImages = (async (token, property_id, property_images) => {
    const uploadSingleImage = async (image) => {
        const formData = new FormData();
        formData.append("image_name", image.name);
        formData.append("image", image.originFileObj);

        const response = await axios.post(PROPERTY_API_URL + '/image-create/' + property_id, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        }, {timeout: 5000});
        console.log(response)
        if (response.status !== 201 && response.status !== 200) {
            console.log(response)
            throw new Error(`Failed to upload image: ${image.name}`);
        }

        return response.data;
    };

    // Loop over images and upload them one by one
    const uploadPromises = property_images.map((image) => uploadSingleImage(image));

    try {
        const results = await Promise.all(uploadPromises);
        console.log("All images uploaded successfully", results);
    } catch (error) {
        console.error("Error uploading images:", error);
    }
})

export const deleteMyProperty = (async (token, property_id) => {
    try {
        const response = await axios.delete(PROPERTY_API_URL + '/modify/' + property_id, {
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

export const updateProperty = (async (token, property, property_id) => {
    const formData = new FormData()
    const amenities = property.amenities
    Object.keys(property).forEach((key) => {
        if (key !== 'amenities') {
            formData.append(key, property[key])
        }
    })
    if (amenities) {
        amenities.forEach((amenity) => {
            formData.append('amenities', amenity)
        })
    }
    try {
        const response = await axios.patch(PROPERTY_API_URL + '/modify/' + property_id, formData, {
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

const deleteImage = async (token, imageId) => {
    try {
        await axios.delete(PROPERTY_API_URL + '/image-delete/' + imageId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return true
    } catch (error) {
        return error
    }
}

export const deleteImages = (async (token, imageIds) => {
    const deletePromises = imageIds.map(imageId => deleteImage(token, imageId));
    console.log(deletePromises)
    try {
        await Promise.all(deletePromises);
        console.log('All images have been deleted successfully');
        return true
    } catch (error) {
        console.error('Error deleting images:', error);
        return error
    }
});

export const searchProperties = async (input) => {
    try {
        let response;
        if (typeof input === 'string' && input.startsWith("http")) {
            // If input is a URL
            response = await axios.get(input);
        } else {
            // If input is a query string
            response = await axios.get(`${PROPERTY_API_URL}/search/?${input}`);
        }
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getSingleProperty = async (propertyId) => {
    try {
        const response =  await axios.get(`${PROPERTY_API_URL}/details/${propertyId}`)
        return response.data
    } catch (error) {
        return error
    }

}
