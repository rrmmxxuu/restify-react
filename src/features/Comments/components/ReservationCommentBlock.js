import React, {useContext, useEffect, useState} from 'react';
import {Avatar, message, Rate} from 'antd';
import { Comment } from '@ant-design/compatible';
import {DeleteOutlined, EditOutlined, UserOutlined, MessageOutlined} from '@ant-design/icons';
import {isAuthed} from "../../../services/auth";
import {getUserInfoPublic, getUserProfile} from "../../../services/user";
import AvatarContext from "../../../context/AvatarContext";
import {formatDate} from "../../../utils/format_date";


export const ReservationCommentBlock = ({comment, BlockStyle, index, onChange, onDelete, onReply}) => {
    const {refetchAvatar} = useContext(AvatarContext);
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [username, setUsername] = useState('anonymous')

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                // Fetch the avatar from the server
                const token = await isAuthed()
                const userProfile = await getUserProfile(token);
                const userName = await getUserInfoPublic(comment.user)
                setUsername(userName.first_name + userName.last_name)
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
        <>
        <Comment
            style={BlockStyle}
            avatar={<Avatar src={avatarUrl}/>}
            author={username}
            content={<><p style={{fontSize: '24px'}}>{comment.content}</p>
                {index === 0 && (
            <Rate disabled defaultValue={comment.rating}/>)}</>}
            datetime={formatDate(comment.date_modified)}
            actions={[
                <EditOutlined key="change" style={{fontSize:'20px'}} onClick={() => onChange(index)}/>,
                <DeleteOutlined key="delete" style={{fontSize:'20px'}} onClick={() => onDelete(comment)}/>,
                <MessageOutlined key="reply" style={{fontSize:'20px'}} onClick={() => onReply(index)}/>
            ]}
        />
    </>)

};