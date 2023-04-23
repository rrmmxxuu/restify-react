import {Button, Carousel, Col, Descriptions, Divider, Grid, Image, Rate, Row, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {getPropertyImages} from "../../../services/property";
import {amenityChoices, createMappingObject, propertyTypes, provinceChoices} from "../../../utils/constants";
import {CarouselNextArrow, CarouselPrevArrow} from "../../../components/buttons/CarouselArrow";

const {Title} = Typography;

export const MyPropertyDetails = ({property, goBack}) => {

    const [propertyImages, setPropertyImages] = useState([])
    const screens = Grid.useBreakpoint()

    const PROVINCE_CHOICES = provinceChoices()
    const PROPERTY_TYPES = propertyTypes()
    const AMENITY_CHOICES = amenityChoices()
    const provinceMapping = createMappingObject(PROVINCE_CHOICES)
    const propertyTypeMapping = createMappingObject(PROPERTY_TYPES)
    const amenityMapping = createMappingObject(AMENITY_CHOICES)


    useEffect(() => {
        const fetchImages = async () => {
            const property_id = property.property_id
            const fetchedImages = await getPropertyImages(property_id);
            setPropertyImages(fetchedImages);
        };
        fetchImages();
    }, [property.property_id]);

    const getAmenityLabels = (amenityCodes) => {
        return amenityCodes
            .map((code) => amenityMapping[code] || code)
            .join(' ');
    };

    const info = [
        {
            label: 'Address',
            value: property.address
        },
        {
            label: 'City',
            value: property.city
        },
        {
            label: "Province",
            value: provinceMapping[property.province] || property.province
        },
        {
            label: "Postal Code",
            value: property.postal_code
        },
        {
            label: "Price",
            value: "$" + property.price
        },
        {
            label: "Property type",
            value: propertyTypeMapping[property.property_type] || property.property_type
        },
        {
            label: "Number of bedrooms",
            value: property.num_bedrooms
        },
        {
            label: "Square feet",
            value: property.sqft
        },
        {
            label: "Amenities available",
            value: getAmenityLabels(property.amenities)
        }
    ]

    return (
        <>
            <Row gutter={[16, 24]} style={{paddingBottom: "10px"}} align="middle">
                <Col span={screens.md ? 8 : 24}>
                    <Title>{property.title}</Title>
                    <br/>
                    <Title level={3}>${property.price}</Title>
                    <Rate
                        disabled
                        allowHalf
                        value={parseFloat(property.rating) || 0}
                    />{property.rating === null && <span style={{marginLeft: "8px"}}>No rating yet</span>}
                    <br/>
                    <div style={{marginTop: '20px'}}>
                        <Button type="primary" onClick={goBack}>Go Back</Button>
                    </div>
                </Col>
                <Col span={screens.md ? 16 : 24}>
                    <Image
                        src={property.thumbnail}
                        alt={property.thumbnail}
                        style={{paddingRight: "100px", paddingLeft: "100px"}}
                    />
                </Col>
            </Row>
            <Divider>
                <Title level={3}> Property Information </Title>
            </Divider>
            <Descriptions column={screens.md ? 3 : 1} layout="horizontal" bordered>
                {info.map((item) => (
                    <Descriptions.Item key={item.label} label={item.label}>
                        {item.value}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Divider>
                <Title level={3}> Property images </Title>
            </Divider>
            <div style={{marginTop: '20px', paddingRight: "100px", paddingLeft: "100px"}}>
                <Carousel
                    arrows={true}
                    prevArrow={<CarouselPrevArrow/>}
                    nextArrow={<CarouselNextArrow/>}
                    autoplay
                >
                    {propertyImages &&
                        propertyImages.map((image) => (
                            <div key={image.id}>
                                <Image
                                    width={"100%"}
                                    src={image.image}
                                    alt={image.name}
                                />
                            </div>
                        ))}
                </Carousel>
            </div>
        </>
    );
};