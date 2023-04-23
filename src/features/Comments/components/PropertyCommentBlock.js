import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Card, message, Rate} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {getUserInfoPublic, getUserProfilePublic} from "../../../services/user";
import AvatarContext from "../../../context/AvatarContext";
import {formatDate} from "../../../utils/format_date";


export const PropertyCommentBlock = ({comment}) => {
    const {refetchAvatar} = useContext(AvatarContext);
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [username, setUsername] = useState('anonymous')

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const userProfile = await getUserProfilePublic(comment.user);
                const userName = await getUserInfoPublic(comment.user)
                setUsername(userName.first_name + " " + userName.last_name)
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

    }, [comment.user, refetchAvatar])

    return (
        <Card
            style={{width: '100%', marginBottom: '20px'}}
            title={
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Avatar src={avatarUrl}/>
                    <span style={{fontSize: '18px'}}>{username}</span>
                </div>
            }
        >
            <p style={{fontSize: '24px'}}>{comment.content}</p>
            <Rate disabled defaultValue={comment.rating}/>
            <div style={{marginTop: '10px'}}>{formatDate(comment.date_modified)}</div>
        </Card>
    )
};