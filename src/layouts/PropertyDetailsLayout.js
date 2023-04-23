import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Layout} from "antd";

import {getSingleProperty} from "../services/property";
import Navbar from "../features/Navbar/Navbar";
import PropertyDetails from "../features/PropertyDetailPage/PropertyDetails";
import MyFooter from "../components/Footer";

const {Header, Content, Footer} = Layout

const PropertyDetailsLayout = () => {
    const {propertyId} = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const propertyDetails = await getSingleProperty(propertyId);
                setProperty(propertyDetails);
            } catch (error) {
                console.error("Failed to fetch property details:", error);
            }
        };

        fetchDetails();
    }, [propertyId]);

    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <Layout className="layout">
            <Header className="header">
                <Navbar/>
            </Header>
            <Content className="content">
                <PropertyDetails property={property} />
            </Content>
            <Footer className="footer">
                <MyFooter/>
            </Footer>
        </Layout>
    );
};

export default PropertyDetailsLayout;
