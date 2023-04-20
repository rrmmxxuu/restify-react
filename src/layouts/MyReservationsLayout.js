import {Layout} from "antd";
import React from "react";


import Navbar from "../features/Navbar/Navbar";
import Sidebar from "../components/Sidebar";
import MyReservations from "../features/reservation/MyReservations";
import MyFooter from "../components/Footer";



const MyReservationsLayout = () => {

    const {Header, Footer, Content} = Layout;

    return (
        <Layout style={{minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto'}}>
            <Header className="header">
                <Navbar/>
            </Header>
            <Layout>
                <Sidebar/>
                <Content className="content">
                    <MyReservations />
                </Content>
            </Layout>
            <Footer className="footer">
                <MyFooter/>
            </Footer>
        </Layout>
    );
}

export default MyReservationsLayout;