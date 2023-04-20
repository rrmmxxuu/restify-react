import React, {useState} from 'react';

import {Button, Checkbox, Divider, Form, Input, message, Space} from 'antd';
import {LockOutlined, MailOutlined} from "@ant-design/icons";

import './LoginForm.css';
import {login, isAuthed} from "../../../services/auth";
import {getUserInfo} from "../../../services/user";

const LoginForm = ({onLogin}) => {

    const [loading, setLoading] = useState(false)

    const onSubmit = async (values) => {
        setLoading(true)
        const login_result = await login(values.email, values.password, values.remember)
        if (login_result === '200') {
            const token = await isAuthed()
            const userinfo = await getUserInfo(token)
            message.success("Login Successful. Welcome, " + userinfo.first_name + "!", 5)
            onLogin()
            setLoading(false)
        } else if (login_result === '401') {
            message.error("Your credential does not match our records!", 5)
        } else if (login_result === 'ERR_NETWORK') {
            message.error("There is a network error. Please try again later.", 5)
        } else {
            message.error("Something went wrong... Please try again later.", 5)
        }

        setLoading(false)
        // login(values.email, values.password, values.remember)
        //     .then(async (response) => {
        //         // const first_name = JSON.parse(localStorage.getItem('userinfo')).first_name
        //         const token = await isAuthed()
        //         const userinfo = await getUserInfo(token)
        //         message.success("Login Successful. Welcome, " + userinfo.first_name + "!", 5)
        //         onLogin()
        //     })
        //     .catch((error) => {
        //         if (error.response) {
        //             if (error.response.status === 401) {
        //                 message.error("Your credential does not match our records!", 5)
        //             }
        //         } else {
        //             console.error((error))
        //             message.error("Something went wrong... Please try again later.")
        //         }
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })

    }

    return (
        <Form
            name="normal-login"
            className="login-form"
            initialValues={{remember: true}}
            onFinish={onSubmit}>
            <Form.Item
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
                <Input placeholder="Email" size={"large"} prefix={<MailOutlined/>}/>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password placeholder="Password" size={"large"} prefix={<LockOutlined/>}/>
            </Form.Item>
            <Divider/>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Trust this device</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="/">
                    Forgot password
                </a>
            </Form.Item>
            <Form.Item>
                 <Space style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                    <Button type="primary" htmlType="submit" size="large" loading={loading}>
                        {loading ? "Logging you in..." : "Login"}
                    </Button>
                 </Space>
            </Form.Item>

        </Form>
    );
};


export default LoginForm