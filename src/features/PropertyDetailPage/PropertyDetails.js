import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import {Button, Carousel, Col, Descriptions, Divider, Empty, Grid, Image, Rate, Row, Typography} from "antd";
import {amenityChoices, createMappingObject, propertyTypes, provinceChoices} from "../../utils/constants";
import {getPropertyImages} from "../../services/property";
import {isAuthed} from "../../services/auth";
import {getUserInfo, getUserInfoPublic} from "../../services/user";
import {AddReservationForm} from "../MyReservations/components/AddReservationForm";
import {CarouselNextArrow, CarouselPrevArrow} from "../../components/buttons/CarouselArrow";
import {getPropertyComments} from "../../services/comment";
import {PropertyCommentBlock} from "../Comments/components/PropertyCommentBlock";

const {Title} = Typography;


const PropertyDetails = ({property}) => {
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint()

    const [propertyImages, setPropertyImages] = useState([])
    const [propertyOwnerInfo, setPropertyOwnerInfo] = useState(null)
    const [isLogin, setIsLogin] = useState(false)
    const [isMyProperty, setIsMyProperty] = useState(false)
    const [showAddReservationForm, setShowAddReservationForm] = useState(false);
    const [comments, setComments] = useState([])

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

    useEffect(() => {
        const fetchOwnerInfo = async () => {
            const owner_id = property.owner
            const owner_info = await getUserInfoPublic(owner_id)
            console.log(owner_info)
            setPropertyOwnerInfo(owner_info)
        }
        fetchOwnerInfo();

    }, [property.owner])

    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await getPropertyComments(property.property_id);
            if (fetchedComments !== false) {
                const baseComments = []
                for (let i = 0; i < fetchedComments.length; i++) {
                    if (fetchedComments[i].parent_comment == null) {
                        baseComments.push(fetchedComments[i]);
                    }
                }
                setComments(baseComments);
            }

        };
        fetchComments();
    }, [property.property_id]);

    useEffect(() => {
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

    }, [property.owner])

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
                size="large"
                onClick={handleEdit}
            >
                Edit
            </Button>
        )
    }

    const reserveButton = () => {
        return (
            <Button
                type="primary"
                size="large"
                onClick={handleReserve}
            >
                Reserve Now
            </Button>
        )
    }

    const handleReserve = () => {
        setShowAddReservationForm(true);
    }

    const handleDiscard = () => {
        setShowAddReservationForm(false);
    }

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
                    <div style={{paddingTop: "20px"}}>
                        {
                            !isLogin ? (
                                <Title level={5}>You need to login to reserve</Title>
                            ) : isMyProperty ? (
                                editButton()
                            ) : (
                                reserveButton()
                            )
                        }
                        {showAddReservationForm && (
                            <div style={{paddingTop: "30px"}}>
                                <AddReservationForm onDiscard={handleDiscard} property={property}/>
                            </div>
                        )
                        }
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
            <Descriptions layout="horizontal" bordered column={screens.md ? 3 : 1}>
                {info.map((item) => (
                    <Descriptions.Item key={item.label} label={item.label}>
                        {item.value}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Divider>
                <Title level={3}> Owner Information </Title>
            </Divider>
            {propertyOwnerInfo ?
                <Descriptions layout="horizontal" bordered column={screens.md ? 3 : 1}>
                    <Descriptions.Item key="first_name" label="First Name">
                        {propertyOwnerInfo.first_name}
                    </Descriptions.Item>
                    <Descriptions.Item key="last_name" label="Last Name">
                        {propertyOwnerInfo.last_name}
                    </Descriptions.Item>
                    <Descriptions.Item key="email" label="Contact Email">
                        {propertyOwnerInfo.email}
                    </Descriptions.Item>
                </Descriptions> : <Empty/>
            }
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
                    {propertyImages && propertyImages.length > 0 ?
                        propertyImages.map((image) => (
                            <div key={image.id}>
                                <Image
                                    width={"100%"}
                                    src={image.image}
                                    alt={image.name}
                                />
                            </div>
                        )) : <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={"No image uploaded"}
                        />}
                </Carousel>
            </div>
            <Divider>
                <Title level={3}> Comments </Title>
            </Divider>
            {comments.length > 0 && comments.map((comment) => (
                <Row gutter={[24, 24]} style={{padding: '0 30px'}}>
                    <Col key={comment.id} xs={24} sm={24} md={12} lg={8} xl={8}>
                        <PropertyCommentBlock
                            comment={comment}
                            style={{width: '100%'}}
                        />
                    </Col>
                </Row>)
            )}

        </>
    );
};

export default PropertyDetails;
