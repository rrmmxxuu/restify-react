import {Button, Col, Image, List, Row, Typography} from "antd";
import {useEffect, useState} from "react";
import {getPropertyImages} from "../../../services/property";
import {createMappingObject, provinceChoices} from "../../../utils/constants";

const {Title} = Typography;
const {Text} = Typography;

export const ReservationDetails = ({property, reservation, goBack}) => {

    const [propertyImages, setPropertyImages] = useState([])

    const PROVINCE_CHOICES = provinceChoices()
    const provinceMapping = createMappingObject(PROVINCE_CHOICES)

    useEffect((property_id) => {
        const fetchImages = async () => {
            const property_id = property.property_id
            const fetchedImages = await getPropertyImages(property_id);
            setPropertyImages(fetchedImages);
        };
        fetchImages();
    }, [property.property_id]);

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
            label: "Status",
            value: reservation.status
        },
        {
            label: "Start date",
            value: reservation.start_date
        },
        {
            label: "End date",
            value: reservation.end_date
        },
    ]

    return (
        <>
            <Title>{property.title}</Title>
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
            <div style={{marginTop: '20px'}}>
                <Title level={3}> Property thumbnail </Title>
                <Image
                    src={property.thumbnail}
                    style={{marginRight: '10px', marginBottom: '10px'}}

                />
            </div>
            <div style={{marginTop: '20px'}}>
                <Title level={3}> Property images </Title>
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                    <Row gutter={[16, 16]}>
                        {propertyImages && propertyImages.map((image, index) => (
                            <Col key={image.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                                <Image
                                    key={image.id}
                                    width={"100%"}
                                    src={image.image}
                                    alt={image.name}
                                    style={{marginRight: '10px', marginBottom: '10px'}}
                                />
                                <Text style={{display: 'block', textAlign: 'center'}}>{image.image_name}</Text>
                            </Col>
                        ))}
                    </Row>
                </Image.PreviewGroup>
            </div>
            <div style={{marginTop: '20px'}}>
                <Button type="primary" onClick={goBack}>Go Back</Button>
            </div>
        </>
    );
};