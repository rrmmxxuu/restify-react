import React, {useState} from 'react';
import {Button, DatePicker, Form, message, Modal} from 'antd';
import {createReservation} from "../../../services/reservation";
import {isAuthed} from "../../../services/auth";
import {getUserInfo} from "../../../services/user";
import {sendNotification} from "../../../services/notification";

const {useForm} = Form

export const AddReservationForm = ({onDiscard, property}) => {
    const [loading, setLoading] = useState(false)
    const [form] = useForm()

    const handleSubmit = async (values) => {
        setLoading(true);
        values.status = "Pending"
        const propertyid = property.property_id
        values.property = propertyid
        const token = await isAuthed()
        console.log(getUserInfo(token))
        return createReservation(token, values, propertyid)
            .then(() => {
                message.success("Successfully sent reservation request!")
                sendNotification(token, property.owner, "You got one new reservations for your property " + property.title)
                setLoading(false);
                setTimeout(onDiscard(), 2000)
            })
            .catch((error) => {
                message.error("Something went wrong... Please try again later")
                console.error("Error:", error);
                setLoading(false);
            });
    };

    const handleDiscard = () => {
        Modal.confirm({
            title: 'Discard Changes',
            content: 'Are you sure you want to discard changes?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                onDiscard();
            },
        });
    }

    return (
        <div>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
                <Form.Item name="dateRange" rules={[{
                    required: true,
                    message: "Please select a date range",
                },]}>
                    <DatePicker.RangePicker/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onSubmit={handleSubmit} loading={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                    <Button type="primary" danger onClick={handleDiscard} style={{marginLeft: '20px'}}>
                        Discard
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};