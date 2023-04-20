import React from "react";
import {Card} from "antd";
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
                <EyeOutlined key="view" onClick={handleViewClick}/>,
            ]}
        >
            <Meta
                title={property.title}
                description={"$" + property.price}
            />
        </Card>
    );
};

export default PropertyCard;
