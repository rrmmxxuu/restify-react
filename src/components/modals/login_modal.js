import React, {useState} from 'react';
import {Button, Modal, Tabs} from 'antd';
import LoginForm from "../../features/Navbar/components/LoginForm";
import SignUpForm from "../../features/Navbar/components/SignupForm";

const LoginModal = ({handleLogin}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const handleSignupSuccess = () => {
        console.log('Form submitted');
        setActiveTab("login")
    };

    const handleLoginSuccess = () => {
        setTimeout(() => {
            setIsModalOpen(false);
            handleLogin();
        }, 1000)

    };

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const tabs = [
        {
            key: 'login',
            label: 'Login',
            children: <LoginForm onLogin={handleLoginSuccess}/>,
        },
        {
            key: 'signup',
            label: 'Sign Up',
            children: <SignUpForm onSignupSuccess={handleSignupSuccess}/>,
        },
    ];

    return (
        <>
            <Button type="primary" size={"large"} onClick={showModal}>
                Login / Sign Up
            </Button>
            <Modal title={
                <div style={{textAlign: 'center', fontSize: '24px'}}>
                    Welcome to Restify!
                </div>
            } open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Tabs activeKey={activeTab} centered onChange={setActiveTab} items={tabs} animated={true}/>
            </Modal>
        </>
    );
};

export default LoginModal