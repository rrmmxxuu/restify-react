import React, {useEffect, useState} from 'react';
import {Avatar, Button, Upload} from 'antd';
import ImgCrop from "antd-img-crop";
import {UserOutlined} from '@ant-design/icons';

const UserAvatar = ({userProfile, isEditing, setUploadedAvatar}) => {
    const [fileDataURL, setFileDataURL] = useState(null);
    const [initialAvatarLoaded, setInitialAvatarLoaded] = useState(false);

    useEffect(() => {
        if (userProfile.avatar && !initialAvatarLoaded) {
            setFileDataURL(userProfile.avatar);
            setInitialAvatarLoaded(true);
        }
    }, [userProfile.avatar, initialAvatarLoaded]);

    const handleChange = (info) => {
        if (info.file.status === "done") {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                setUploadedAvatar(info.file.originFileObj);
                setFileDataURL(dataUrl);
            };
            reader.readAsDataURL(info.file.originFileObj);
        } else if (info.file.status === "error") {
            console.log("error", info.file.error);
        }
    };

    const beforeUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedAvatar(file);
            setFileDataURL(reader.result);
        };
        reader.readAsDataURL(file);

        // Prevent the default upload behavior
        return false;
    };

    const avatarSrc = fileDataURL || <UserOutlined/>;
    return (
        <div style={{textAlign: "center"}}>
            <Avatar size={128} src={avatarSrc}/>
            {isEditing && (
                <div style={{marginTop: "20px"}}>
                    <ImgCrop aspect={1} quality={1} cropShape={"round"}>
                        <Upload
                            showUploadList={false}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            accept="image/png, image/jpeg"
                        >
                            <Button>Upload Avatar</Button>
                        </Upload>
                    </ImgCrop>
                </div>
            )}
        </div>
    );
};


export default UserAvatar;
