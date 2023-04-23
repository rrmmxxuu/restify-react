import {Button, Form, Input, message, Rate} from 'antd';
import {isAuthed} from "../../../services/auth";
import {sendNotification} from "../../../services/notification";
import {createComments} from "../../../services/comment";

const {TextArea} = Input;

const AddCommentForm = ({reservationID, property}) => {
    const handleSubmit = async (values) => {
        values.reservation = reservationID
        values.property = property.property_id
        const token = await isAuthed()

        if (values.rating) {
            const rating = values.rating
            values.rating = Math.round(rating)
        }

        return createComments(token, reservationID, values)
            .then(() => {
                message.success("Successfully added a comment!")
                sendNotification(token, property.owner, "You got one new comment for your property!")
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            })
            .catch((error) => {
                message.error("Something went wrong... Please try again later")
                console.error("Error:", error);
            });
    };

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item name="content" rules={[{required: true, message: 'Please type something!'}]}>
                <TextArea rows={4} placeholder="Comments"/>
            </Form.Item>
            <Form.Item name="rating" rules={[{required: true, message: 'Please rate this reservation!'}]}>
                <Rate allowHalf={false} count={5} allowClear={false}/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary">
                    Add Comment
                </Button>
            </Form.Item>
        </Form>
    );
};
export default AddCommentForm;
