import {Layout} from "antd";
import React from "react";


import Navbar from "../features/Navbar/Navbar";
import Sidebar from "../components/Sidebar";
import MyProperties from "../features/MyProperties/MyProperties";

import "./layout.css"
import MyFooter from "../components/Footer";


const MyPropertiesLayout = () => {

    const {Header, Footer, Content} = Layout;

    return (
        <Layout>
            <Header className="header">
                <Navbar/>
            </Header>
            <Layout>
                <Sidebar/>
                <Content className="content">
                    <MyProperties/>
                </Content>
            </Layout>
            <Footer className="footer">
                <MyFooter/>
            </Footer>
        </Layout>
    );
}

export default MyPropertiesLayout;
