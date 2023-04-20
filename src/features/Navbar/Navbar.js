import React, {useState, useEffect} from "react";

import {Col, Row, Anchor, Space} from "antd";

import {isAuthed} from "../../services/auth";

import AvatarButton from "./components/AvatarButton";
import LoginModal from "../../components/modals/login_modal";
import NotificationIcon from "./components/NotificationIcon";

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await isAuthed();
            if (token) {
                setUser(token);
            } else {
                setUser(null);
            }
        };

        checkAuth();
    }, []);
    const handleUserChange = async () => {
        const token = await isAuthed()
        setUser(token)
    }

    return (
        <>
            <Row className={"navbar"} align={"middle"} justify={"space-between"}
                 style={{margin: 0, width: "100%", maxWidth: "100%"}}>
                <Col>
                    <Anchor className={"logo"} affix={false}>
                        <Anchor.Link href="/" title={<span style={{
                            fontFamily: "sans-serif",
                            fontSize: "40px",
                        }}>Restify</span>} >
                        </Anchor.Link>
                    </Anchor>
                </Col>
                <Col style={{paddingRight: "20px"}}>
                    {user ? (
                        <Space size="middle">
                            <AvatarButton user={user} handleLogout={handleUserChange}/>
                            <NotificationIcon />
                        </Space>
                    ) : (
                        <LoginModal user={user} handleLogin={handleUserChange}/>
                    )}
                </Col>
            </Row>
        </>
    );
}

export default Navbar;
