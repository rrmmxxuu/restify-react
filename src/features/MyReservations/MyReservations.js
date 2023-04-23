import React, {useEffect, useState} from 'react';
import {Col, Divider, Empty, Grid, message, Modal, Radio, Row, Typography} from 'antd';
import {ReservationDetails} from "./components/ReservationDetails";
import {ReservationCard} from './components/ReservationCard';
import {AddReservationForm} from "./components/AddReservationForm";
import {
    deleteMyReservation,
    getMyReservations,
    getPropertyReservations,
    updateReservation
} from "../../services/reservation";
import {isAuthed} from "../../services/auth";
import {getMyProperties, getSingleProperty} from "../../services/property";
import {PropertyReservationCard} from "./components/PropertyReservationCard";
import {sendNotification} from "../../services/notification";
import useAuthRedirect from "../../hooks/useAuthRedirect";

const {Title} = Typography

const MyReservations = () => {
    const [activeView, setActiveView] = useState('list'); // list, details, edit
    const [reservations, setReservations] = useState([]);
    const [properties, setProperties] = useState([]);
    const [propertyReservations, setPropertyReservations] = useState([]);
    const [resolvedProperties, setResolvedProperties] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const screens = Grid.useBreakpoint
    const filterReservations = (reservations) => {
        return filterStatus === 'all'
            ? reservations
            : reservations.filter(reservation => reservation.status === filterStatus)
    };


    useAuthRedirect(isAuthed)

    useEffect(() => {
        const fetchReservations = async () => {
            const token = await isAuthed()
            const fetchedReservations = await getMyReservations(token);
            setReservations(fetchedReservations);
        };
        fetchReservations();


    }, []);

    useEffect(() => {
        const fetchProperties = async () => {
            const token = await isAuthed()
            const fetchedProperties = await getMyProperties(token);
            if (fetchedProperties !== false) {
                setProperties(fetchedProperties);
            }
        };
        fetchProperties();
    }, []);

    useEffect(() => {
        const fetchPropertiesReservations = async () => {
            const prop_reservations = [];
            for (let i = 0; i < properties.length; i++) {
                const prop_res = await getPropertyReservations(properties[i].property_id);
                if (prop_res) {
                    for (let i = 0; i < prop_res.length; i++) {
                        prop_reservations.push(prop_res[i]);
                    }
                }
            }
            setPropertyReservations(prop_reservations);
        };
        fetchPropertiesReservations();
    }, [properties]);


    useEffect(() => {
        Promise.all(reservations.map((reservation) => {
            return handleSelectedProperty(reservation.property);
        })).then(props => {
            setResolvedProperties(props);
        });
    }, [reservations]);

    const viewBooking = (reservationId, propertyID) => {
        const reservation = reservations.find((p) => p.id === reservationId);
        const property = resolvedProperties.find((p) => p.property_id === propertyID);
        setSelectedReservation(reservation);
        setSelectedProperty(property);
        setActiveView('details');
    };

    function findReservation(reservationsArray, id) {
        for (let i = 0; i < reservationsArray.length; i++) {
            for (let j = 0; j < reservationsArray[i].length; j++) {
                if (reservationsArray[i][j].id === id) {
                    return reservationsArray[i][j];
                }
            }
        }
        return null;
    }

    function findOwner(properties, propertyID) {
        for (let i = 0; i < properties.length; i++) {
            if (properties[i].property_id === propertyID) {
                return properties[i].owner;
            }
        }
        return null; // Reservation not found in array
    }

    const viewReservation = (reservationId, propertyID) => {
        const reservation = findReservation(propertyReservations, reservationId);
        const property = properties.find((p) => p.property_id === propertyID);
        setSelectedReservation(reservation);
        setSelectedProperty(property);
        setActiveView('details');
    };

    const checkReservation = async (reservationID) => {
        const values = findReservation(propertyReservations, reservationID);
        if (values.status === "Pending" || values.status === "Approved") {
            if (values.status === "Pending") {
                values.status = "Approved"
            } else {
                values.status = "Completed"
            }
            const token = await isAuthed()
            return updateReservation(token, values)
                .then(async () => {
                    message.success("Successfully approved a reservations!")
                    const tenant = values.tenant;
                    await sendNotification(token, tenant, "You got a booking approved!")
                })
                .catch((error) => {
                    message.error("Something went wrong... Please try again later")
                    console.error("Error:", error);
                });
        } else {
            message.error("Can not approve a reservations with status other than Pending or Approved")
        }

    }

    const closeReservation = async (reservationID) => {
        const values = findReservation(propertyReservations, reservationID);
        if (values.status === "Approved" || values.status === "Pending") {
            if (values.status === "Approved") {
                values.status = "Terminated"
            } else if (values.status === "Pending") {
                values.status = "Denied"
            }
            const token = await isAuthed()
            return updateReservation(token, values)
                .then(async () => {
                    message.success("Successfully denied a MyReservations!")
                    const tenant = values.tenant;
                    await sendNotification(token, tenant, "You got a booking rejected")
                })
                .catch((error) => {
                    message.error("Something went wrong... Please try again later")
                    console.error("Error:", error);
                });
        } else {
            message.error("Can not reject a MyReservations with status other than Approved or Pending")
        }
    }

    const editBooking = (reservationId) => {
        const reservation = reservations.find((p) => p.id === reservationId);
        setSelectedReservation(reservation);
        setActiveView('edit');
    };

    const deleteBooking = (reservationId) => {
        Modal.confirm({
            title: 'Are you sure you want to cancel this reservation?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                const token = await isAuthed()
                const reservation = reservations.find((p) => p.id === reservationId);
                let deletion
                if (reservation.status === "Approved" || reservation.status === "Pending") {
                    reservation.status = "Canceled";
                    deletion = await updateReservation(token, reservation)
                } else {
                    deletion = await deleteMyReservation(token, reservationId)
                }

                if (deletion) {
                    message.success("Successfully deleted!")
                    const owner = findOwner(resolvedProperties, reservation.property);
                    await sendNotification(token, owner, "You got a reservations for your property updated")
                } else {
                    message.error("Something went wrong... Please try again later.")
                }
            },
            onCancel() {
            },
        });
    };

    const goBack = () => {
        setActiveView('list');
        setSelectedReservation(null);
    };

    const handleSelectedProperty = async (propertyID) => {
        return await getSingleProperty(propertyID);
    }

    return (
        <>
            {activeView === 'list' && (
                <>
                    <Row style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Col span={24}>
                            <Title level={3} style={{
                                textAlign: screens.md ? 'center' : 'center',
                                paddingLeft: screens.md ? "30px" : 0
                            }}>
                                My Reservations
                            </Title>
                        </Col>
                        <Col span={24} style={{textAlign: 'center'}}>
                            <Radio.Group
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{display: 'flex', justifyContent: 'center'}}
                            >
                                <Radio.Button value="all">All</Radio.Button>
                                <Radio.Button value="Completed">Completed</Radio.Button>
                                <Radio.Button value="Pending">Pending</Radio.Button>
                                <Radio.Button value="Accepted">Accepted</Radio.Button>
                            </Radio.Group>
                        </Col>
                    </Row>

                    <Divider>
                        <Title level={4} style={{textAlign: 'center'}}>
                            My Bookings
                        </Title>
                    </Divider>
                    <Row gutter={[24, 24]} style={{padding: '0 30px'}}>
                        {reservations.length > 0 ? (
                            filterReservations(reservations).length > 0 ? (
                                filterReservations(reservations).map((reservation, index) => (
                                    <Col key={reservation.id} xs={24} sm={24} md={12} lg={8} xl={8}>
                                        {resolvedProperties[index] && (
                                            <ReservationCard
                                                property={resolvedProperties[index]}
                                                reservation={reservation}
                                                onView={viewBooking}
                                                onDelete={deleteBooking}
                                            />
                                        )}
                                    </Col>
                                ))
                            ) : (
                                <Col span={24} style={{textAlign: 'center'}}>
                                    <Empty/>
                                </Col>
                            )
                        ) : (
                            <Col span={24} style={{textAlign: 'center'}}>
                                <Empty/>
                            </Col>
                        )}
                    </Row>
                    <Divider>
                        <Title level={4} style={{textAlign: 'center'}}>
                            My Properties' Reservations
                        </Title>
                    </Divider>
                    <Row gutter={[24, 24]} style={{padding: '0 30px'}}>
                        {
                            (() => {
                                const filteredPropertyReservations = filterReservations(propertyReservations);

                                return filteredPropertyReservations.length > 0 ? (
                                    filteredPropertyReservations.map((reservation) => {
                                        const property = properties.find(prop => prop.property_id === reservation.property);
                                        return (
                                            <Col key={reservation.id} xs={24} sm={24} md={12} lg={8} xl={8}>
                                                {property && (
                                                    <PropertyReservationCard
                                                        property={property}
                                                        reservation={reservation}
                                                        onView={viewReservation}
                                                        onCheck={checkReservation}
                                                        onClose={closeReservation}
                                                    />
                                                )}
                                            </Col>
                                        );
                                    })
                                ) : (
                                    <Col span={24} style={{textAlign: 'center'}}>
                                        <Empty/>
                                    </Col>
                                )
                            })()
                        }
                    </Row>
                </>
            )}

            {activeView === 'details' && (
                <ReservationDetails property={selectedProperty} reservation={selectedReservation} goBack={goBack}
                                    onEdit={editBooking}/>
            )}

            {activeView === 'edit' && (
                <div>should show EditReservationForm </div>
            )}

            {activeView === 'add' && (
                <AddReservationForm onDiscard={goBack} property={selectedProperty}/>
            )}
        </>
    );
};

export default MyReservations;