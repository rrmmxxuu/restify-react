import {Button, Carousel, Image, List, Typography} from "antd";
import {useEffect, useState} from "react";
import {getPropertyImages} from "../../../services/property";
import {amenityChoices, createMappingObject, propertyTypes, provinceChoices} from "../../../utils/constants";
import {CarouselNextArrow, CarouselPrevArrow} from "../../../components/buttons/CarouselArrow";

const {Title} = Typography;
const {Text} = Typography;

export const MyPropertyDetails = ({property, goBack}) => {

    const [propertyImages, setPropertyImages] = useState([])

    const PROVINCE_CHOICES = provinceChoices()
    const PROPERTY_TYPES = propertyTypes()
    const AMENITY_CHOICES = amenityChoices()
    const provinceMapping = createMappingObject(PROVINCE_CHOICES)
    const propertyTypeMapping = createMappingObject(PROPERTY_TYPES)
    const amenityMapping = createMappingObject(AMENITY_CHOICES)


    useEffect((property_id) => {
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
            <Title>{property.title}</Title>
            <div style={{marginTop: '20px', paddingRight: "500px", paddingLeft: "500px" }}>
                <Title level={3}> Property thumbnail </Title>
                <Image
                    src={property.thumbnail}
                />
            </div>
            <List
                itemLayout="horizontal"
                dataSource={info}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.label}
                            description={item.value}
                        />
                    </List.Item>
                )}
            />
            <div style={{marginTop: '20px', paddingRight: "500px", paddingLeft: "500px"}}>
                <Title level={3}> Property images </Title>
                <Carousel
                    arrows={true}
                    prevArrow={<CarouselPrevArrow />}
                    nextArrow={<CarouselNextArrow />}
                    autoplay
                >
                    {propertyImages &&
                        propertyImages.map((image, index) => (
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
            <div style={{marginTop: '20px'}}>
                <Button type="primary" onClick={goBack}>Go Back</Button>
            </div>
        </>
    );
};