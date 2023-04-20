import React, {useState} from 'react';
import {Button, Form, message, Modal, Select, Card, DatePicker} from 'antd';
import {createReservation, uploadImages} from "../../../services/reservation";
import {isAuthed} from "../../../services/auth";
import {getUserInfo} from "../../../services/user";

const {Option} = Select;
const {useForm} = Form

export const AddReservationForm = ({onDiscard, property}) => {
    const [loading, setLoading] = useState(false)
    const [form] = useForm()

    const handleSubmit = (values) => {
        setLoading(true);
        values.status = "Pending"
        const propertyid = property.property_id
        values.property = propertyid
            isAuthed()
            .then((token) => {
                console.log(getUserInfo(token))

                return createReservation(token, values, propertyid);
            })
            .then(() => {
                message.success("Successfully added a reservation!")
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
        <Card
            cover={<img alt="property" src={property.thumbnail} />}
            title={property.title}
            style={{marginBottom: 16 }}
        >
            <Card.Meta description={property.address} />
        </Card>
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <Form.Item name="dateRange" label="Date Range" required={true}>
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