import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';

import {Avatar, Dropdown, message} from "antd";
import {UserOutlined} from "@ant-design/icons"

import {isAuthed, logout} from "../../../services/auth";
import {getUserProfile} from "../../../services/user";
import AvatarContext from "../../../context/AvatarContext";

const AvatarButton = ({handleLogout}) => {
    const {refetchAvatar} = useContext(AvatarContext);
    const [avatarUrl, setAvatarUrl] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                // Fetch the avatar from the server
                const token = await isAuthed()
                const userProfile = await getUserProfile(token);
                if (userProfile.avatar) {
                    setAvatarUrl(userProfile.avatar);
                } else {
                    setAvatarUrl(<UserOutlined/>)
                }
            } catch (error) {
                setAvatarUrl(<UserOutlined/>)
                console.error("Error fetching avatar:", error);
                message.error("Error fetching avatar")
            }
        };
        fetchAvatar();
    }, [refetchAvatar])

    const items = [
        {
            label: 'My Profile',
            key: '1',
        },
        {
            label: 'My Properties',
            key: '2',
        },
        {
            label: 'My Reservations',
            key: '3',
        },
        {
            label: 'Log Out',
            key: '4',
        }];

    const onClick = ({key}) => {
        switch (key) {
            case '1': // MyProfile
                navigate('/profile')
                break;
            case '2': // My Properties
                navigate('/my-properties')
                break;
            case '3': // My Reservations
                // Handle my property logic
                navigate('/my-reservations')
                break;
            case '4': // Logout
                onLogout();
                break;
            default:
                break;
        }
    }

    const onLogout = async () => {
        logout()
        message.info("Log Out Successful, see you!", 5)
        handleLogout();
        window.location.reload()
    }

    return (
        <>
            <Dropdown menu={{items, onClick,}} placement={"bottomRight"}>
                <Avatar size={56} src={avatarUrl}/>
            </Dropdown>
        </>
    )
}

export default AvatarButton