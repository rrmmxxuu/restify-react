import React, {useState} from 'react';
import {
    AutoComplete,
    Button,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Typography,
    Upload
} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {createProperty, uploadImages} from "../../../services/property";
import {isAuthed} from "../../../services/auth";
import {amenityChoices, commonCities, propertyTypes, provinceChoices} from "../../../utils/constants";

const {Option} = Select;
const {useForm} = Form
const {Title} = Typography
export const AddPropertyForm = ({onDiscard}) => {
    const [thumbnailUrl, setThumbnailUrl] = useState([]);
    const [thumbnailSelected, setThumbnailSelected] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [form] = useForm()

    const PROVINCE_CHOICES = provinceChoices()
    const PROPERTY_TYPES = propertyTypes()
    const AMENITY_CHOICES = amenityChoices()
    const COMMON_CITIES = commonCities


    const handlePostalCodeChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        form.setFieldsValue({postal_code: value});
    };

    const handleThumbnailChange = ({fileList}) => {
        setThumbnailUrl(fileList)
    }

    const handleThumbnailPreview = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        setThumbnailSelected(true)
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
        values.thumbnail = thumbnailUrl[0].originFileObj;
        const property_images = imageList.map((imageObject) => {
            return {
                name: imageObject.name,
                originFileObj: imageObject.originFileObj,
            };
        });
        delete values.property_image

        isAuthed()
            .then((token) => {
                return createProperty(token, values).then((submitProperty) => ({
                    token,
                    submitProperty,
                }));
            })
            .then(({token, submitProperty}) => {
                const property_id = submitProperty.property_id;
                return uploadImages(token, property_id, property_images);
            })
            .then(() => {
                message.success("Successfully added a property!")
                setLoading(false);
                setTimeout(onDiscard(), 2000)
            })
            .catch((error) => {
                message.error("Something went wrong... Please try again later")
                console.error("Error:", error);
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

    const uploadButton = (<div>
        <PlusOutlined/>
        <div style={{marginTop: 8}}>Upload</div>
    </div>)

    return (
        <div style={{paddingRight: "100px", paddingLeft: "100px"}}>
            <Title>Add Property</Title>
            <Divider/>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
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
                    rules={[
                        {required: true, message: 'Please enter the price'},
                        {
                            validator: (_, value) => {
                                if (value >= 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Price cannot be negative');
                            },
                        },
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
                        validator: (_) => {
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
                    <Button type="primary" htmlType="submit" onSubmit={handleSubmit} loading={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                    <Button type="primary" danger onClick={handleDiscard} style={{marginLeft: '20px'}}>
                        Discard
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

