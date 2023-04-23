import {Button, Col, Descriptions, Divider, Grid, Image, Row, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {createMappingObject, provinceChoices} from "../../../utils/constants";
import {getReservationComments} from "../../../services/comment";
import NestedComments from "../../Comments/components/NestedComments";
import AddCommentForm from "../../Comments/components/AddCommentForm";

const {Title} = Typography;

export const ReservationDetails = ({property, reservation, goBack}) => {

    const [comments, setComments] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);
    const PROVINCE_CHOICES = provinceChoices()
    const provinceMapping = createMappingObject(PROVINCE_CHOICES)
    const screens = Grid.useBreakpoint()

    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await getReservationComments(reservation.id);
            if (fetchedComments !== false) {
                setComments(fetchedComments);
            }
        };
        fetchComments();

    }, [reservation.id]);

    const forceRemount = (callback) => {
        setRefreshKey((prevKey) => prevKey + 1);
        if (callback) {
            callback();
        }
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
            <Row gutter={[16, 24]} style={{paddingBottom: "10px"}} align="middle">
                <Col span={screens.md ? 8 : 24}>
                    <Title>{property.title}</Title>
                    <br/>
                    <Button type="primary" onClick={goBack}>Go Back</Button>
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
                <Title level={3}> Reservation Information </Title>
            </Divider>
            <Descriptions column={screens.md ? 3 : 1} layout="horizontal" bordered>
                {info.map((item) => (
                    <Descriptions.Item key={item.label} label={item.label}>
                        {item.value}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            {reservation.status === "Completed" && (
                <>
                    <Divider>
                        <Title level={3}>Comments</Title>
                    </Divider>

                    {comments.length > 0 ? (
                        <NestedComments comments={comments} key={refreshKey} forceRemount={forceRemount}/>
                    ) : (
                        <AddCommentForm reservationID={reservation.id} property={property}/>
                    )}
                </>
            )}


        </>
    );
};