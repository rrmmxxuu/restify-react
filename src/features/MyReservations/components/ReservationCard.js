import {Card, Tooltip} from 'antd';
import {CloseOutlined, EyeOutlined} from '@ant-design/icons';
import {formatDate} from "../../../utils/format_date";
import React from "react";

const {Meta} = Card;
export const ReservationCard = ({property, reservation, cardStyle, onView, onDelete}) => {


    const actions = [
        <Tooltip title="View details">
            <EyeOutlined key="view" onClick={() => onView(reservation.id, property.property_id)}/>
        </Tooltip>
    ];

    if (reservation.status === 'Approved' || reservation.status === 'Pending') {
        actions.push(
            <Tooltip title="Cancel">
                <CloseOutlined key="close" onClick={() => onDelete(reservation.id)}/>
            </Tooltip>
        );
    }

    return (
        <Card
            style={cardStyle}
            cover={<img alt="property" src={property.thumbnail}/>}
            actions={actions}
        >
            <Meta
                title={property.title}
                description={
                    <>
                        Start Date: {reservation.start_date}
                        <br/>
                        End Date: {reservation.end_date}
                        <br/>
                        Status: {reservation.status}
                        <br/>
                        Updated at: {formatDate(reservation.updated_at)}
                    </>
                }
            />
        </Card>
    );
}

