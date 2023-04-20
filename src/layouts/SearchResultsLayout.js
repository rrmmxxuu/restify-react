import {Col, Divider, Layout, Pagination, Row, Typography} from "antd";
import React, {useEffect, useState} from "react";
import Navbar from "../features/Navbar/Navbar";
import {useLocation, useNavigate} from "react-router-dom";
import ResultCard from "../features/IndexPage/ResultCard";
import {searchProperties} from "../services/property";

import "./layout.css"
import MyFooter from "../components/Footer";

const {Title} = Typography

const SearchResultsLayout = () => {
    const {Header, Content, Footer} = Layout;

    const location = useLocation();
    const navigate = useNavigate()

    const {
        searchResults: initialSearchResults,
        totalResults: initialTotalResults,
        nextPage: initialNextPage,
        previousPage: initialPreviousPage,
    } = location.state || {};

    const [searchResults, setSearchResults] = useState(initialSearchResults || []);
    const [totalResults, setTotalResults] = useState(initialTotalResults || 0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(initialNextPage || null);
    const [previousPage, setPreviousPage] = useState(initialPreviousPage || null);

    useEffect(() => {
        // Retrieve the state data from session storage
        const searchResultsState = JSON.parse(sessionStorage.getItem("searchResultsState"));

        // Check if state data exists and update the component state
        if (searchResultsState) {
            setSearchResults(searchResultsState.searchResults);
            setTotalResults(searchResultsState.totalResults);
            setNextPage(searchResultsState.nextPage);
            setPreviousPage(searchResultsState.previousPage);
        }
    }, []);

    const handlePagination = async (page) => {
        setCurrentPage(page);

        const targetUrl = page > currentPage ? nextPage : previousPage;
        navigate(`/results?page=${page}`);
        const results = await searchProperties(targetUrl);
        setSearchResults(results.results);
        setTotalResults(results.count);
        setNextPage(results.next);
        setPreviousPage(results.previous);
    };

    return (
        <Layout style={{minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto'}}>
            <Header className="header">
                <Navbar/>
            </Header>
            <Content className="content">
                <Title level={3} style={{marginTop: "40px"}}> {totalResults} results found </Title>
                <Divider/>
                <Row gutter={[24, 24]} style={{padding: "0 30px"}}>
                    {searchResults.map((result) => (
                        <Col key={result.property_id} xs={24} sm={24} md={12} lg={8} xl={8}>
                            <ResultCard key={result.property_id} property={result}/>
                        </Col>
                    ))}
                </Row>
                <div style={{textAlign: "center", padding: "16px"}}>
                    <Pagination
                        current={currentPage}
                        total={totalResults}
                        pageSize={3}
                        onChange={(page) => {
                            handlePagination(page);
                        }}
                    />
                </div>
            </Content>
            <Footer>
                <MyFooter/>
            </Footer>
        </Layout>
    );
};

export default SearchResultsLayout;
