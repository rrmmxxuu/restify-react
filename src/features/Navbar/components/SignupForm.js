import React, {useRef, useState} from 'react';
import {AutoComplete, Button, Divider, Form, Input, message, Space} from 'antd';
import {signup} from "../../../services/auth";
import {commonEmail} from "../../../utils/constants";

const SignUpForm = ({onSignupSuccess}) => {
    const [loading, setLoading] = useState(false)
    const formRef = useRef()

    const commonEmailSuffixes = commonEmail()
    const EmailAutoComplete = ({value = '', onChange}) => {
        const onSearch = (searchText) => {
            let result;
            if (!searchText || searchText.indexOf('@') >= 0) {
                result = [];
            } else {
                result = commonEmailSuffixes.map((suffix) => `${searchText}${suffix}`);
            }
            return result;
        };

        return (
            <AutoComplete
                value={value}
                onChange={onChange}
                options={onSearch(value).map((email) => ({value: email}))}
                placeholder="Email"
            />
        );
    };


    const onSubmit = (values) => {
        setLoading(true)
        signup(values.email, values.firstName, values.lastName, values.password)
            .then((response) => {
                message.success("Signup Successful", 5)
                setTimeout(() => {
                    onSignupSuccess()
                    formRef.current.resetFields()
                }, 1000)
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 400) {
                        message.error("User already exists!", 5)
                    }
                } else {
                    message.error("Something went wrong... Please try again later.")
                }

            })
            .finally(() => {
                setLoading(false)
            })
    }
    return (
        <Form onFinish={onSubmit} ref={formRef} layout={"vertical"}>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not a valid email!',
                    },
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                ]}
            >
                <EmailAutoComplete/>
            </Form.Item>
            <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                    {
                        required: true,
                        message: 'Please input your first name!',
                    },
                ]}
            >
                <Input placeholder="First Name"/>
            </Form.Item>
            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                    {
                        required: true,
                        message: 'Please input your last name!',
                    },
                ]}
            >
                <Input placeholder="Last Name"/>
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    {
                        validator: (_, value) => {
                            // Your custom validation logic goes here
                            // For example, check if the password has at least one uppercase letter, one lowercase letter, one digit, and one special character
                            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                            if (regex.test(value)) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject(new Error('Password must have at least one uppercase letter, one lowercase letter, one digit, and one special character.'));
                            }
                        },
                    },
                ]}
                help="Minimum 8 characters with at least one uppercase letter, one lowercase letter, one digit, and one special character."
            >
                <Input.Password placeholder="Password"/>
            </Form.Item>
            <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Repeat Password"/>
            </Form.Item>
            <Divider/>
            <Form.Item>
                <Space style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                    <Button type="primary" size="large" htmlType="submit" loading={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default SignUpForm