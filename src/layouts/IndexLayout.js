import {Layout, Typography} from "antd";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import Navbar from "../features/Navbar/Navbar";
import PropertySearchForm from "../features/IndexPage/PropertySearchForm";
import {searchProperties} from "../services/property";

import "./layout.css"
import MyFooter from "../components/Footer";

const {Title} = Typography

const IndexLayout = () => {

    const {Header, Footer, Content} = Layout;

    const [, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        let queryParams = new URLSearchParams();

        if (values.province) {
            queryParams.append("province", values.province);
        }
        if (values.city) {
            queryParams.append("city", values.city);
        }
        if (values.dateRange) {
            queryParams.append("start_date", values.dateRange[0].format("YYYY-MM-DD"));
            queryParams.append("end_date", values.dateRange[1].format("YYYY-MM-DD"));
        }
        if (values.amenities) {
            values.amenities.forEach((amenity) => {
                queryParams.append("amenities", amenity);
            });
        }
        if (values.priceRange) {
            if (values.priceRange !== "inf") {
                const [price_min, price_max] = values.priceRange.split("-");
                queryParams.append("price_min", price_min);
                if (price_max !== "+") {
                    queryParams.append("price_max", price_max);
                }
            }
        }
        queryParams.append("limit", 3);
        queryParams.append("offset", 0);

        let queryString = queryParams.toString();
        const results = await searchProperties(queryString);
        setSearchResults(results.results);
        sessionStorage.setItem(
            "searchResultsState",
            JSON.stringify({
                searchResults: results.results,
                totalResults: results.count,
                nextPage: results.next,
                previousPage: results.previous,
            })
        );
        navigate("/results");
    };


    return (
        <Layout style={{minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto'}}>
            <Header className="header">
                <Navbar/>
            </Header>
            <Content className="content">
                <Title style={{marginTop: '50px'}}>Your Rental,</Title>
                <Title level={2} style={{paddingBottom: '50px'}}>
                    Starts Here.
                </Title>
                <PropertySearchForm onFinish={onFinish}/>
            </Content>
            <Footer className="footer">
                <MyFooter/>
            </Footer>
        </Layout>
    );
}

export default IndexLayout;
