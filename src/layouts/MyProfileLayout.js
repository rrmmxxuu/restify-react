import {Layout} from "antd";
import React, {useState} from "react";


import Navbar from "../features/Navbar/Navbar";
import AvatarContext from "../context/AvatarContext";
import Sidebar from "../components/Sidebar";
import MyProfile from "../features/MyProfile/MyProfile";

import "./layout.css"
import MyFooter from "../components/Footer";

const MyProfileLayout = () => {

    const {Header, Footer, Content} = Layout;
    const [refetchAvatar, setRefetchAvatar] = useState(false);

    const triggerRefetchAvatar = () => {
        setRefetchAvatar(!refetchAvatar);
    };

    return (
         <Layout style={{minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto'}}>
            <AvatarContext.Provider value={{refetchAvatar, triggerRefetchAvatar}}>
                <Header className="header">
                    <Navbar/>
                </Header>
                <Layout>
                    <Sidebar/>
                    <Content className="content">
                        <MyProfile/>
                    </Content>
                </Layout>
            </AvatarContext.Provider>
            <Footer className="footer">
                <MyFooter/>
           </Footer>
        </Layout>
    );
}

export default MyProfileLayout;
