import React, {useCallback, useEffect, useState} from 'react';
import {Comment} from '@ant-design/compatible';
import {getUserInfo, getUserInfoPublic, getUserProfilePublic} from "../../../services/user";
import {formatDate} from "../../../utils/format_date";
import {Avatar, Button, Input, message, Modal, Rate} from "antd";
import {isAuthed} from "../../../services/auth";
import {createComments, deleteComment, updateComment} from "../../../services/comment";
import {sendNotification} from "../../../services/notification";

const {TextArea} = Input

const NestedComments = ({comments}) => {
    const [commentTree, setCommentTree] = useState([]);
    const [currentUserID, setCurrentUserID] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [replyingToComment, setReplyingToComment] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');
    const [replyCommentContent, setReplyCommentContent] = useState('');

    const fetchUserInfoAndUpdateComments = useCallback(async () => {
        // Fetch user information for all comments
        const userPromises = comments.map((comment) => getUserInfoPublic(comment.user));
        const users = await Promise.all(userPromises);
        const userProfilePromises = comments.map((comment) => getUserProfilePublic(comment.user));
        const userProfiles = await Promise.all(userProfilePromises);
        // Update comments with user information
        const updatedComments = comments.map((comment, index) => ({
            ...comment,
            firstName: users[index].first_name,
            lastName: users[index].last_name,
            avatarURL: userProfiles[index].avatar,
        }));
        // Build comment tree and set the state
        setCommentTree(buildCommentTree(updatedComments));
    }, [comments]);

    useEffect(() => {
        fetchLoggedInUserId();
        fetchUserInfoAndUpdateComments();
    }, [comments, fetchUserInfoAndUpdateComments]);

    const buildCommentTree = (comments) => {
        const commentMap = new Map();
        const commentTree = [];

        comments.forEach((comment) => {
            commentMap.set(comment.id, {...comment, children: []});
        });

        comments.forEach((comment) => {
            if (comment.parent_comment === null) {
                commentTree.push(commentMap.get(comment.id));
            } else {
                const parent = commentMap.get(comment.parent_comment);
                if (parent) {
                    parent.children.push(commentMap.get(comment.id));
                }
            }
        });

        return commentTree;
    };

    const fetchLoggedInUserId = async () => {
        const token = await isAuthed()
        const response = await getUserInfo(token);
        setCurrentUserID(response.id);
    };

    const handleEdit = (comment) => {
        setEditingComment(comment);
    };

    const handleReply = (comment) => {
        setReplyingToComment(comment);
    };

    const handleDiscard = () => {
        setEditingComment(null)
        setReplyingToComment(null)
    }

    const handleSubmitEdit = async (commentId) => {
        try {
            // Call your API to update the comment with the new content
            const token = await isAuthed();
            await updateComment(token, {id: commentId, content: editedCommentContent});
            // Reset the state
            setEditingComment(null);
            setEditedCommentContent('');
            message.success("Successfully edited a comment!")
            setTimeout(() => {
            window.location.reload()
        }, 1500);
        } catch (error) {
            message.error("Something went wrong... Please try again later")
            console.error('Error updating comment:', error);
        }
    }

    const handleSubmitReply = async (commentId) => {
        const token = await isAuthed();
        const lastComment = comments[comments.length - 1];
        const reservationID = lastComment.reservation;
        const propertyID = lastComment.property

        const newComment = {
            content: replyCommentContent,
            parent_comment: commentId,
            reservation: reservationID,
            property: propertyID
        };
        console.log(newComment)

        try {
            await createComments(token, reservationID, newComment);
            // Call fetchUserInfoAndUpdateComments() to refresh the comment list after creating the new comment
            setReplyingToComment(null);
            setReplyCommentContent("");
            sendNotification(token, lastComment.user, "You got one new comment for your property!")
            message.success("Successfully replied a comment!")
            setTimeout(() => {
            window.location.reload()
        }, 1500);
        } catch (error) {
            message.error("Something went wrong... Please try again later")
            console.error("Error creating reply", error);
        }
    }

    const showDeleteConfirm = (commentId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this comment?',
            content: 'Once deleted, the comment cannot be restored.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                // Perform the delete action here
                try {
                    const token = await isAuthed();
                    await deleteComment(token, commentId);
                    message.success("Successfully deleted a comment!")
                    setTimeout(() => {
            window.location.reload()
        }, 1500);
                } catch (error) {
                    message.error("Something went wrong... Please try again later")
                    console.error('Error deleting comment:', error);
                }
            },
        });
    };

    const renderComments = (comments, currentUserID) => {
        return comments.map((comment) => {
            const isAuthor = currentUserID === comment.user;
            const hasChildren = comment.children.length > 0
            const actions = [];
            if (!hasChildren) {
                if (isAuthor) {
                    actions.push(
                        <span key="edit" onClick={() => handleEdit(comment)}>
                        Edit
                    </span>,
                        <span key="delete" onClick={() => showDeleteConfirm(comment.id)}>
                        Delete
                    </span>
                    );
                } else {
                    actions.push(
                        <span key="reply" onClick={() => handleReply(comment)}>
                        Reply
                    </span>
                    );
                }
            }
            return (
                <Comment
                    key={comment.id}
                    author={`${comment.firstName} ${comment.lastName}`}
                    avatar={<Avatar src={comment.avatarURL} alt="avatar"/>}
                    content={
                        editingComment && editingComment.id === comment.id ? (
                            <div style={{marginTop: "10px"}}>
                                <TextArea
                                    defaultValue={comment.content}
                                    onChange={(e) => setEditedCommentContent(e.target.value)}>
                                </TextArea>
                                <Button
                                    type="primary"
                                    style={{marginTop: "10px", marginRight: "10px"}}
                                    onClick={() => handleSubmitEdit(comment.id)}
                                >
                                    Edit
                                </Button>
                                <Button type="primary" danger onClick={handleDiscard}>Discard</Button>
                            </div>
                        ) : (
                            <div>
                                {comment.rating ? <Rate
                                    disabled
                                    allowHalf
                                    value={parseFloat(comment.rating) || 0}
                                /> : null}
                                <p>{comment.content}</p>
                            </div>
                        )
                    }
                    datetime={formatDate(comment.date_created)}
                    actions={actions}
                    children={
                        hasChildren
                            ? renderComments(comment.children, currentUserID)
                            : replyingToComment && replyingToComment.id === comment.id ? (
                                <div style={{marginTop: "10px"}}>
                                    <TextArea onChange={(e) => setReplyCommentContent(e.target.value)}></TextArea>
                                    <Button
                                        type="primary"
                                        style={{marginTop: "10px", marginRight: "10px"}}
                                        onClick={() => handleSubmitReply(comment.id)}
                                    >
                                        Reply
                                    </Button>
                                    <Button type="primary" danger onClick={handleDiscard}>Discard</Button>
                                </div>
                            ) : null
                    }
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        backgroundColor: 'transparent'
                    }}
                />
            );
        });
    };

    return (
        <>
            {renderComments(commentTree, currentUserID)}
        </>
    )
};

export default NestedComments;
