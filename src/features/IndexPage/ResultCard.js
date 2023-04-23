import React from "react";
import {Card, Rate, Tooltip} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const {Meta} = Card;

const PropertyCard = ({property}) => {

    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate(`/property/${property.property_id}`);
    };

    return (
        <Card
            key={property.property_id}
            cover={
                <div className="card-cover">
                    <img alt={property.title} src={property.thumbnail}/>
                </div>
            }
            actions={[
                <Tooltip title="View Details">
                    <EyeOutlined key="view" onClick={handleViewClick}/>
                </Tooltip>
            ]}
        >
            <Meta
                title={property.title}
                description={
                    <>
                        {"$" + property.price}
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
};

export default PropertyCard;
