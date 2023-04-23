import React from 'react';
import {Card, Tooltip} from 'antd';
import {CheckOutlined, CloseOutlined, EyeOutlined} from '@ant-design/icons';
import {formatDate} from "../../../utils/format_date";

const {Meta} = Card;
export const PropertyReservationCard = ({property, reservation, cardStyle, onView, onCheck, onClose}) => {

    const actions = [
        <Tooltip title="View details">
            <EyeOutlined key="view" onClick={() => onView(reservation.id, property.property_id)}/>
        </Tooltip>
    ];

    if (reservation.status === 'Pending') {
        actions.push(
            <Tooltip title="Accept">
                <CheckOutlined key="check" onClick={() => onCheck(reservation.id)}/>
            </Tooltip>,
            <Tooltip title="Deny">
                <CloseOutlined key="close" onClick={() => onClose(reservation.id)}/>
            </Tooltip>
        )
    }

    if (reservation.status === 'Approved') {
        actions.push(
            <Tooltip title="Complete">
                <CheckOutlined key="check" onClick={() => onCheck(reservation.id)}/>
            </Tooltip>,
            <Tooltip title="Terminate">
                <CloseOutlined key="close" onClick={() => onClose(reservation.id)}/>
            </Tooltip>
        )
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
    )

}