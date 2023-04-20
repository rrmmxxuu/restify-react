import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import {Button, Carousel, Image, List, Typography} from "antd";
import {amenityChoices, createMappingObject, propertyTypes, provinceChoices} from "../../utils/constants";
import {getPropertyImages} from "../../services/property";
import {isAuthed} from "../../services/auth";
import {getUserInfo} from "../../services/user";
import {CarouselNextArrow, CarouselPrevArrow} from "../../components/buttons/CarouselArrow";

const {Title} = Typography;
const {Text} = Typography;

const PropertyDetails = ({property}) => {
    const navigate = useNavigate()

    const [propertyImages, setPropertyImages] = useState([])
    const [isLogin, setIsLogin] = useState(false)
    const [isMyProperty, setIsMyProperty] = useState(false)

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

        const checkUser = async () => {
            const token = await isAuthed()
            if (token) {
                setIsLogin(true)
                const user = await getUserInfo(token)
                if (user.id === property.owner) {
                    setIsMyProperty(true)
                }
            }
        }
        checkUser()

    }, [property.owner, property.property_id]);

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

    const handleEdit = () => {
        navigate("/my-properties")
    }

    const editButton = () => {
        return (
            <Button
                type="primary"
                onClick={handleEdit}
                style={{marginLeft: '20px'}}
            >
                Edit
            </Button>
        )
    }

    const handleReserve = () => {

    }

    const reserveButton = () => {
        return (
            <Button
                type="primary"
                onClick={handleReserve}
                style={{marginLeft: '20px'}}
            >
                Reserve Now
            </Button>
        )
    }

    return (
        <>
            <Title>{property.title}</Title>
            {
                !isLogin ? (
                    <Text>You need to login to reserve</Text>
                ) : isMyProperty ? (
                    editButton()
                ) : (
                    reserveButton()
                )
            }
            <div style={{marginTop: '20px'}}>
                <Title level={3}> Property thumbnail </Title>
                <Image
                    src={property.thumbnail}
                    style={{marginRight: '10px', marginBottom: '10px'}}

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
        </>
    );
};

export default PropertyDetails;
