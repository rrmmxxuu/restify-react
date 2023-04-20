import React from 'react';
import {Card} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';

import "../../../card.css"

const {Meta} = Card;

export const PropertyCard = ({property, onView, onEdit, onDelete}) => (
    <Card
        cover={
            <div className="card-cover">
                <img alt="property" src={property.thumbnail}/>
            </div>
        }
        actions={[
            <EyeOutlined key="view" onClick={() => onView(property.property_id)}/>,
            <EditOutlined key="edit" onClick={() => onEdit(property.property_id)}/>,
            <DeleteOutlined key="delete" onClick={() => onDelete(property.property_id)}/>,
        ]}
    >
        <Meta
            title={property.title}
            description={property.address}
        />
    </Card>
);


