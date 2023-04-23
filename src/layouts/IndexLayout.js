import {Col, Layout, message, Row, Typography} from "antd";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import Navbar from "../features/Navbar/Navbar";
import PropertySearchForm from "../features/IndexPage/PropertySearchForm";
import {searchProperties} from "../services/property";

import "./index.css"
import "./particles_effects.css"
import MyFooter from "../components/Footer";

const {Title} = Typography

const IndexLayout = () => {

    const {Header, Footer, Content} = Layout;

    const [, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setIsLoading(true)

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
                if (values.priceRange !== "3000+") {
                    const [price_min, price_max] = values.priceRange.split("-");
                    queryParams.append("price_min", price_min);
                    queryParams.append("price_max", price_max);
                } else {
                    queryParams.append("price_min", 3000);
                }
            }
        }
        if (values.sortBy) {
            queryParams.append("sort_by", values.sortBy)
        }

        queryParams.append("limit", 6);
        queryParams.append("offset", 0);

        let queryString = queryParams.toString();

        const results = await searchProperties(queryString);
        if (results.results) {
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
            setIsLoading(false)
            navigate("/results");
        } else {
            setIsLoading(false)
            message.error("Something went wrong, please try again later")
        }
    };

    return (
        <>
            <Layout className="layout-index">
                <Header className="header-index">
                    <Navbar/>
                </Header>
                <Content className="content-index">
                    <Row>
                        <Col span={24}>
                            <Title
                                className="gradient-text"
                                style={{fontFamily: 'Archivo', paddingTop: "50px", fontSize: "72px", textAlign: "center"}}>
                                <span>Welcome to Your Next Adventure.</span>
                            </Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Title
                                className="gradient-text"
                                style={{paddingBottom: '50px', fontFamily: 'Archivo', fontSize: "52px", textAlign: "center"}}>
                                <span>新的旅程，就此开始。</span>
                            </Title>
                        </Col>
                    </Row>
                    <PropertySearchForm onFinish={onFinish} isLoading={isLoading}/>
                    {Array.from({length: 100}).map((_, i) => (
                        <div className="circle-container" key={i}>
                            <div className="circle"></div>
                        </div>
                    ))}
                </Content>
                <Footer className="footer-index">
                    <MyFooter/>
                </Footer>
            </Layout>
        </>
    );
}

export default IndexLayout;
