import React from 'react';
import {Card, Rate, Tooltip} from 'antd';
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
            <Tooltip title="View">
                <EyeOutlined key="view" onClick={() => onView(property.property_id)}/>
            </Tooltip>,
            <Tooltip title="Edit">
                <EditOutlined key="edit" onClick={() => onEdit(property.property_id)}/>
            </Tooltip>,
            <Tooltip title="Delete">
                <DeleteOutlined key="delete" onClick={() => onDelete(property.property_id)}/>
            </Tooltip>,
        ]}
    >
        <Meta
            title={property.title}
            description={
                <>
                    {property.address}
                    <br/>
                    <Rate
                        disabled
                        allowHalf
                        value={parseFloat(property.rating) || 0}
                    />
                    {property.rating === null && <span style={{marginLeft: "8px"}}>No rating yet</span>}
                </>
            }
        />
    </Card>
);


