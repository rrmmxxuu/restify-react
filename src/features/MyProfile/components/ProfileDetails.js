import React from 'react';
import moment from 'moment';
import {DatePicker, Descriptions, Form, Input, Select} from 'antd';

const {Option} = Select;

const UserDetails = ({userProfile, isEditing, setUserProfile, form}) => {

    const handleFieldChange = (key, value) => {
        if (isEditing) {
            setUserProfile({...userProfile, [key]: value});
        }
    };

    const renderDatePicker = (date) => {
        const defaultValue = moment('2000-01-01', 'YYYY-MM-DD');

        return (
            <DatePicker
                value={date ? moment(date, 'YYYY-MM-DD') : null}
                style={{width: '100%'}}
                onChange={(date, dateString) => {
                    if (dateString) {
                        handleFieldChange('dateOfBirth', dateString);
                    } else {
                        handleFieldChange('dateOfBirth', '');
                        return defaultValue;
                    }
                }}
                disabledDate={(current) => current && current > moment().endOf('day')}
            />
        );
    };

    const renderGender = (value) => {
        const genderMap = {
            M: 'Male',
            F: 'Female',
            O: 'Other',
            U: 'Prefer not to tell',
        };

        return isEditing ? (
            <Select
                initialvalues={value}
                disabled={!isEditing}
                style={{width: '100%'}}
                onChange={(value) => handleFieldChange('gender', value)}
            >
                <Option value="M">Male</Option>
                <Option value="F">Female</Option>
                <Option value="O">Other</Option>
                <Option value="U">Prefer not to tell</Option>
            </Select>
        ) : (
            genderMap[value]
        );
    };

    const renderDescription = () => (
            <Descriptions layout="vertical" column={1} >
            <Descriptions.Item label="First Name">{userProfile.firstName}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{userProfile.lastName}</Descriptions.Item>
            <Descriptions.Item label="Email">{userProfile.email}</Descriptions.Item>
            <Descriptions.Item label="Phone Number">{userProfile.phone}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
                {userProfile.dateOfBirth
                    ? moment(userProfile.dateOfBirth, 'YYYY-MM-DD').format('YYYY-MM-DD')
                    : 'Not set'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
                {renderGender(userProfile.gender)}
            </Descriptions.Item>
        </Descriptions>
    );

    const renderForm = () => (
        <Form layout="vertical" form={form}>
            <Form.Item
                label="First Name"
                name="firstName"
                initialValue={userProfile.firstName}
                rules={[{required: true, message: 'First name is required'}]}
            >
                <Input onChange={(e) => handleFieldChange('firstName', e.target.value)}/>
            </Form.Item>
            <Form.Item
                label="Last Name"
                name="lastName"
                initialValue={userProfile.lastName}
                rules={[{required: true, message: 'Last name is required'}]}
            >
                <Input onChange={(e) => handleFieldChange('lastName', e.target.value)}/>
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                initialValue={userProfile.email}
                rules={[
                    {required: true, message: 'Email is required'},
                    {
                        type: 'email',
                        message: 'Please enter a valid email address',
                    },
                ]}
            >
                <Input onChange={(e) => handleFieldChange('email', e.target.value)}/>
            </Form.Item>
            <Form.Item label="Phone Number" name="phone" initialValue={userProfile.phone} rules={[
                {required: true, message: 'Phone number is required'},
                {
                    validator: (_, value) => {
                        const regex = /^(\(\+[0-9]{2}\))?([0-9]{3}-?)?([0-9]{3})-?([0-9]{4})(\/[0-9]{4})?$/gm;
                        if (regex.test(value)) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject(new Error('Please enter a valid Canadian phone number!'));
                        }
                    },
                },
            ]}>
                <Input onChange={(e) => handleFieldChange('phone', e.target.value)}/>
            </Form.Item>
            <Form.Item label="Date of Birth" name="dateOfBirth"
                       initialValue={
                           userProfile.dateOfBirth
                               ? moment(userProfile.dateOfBirth, 'YYYY-MM-DD')
                               : null
                       }>
                {renderDatePicker(userProfile.dateOfBirth)}
            </Form.Item>
            <Form.Item label="Gender" name="gender" initialValue={userProfile.gender}>
                {renderGender(userProfile.gender)}
            </Form.Item>
        </Form>
    );

    return isEditing ? renderForm() : renderDescription();
};

export default UserDetails;