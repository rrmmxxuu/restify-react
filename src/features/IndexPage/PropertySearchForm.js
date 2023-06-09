import {AutoComplete, Button, Col, DatePicker, Form, Grid, Input, Row, Select} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {amenityChoices, commonCities, provinceChoices} from '../../utils/constants';
import React from 'react';
import dayjs from "dayjs";

import "./placeholder.css"

const {Option} = Select;

const PropertySearchForm = ({onFinish, isLoading}) => {
    const PROVINCE_CHOICES = provinceChoices();
    const AMENITY_CHOICES = amenityChoices();
    const screens = Grid.useBreakpoint()

    const disabledDate = (current) => {
        // Can not select days before today
        return current && current < dayjs().startOf('day');
    };

    return (
        <Form onFinish={(values) => onFinish(values)}>
            <Row gutter={16}>
                <Col span={screens.md ? 4 : 24}>
                    <Form.Item name="province">
                        <Select
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            placeholder="Province"
                            size="large"
                        >
                            {PROVINCE_CHOICES.map((province) => (
                                <Option key={province.value} value={province.value}>
                                    {province.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={screens.md ? 4 : 24}>
                    <Form.Item name="city">
                        <AutoComplete
                            allowClear
                            options={commonCities()}
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        >
                            <Input size="large" placeholder="City" className="center-placeholder"/>
                        </AutoComplete>
                    </Form.Item>
                </Col>
                <Col span={screens.md ? 8 : 24}>
                    <Form.Item
                        name="dateRange"
                        initialValue={[dayjs(), dayjs().add(5, 'd')]}
                        rules={[
                            {
                                required: true,
                                message: "Please select a date range",
                            },
                        ]}
                    >
                        <DatePicker.RangePicker
                            style={{width: "100%"}}
                            disabledDate={disabledDate}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col span={screens.md ? 4 : 24}>
                    <Form.Item name="amenities">
                        <Select
                            allowClear
                            mode="multiple"
                            style={{width: '100%'}}
                            placeholder="Select amenities"
                            optionLabelProp="label"
                            size="large"
                        >
                            {AMENITY_CHOICES.map((amenities) => (
                                <Option key={amenities.value} value={amenities.value} label={amenities.label}>
                                    {amenities.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={screens.md ? 4 : 24}>
                    <Form.Item name="priceRange">
                        <Select placeholder="Select your budget" size="large">
                            <Option value="0-500">Less than 500</Option>
                            <Option value="500-1000">$500-1000</Option>
                            <Option value="1000-3000">$1000-3000</Option>
                            <Option value="3000+">$3000+</Option>
                            <Option value="inf">I don't care</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row style={{display: 'flex', justifyContent: 'center'}}>
                <Col span={screens.md ? 4 : 24}>
                    <Form.Item name="sortBy" initialValue="rate_high2low">
                        <Select placeholder="Results order by" size="large">
                            <Option value="price_low2high">Price: Low to High</Option>
                            <Option value="price_high2low">Price: High to Low</Option>
                            <Option value="rate_high2low">Rating: High to Low</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item>
                        <Button icon={<SearchOutlined/>}
                                size="large"
                                shape="round"
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                style={{marginTop: "16px"}}>
                            {isLoading ? "Searching..." : "Search"}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default PropertySearchForm;
