import React from 'react';
import {Card} from 'antd';
import {EyeOutlined, DeleteOutlined} from '@ant-design/icons';

const {Meta} = Card;
export const ReservationCard = ({property, reservation, cardStyle, onView, onDelete}) => (
        <Card
            style={cardStyle}
            cover={<img alt="property" src={property.thumbnail}/>}
            actions={[
                <EyeOutlined key="view" onClick={() => onView(reservation.id, property.property_id)}/>,
                <DeleteOutlined key="delete" onClick={() => onDelete(reservation.id)}/>,
            ]}
        >
            <Meta
                title={property.title}
                description={`Start Date: ${reservation.start_date}, End Date: ${reservation.end_date}`}
            />
        </Card>
    );

