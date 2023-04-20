import React, {useEffect, useState} from 'react';
import {AutoComplete, Button, Form, Input, InputNumber, message, Modal, Select, Typography, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {deleteImage, deleteImages, getPropertyImages, updateProperty, uploadImages,} from '../../../services/property';
import {isAuthed} from '../../../services/auth';
import {amenityChoices, commonCities, propertyTypes, provinceChoices} from "../../../utils/constants";

const {Option} = Select;
const {useForm} = Form;
const {Title} = Typography;

export const EditPropertyForm = ({property, onDiscard, onUpdate}) => {
    const [initialThumbnail, setInitialThumbnail] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState([]);
    const [thumbnailSelected, setThumbnailSelected] = useState(false);
    const [thumbnailChanged, setThumbnailChanged] = useState(false)
    const [imageList, setImageList] = useState([]);
    const [initialImageList, setInitialImageList] = useState([]);
    const [loading, setLoading] = useState(false)
    // Skipped: thumbnail-related states and other states

    const [form] = useForm();

    // Skipped: Constants, handlePostalCodeChange, handleThumbnailChange, handleThumbnailPreview, handleImageChange, handleImagePreview
    const PROVINCE_CHOICES = provinceChoices()
    const PROPERTY_TYPES = propertyTypes()
    const AMENITY_CHOICES = amenityChoices()
    const COMMON_CITIES = commonCities

    useEffect(() => {
        if (property) {
            const initialThumbnail = {
                uid: '-1',
                name: 'thumbnail',
                status: 'done',
                url: property.thumbnail,
            };
            setInitialThumbnail(initialThumbnail)
            setThumbnailUrl([initialThumbnail]);
            setThumbnailSelected(true);

            const fetchImages = async () => {
                const property_id = property.property_id;
                const fetchedImages = await getPropertyImages(property_id);

                // Format fetched images
                const formattedImages = fetchedImages.map((img) => {
                    return {
                        uid: img.id,
                        name: img.image_name,
                        status: 'done',
                        url: img.image,
                    };
                });
                setInitialImageList(formattedImages)
                setImageList(formattedImages);
            };
            fetchImages()
        }
    }, [property]);

    const handlePostalCodeChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        form.setFieldsValue({postal_code: value});
    };

    const handleThumbnailChange = ({fileList}) => {
        if (fileList.length === 0) {
            setThumbnailSelected(false);
            setThumbnailUrl([])
            return;
        }
        setThumbnailSelected(true);
        setThumbnailUrl(fileList);
        setThumbnailChanged(true);
    }

    const handleThumbnailPreview = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return false;
    };

    const handleImageChange = ({fileList}) => {
        setImageList(fileList);
    };

    const handleImagePreview = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return false;
    };

    const handleSubmit = (values) => {
        setLoading(true);

        if (!initialThumbnail) {
            const thumbnailChanged = initialThumbnail.url !== thumbnailUrl[0]?.url;
            if (thumbnailChanged) {
                values.thumbnail = thumbnailUrl[0].originFileObj;
            }
        }

        const addedImages = imageList.filter((img) => !img.url || !initialImageList.find((initialImg) => initialImg.uid === img.uid));
        const removedImages = initialImageList.filter((initialImg) => !imageList.find((img) => img.uid === initialImg.uid));
        const removedImagesId = removedImages.map(item => item.uid)

        if (!thumbnailChanged) {
            delete values.thumbnail
        }
        delete values.property_images


        isAuthed()
            .then((token) => {
                return updateProperty(token, values, property.property_id).then(
                    (submitProperty) => ({
                        token,
                        submitProperty,
                    }),
                );
            })
            .then(async ({token, submitProperty}) => {
                const property_id = submitProperty.property_id;

                if (addedImages) {
                    await uploadImages(token, property_id, addedImages);
                }
                if (removedImagesId) {
                    console.log(removedImagesId)
                    await deleteImages(token, removedImagesId)
                }
            })
            .then(() => {
                message.success('Successfully updated the property!');
                setLoading(false);
                setTimeout(() => {
                    onUpdate();
                }, 2000);
            })
            .catch((error) => {
                message.error('Something went wrong... Please try again later');
                console.error('Error:', error);
                setLoading(false);
            });
    };

    const handleDiscard = () => {
        Modal.confirm({
            title: 'Discard Changes',
            content: 'Are you sure you want to discard changes?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                onDiscard();
            },
        });
    }

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <>
            <Title>
                Edit {property.title}
            </Title>
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                form={form}
                initialValues={property}
            >
                {/* Skipped: Form items identical to AddPropertyForm */}
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{required: true, message: 'Please enter the title'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{required: true, message: 'Please enter the address'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="City"
                    name="city"
                    rules={[{required: true, message: 'Please enter the city'}]}
                >
                    <AutoComplete
                        options={COMMON_CITIES()}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    >
                        <Input/>
                    </AutoComplete>
                </Form.Item>

                <Form.Item
                    label="Province"
                    name="province"
                    rules={[{required: true, message: 'Please select the province'}]}
                >
                    <Select
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {PROVINCE_CHOICES.map((province) => (
                            <Option key={province.value} value={province.value}>
                                {province.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Postal code"
                    name="postal_code"
                    rules={[{required: true, message: 'Please enter the postal code'},
                        {
                            pattern: /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/,
                            message: 'Please enter a valid Canadian postal code',
                        },
                    ]}
                >
                    <Input maxLength={6} onChange={handlePostalCodeChange}/>
                </Form.Item>

                <Form.Item
                    label="Property type"
                    name="property_type"
                    rules={[{required: true, message: 'Please select the property_type'}]}
                >
                    <Select>
                        {PROPERTY_TYPES.map((type) => (
                            <Option key={type.value} value={type.value}>
                                {type.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{required: true, message: 'Please enter the price'},
                    ]}
                >
                    <InputNumber prefix="CAD $" step={1} style={{width: '100%'}}/>
                </Form.Item>

                <Form.Item
                    label="Number of bedrooms"
                    name="num_bedrooms"
                    rules={[{required: true, message: 'Please enter the number of bedrooms'},
                    ]}
                >
                    <InputNumber min={0} step={1} style={{width: '100%'}}/>
                </Form.Item>

                <Form.Item
                    label="Square feet"
                    name="sqft"
                    rules={[{required: true, message: 'Please enter the square feet'},
                    ]}
                >
                    <InputNumber min={0} step={1} style={{width: '100%'}}/>
                </Form.Item>

                <Form.Item
                    label="Amenities available"
                    name="amenities"
                >
                    <Select
                        mode="multiple"
                        style={{width: '100%'}}
                        placeholder="Select amenities available"
                        optionLabelProp="label"
                    >
                        {AMENITY_CHOICES.map((amenities) => (
                            <Option key={amenities.value} value={amenities.value} label={amenities.label}>
                                {amenities.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Thumbnail"
                    name="thumbnail"
                    valuePropName="file"
                    getValueFromEvent={(e) => e.file}
                    required={true}
                    rules={[{
                        validator: (_, value) => {
                            if (thumbnailSelected) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Please upload a thumbnail'));
                        },
                    },
                    ]}
                >
                    <Upload
                        accept="image/*"
                        listType="picture-card"
                        fileList={thumbnailUrl}
                        beforeUpload={handleThumbnailPreview}
                        onChange={handleThumbnailChange}
                        maxCount={1}>
                        {thumbnailUrl.length >= 1 ? null : uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item label="Property Images" name="property_images">
                    <Upload
                        accept="image/*"
                        listType="picture-card"
                        fileList={imageList}
                        onChange={handleImageChange}
                        beforeUpload={handleImagePreview}
                        multiple
                    >
                        {uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onSubmit={handleSubmit}
                        loading={loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={handleDiscard}
                        style={{marginLeft: '20px'}}
                    >
                        Discard
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
export default EditPropertyForm;

