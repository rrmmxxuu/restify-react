import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, message, Modal, Row, Typography} from 'antd';
import {MyPropertyDetails} from "./components/MyPropertyDetails";
import {EditPropertyForm} from "./components/EditPropertyForm";
import {PropertyCard} from './components/PropertyCard';
import {AddPropertyForm} from "./components/AddPropertyForm";
import {deleteMyProperty, getMyProperties} from "../../services/property";
import {isAuthed} from "../../services/auth";

const {Title} = Typography

const MyProperties = () => {

    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [activeView, setActiveView] = useState('list'); // list, details, edit

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

    const handleAddProperty = () => {
        setActiveView('add')
        // Navigate to the Add Property page or open the Add Property modal
    };

    const viewProperty = (propertyId) => {
        const property = properties.find((p) => p.property_id === propertyId);
        setSelectedProperty(property);
        setActiveView('details');
    };

    const editProperty = (propertyId) => {
        const property = properties.find((p) => p.property_id === propertyId);
        setSelectedProperty(property);
        setActiveView('edit');
    };

    const deleteProperty = (propertyId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this property?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                console.log('Delete Property:', propertyId);
                const token = await isAuthed()
                const deletion = await deleteMyProperty(token, propertyId)
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
        setSelectedProperty(null);
    };

    return (
        <>
            {activeView === 'list' && (
                <><
                    Title level={3} style={{marginTop: "40px"}}> My Properties </Title>
                    <Button type="primary" onClick={handleAddProperty}>
                        Add Property
                    </Button>
                    <Divider/>
                    <Row gutter={[24, 24]} style={{padding: '0 30px'}}>
                        {properties.map((property) => (
                            <Col key={property.property_id} xs={24} sm={24} md={12} lg={8} xl={8}>
                                <PropertyCard
                                    property={property}
                                    onView={viewProperty}
                                    onEdit={editProperty}
                                    onDelete={deleteProperty}
                                />
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {activeView === 'details' && (
                <MyPropertyDetails property={selectedProperty} goBack={goBack}/>
            )}

            {activeView === 'edit' && (
                <EditPropertyForm property={selectedProperty} goBack={goBack} onDiscard={goBack} onUpdate={goBack}/>
            )}

            {activeView === 'add' && (
                <AddPropertyForm onDiscard={goBack}/>
            )}
        </>
    );
};

export default MyProperties;
