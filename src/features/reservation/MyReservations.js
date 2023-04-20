import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, message, Modal, Row} from 'antd';
import {ReservationDetails} from "./components/ReservationDetails";
import {ReservationCard} from './components/ReservationCard';
import {AddReservationForm} from "./components/AddReservationForm";
import {getMyReservations, deleteMyReservation} from "../../services/reservation";
import {isAuthed} from "../../services/auth";
import {getSingleProperty} from "../../services/property";


const MyReservations = () => {
    const [activeView, setActiveView] = useState('list'); // list, details, edit
    const [reservations, setReservations] = useState([]);
    const [resolvedProperties, setResolvedProperties] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);


    useEffect(() => {
        const fetchReservations = async () => {
            const token = await isAuthed()
            const fetchedReservations = await getMyReservations(token);
            console.log(`fetchedreservations below:`);
            console.log(fetchedReservations);
            setReservations(fetchedReservations);
            console.log(`reservations: below`);


        };
        fetchReservations();

    }, []);

    useEffect(() => {
        console.log(reservations);
        const resolvedProps = Promise.all(reservations.map((reservation) => {
            return handleSelectedProperty(reservation.property);
        })).then(props => {
            console.log("props");
            console.log(props);
            setResolvedProperties(props);
        });
    }, [reservations]);

    /*useEffect(() => {
        console.log(resolvedProperties);
    }, [resolvedProperties]);*/

    const handleAddReservations = () => {
        setActiveView('add')
        // Navigate to the Add Property page or open the Add Property modal
    };

    const viewReservation = (reservationId, propertyID) => {
        const reservation = reservations.find((p) => p.id === reservationId);
        const property = resolvedProperties.find((p) => p.property_id === propertyID);
        setSelectedReservation(reservation);
        setSelectedProperty(property);
        setActiveView('details');
    };

    const editReservation = (reservationId) => {
        const reservation = reservations.find((p) => p.id === reservationId);
        setSelectedReservation(reservation);
        setActiveView('edit');
    };

    const deleteReservation = (reservationId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this reservation?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                console.log('Delete reservation:', reservationId);
                const token = await isAuthed()
                const deletion = await deleteMyReservation(token, reservationId)
                if (deletion) {
                    message.success("Successfully deleted!")
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

    const handleSelectedProperty= async (propertyID) => {
        const prop = await getSingleProperty(propertyID);
        return prop;
    }


    return (
        <>
            {activeView === 'list' && (
                <>
                    <Button type="primary" onClick={handleAddReservations}>
                        Add Reservation
                    </Button>
                    <Divider/>
                    <Row gutter={[24, 24]} style={{padding: '0 30px'}}>
                        {reservations.map((reservation, index) => (
                            <Col key={reservation.id} xs={24} sm={24} md={12} lg={8} xl={8}>
                                {resolvedProperties[index] && (
                                    <ReservationCard
                                        property={resolvedProperties[index]}
                                        reservation={reservation}
                                        cardStyle={{ width: '100%' }}
                                        onView={viewReservation}
                                        onDelete={deleteReservation}
                                    />
                                )}
                            </Col>
                        ))}

                    </Row>
                </>
            )}

            {activeView === 'details' && (
                <ReservationDetails property={selectedProperty} reservation={selectedReservation} goBack={goBack} onEdit={editReservation}/>
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