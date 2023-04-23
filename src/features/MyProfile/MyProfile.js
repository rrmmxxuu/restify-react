import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Divider, Form, Grid, message, Modal, Row, Typography} from 'antd';
import UserDetails from './components/ProfileDetails';
import UserAvatar from './components/ProfileAvatar';

import {isAuthed} from "../../services/auth";
import {getUserInfo, getUserProfile, updateUserInfo, updateUserProfile} from "../../services/user";
import AvatarContext from "../../context/AvatarContext";
import useAuthRedirect from "../../hooks/useAuthRedirect";

const {Title} = Typography

const MyProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState({})
    const [uploadedAvatar, setUploadedAvatar] = useState(null)
    const [refetchProfile, setRefetchProfile] = useState(false);
    const [form] = Form.useForm();
    const {triggerRefetchAvatar} = useContext(AvatarContext);
    const screens = Grid.useBreakpoint()

    useAuthRedirect(isAuthed)

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        // Fetch user MyProfile data from the API when the component mounts
        const fetchUserProfile = async () => {
            // Replace this with the actual API call
            const token = await isAuthed()
            const fetchedUserProfile = await getUserProfile(token);
            const fetchedUserInfo = await getUserInfo(token);
            const combinedData = {
                ...fetchedUserInfo, ...fetchedUserProfile,
            };
            const userProfile = {
                id: combinedData.user_id,
                firstName: combinedData.first_name,
                lastName: combinedData.last_name,
                email: combinedData.email,
                phone: combinedData.phone,
                dateOfBirth: combinedData.date_of_birth,
                gender: combinedData.gender,
                avatar: combinedData.avatar,
            };
            setUserProfile(userProfile);
        };
        fetchUserProfile();
    }, [refetchProfile]);

    const handleSubmit = async (updatedProfile) => {
        // Call the API to update the MyProfile
        console.log(updatedProfile)
        setIsLoading(true)
        try {
            // Call the API to update the MyProfile
            const token = await isAuthed();
            await updateUserInfo(token, updatedProfile);
            await updateUserProfile(token, updatedProfile);

            // On success, clear the userProfile and trigger a refetch
            setUserProfile({});
            setRefetchProfile(!refetchProfile);
            setIsLoading(false)
            triggerRefetchAvatar()
            toggleEdit();
            message.success("MyProfile update successful!")
        } catch (error) {
            console.error("Error updating MyProfile", error);
            // On error, set isEditing back to true
            setIsLoading(false)
            setIsEditing(true);
            message.error("Something went wrong, please try again later...")
        }
    };

    const handleSaveProfile = async () => {
        try {
            // Trigger form validation
            await form.validateFields();
            const updatedProfile = {};
            updatedProfile.avatar = uploadedAvatar ? uploadedAvatar : undefined;
            for (const [key, value] of Object.entries(userProfile)) {
                if (key !== 'avatar' && value !== undefined) {
                    updatedProfile[key] = value;
                }
            }
            handleSubmit(updatedProfile);
        } catch (error) {
            message.error("There is at least a field that does not meet requirements. Please check again!")
            console.error('Validation failed:', error);
        }
    };

    const handleDiscardChanges = () => {

        Modal.confirm({
            title: 'Discard Changes',
            content: 'Are you sure you want to discard changes?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                setUserProfile({});
                setRefetchProfile(!refetchProfile);
                setIsEditing(false);
            },
        });
    };

    return (
        <>
            <Title level={3} style={{paddingBottom: "20px"}}> My Profile </Title>
            <Divider/>
            <Row style={{marginTop: '20px'}}>
                {screens.md ? (
                    <>
                        <Col span={8} offset={2}>
                            <UserAvatar userProfile={userProfile} isEditing={isEditing}
                                        setUploadedAvatar={setUploadedAvatar}/>
                        </Col>
                        <Col span={12}>
                            <UserDetails userProfile={userProfile} isEditing={isEditing} setUserProfile={setUserProfile}
                                         form={form}/>
                            <div style={{display: 'flex', justifyContent: 'flex-start', marginTop: '16px'}}>
                                <Button
                                    type="primary"
                                    onClick={isEditing ? handleSaveProfile : toggleEdit}
                                    loading={isLoading}
                                    style={{marginTop: '16px', marginRight: '20px'}}
                                >
                                    {isEditing ? (isLoading ? 'Updating...' : 'Update My Profile') : 'Edit My Profile'}
                                </Button>
                                {isEditing && (
                                    <Button type="primary" danger onClick={handleDiscardChanges}
                                            style={{marginTop: '16px'}}>
                                        Discard Changes
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col span={24}>
                            <UserAvatar
                                userProfile={userProfile}
                                isEditing={isEditing}
                                setUploadedAvatar={setUploadedAvatar}
                            />
                        </Col>
                        <Col span={24}  style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '400px' , paddingLeft: '80px', paddingRight: '80px'}}>
                            <UserDetails
                                userProfile={userProfile}
                                isEditing={isEditing}
                                setUserProfile={setUserProfile}
                                form={form}
                            />
                            </div>
                        </Col>
                        <Col span={24} style={{display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
                            <Button
                                type="primary"
                                onClick={isEditing ? handleSaveProfile : toggleEdit}
                                loading={isLoading}
                                style={{marginTop: '16px', marginRight: '20px'}}
                            >
                                {isEditing ? (isLoading ? 'Updating...' : 'Update My Profile') : 'Edit My Profile'}
                            </Button>
                            {isEditing && (
                                <Button type="primary"
                                        danger
                                        onClick={handleDiscardChanges}
                                        style={{marginTop: '16px'}}>
                                    Discard Changes
                                </Button>
                            )}
                        </Col>
                    </>
                )}
            </Row>
        </>
    );
};

export default MyProfile;
