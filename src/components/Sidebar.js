import React from 'react';
import {Grid, Layout, Menu} from 'antd';
import {CalendarOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';
import {useLocation, useNavigate} from 'react-router-dom';

import "../layouts/layout.css"

const {Sider} = Layout;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const screens = Grid.useBreakpoint()

    const getSelectedKey = () => {
        switch (location.pathname) {
            case '/profile':
                return '1';
            case '/my-properties':
                return '2';
            case '/my-reservations':
                return '3';
            default:
                return '1';
        }
    };

    return (
        <Sider className="sidebar"  collapsed={!screens.lg || !screens.md}>
            <Menu
                mode="inline"
                selectedKeys={[getSelectedKey()]}
                style={{height: '100%', borderRight: 0}}
            >
                <Menu.Item
                    key="1"
                    icon={<UserOutlined/>}
                    onClick={() => navigate('/profile')}
                >
                    My Profile
                </Menu.Item>
                <Menu.Item
                    key="2"
                    icon={<HomeOutlined/>}
                    onClick={() => navigate('/my-properties')}
                >
                    My Properties
                </Menu.Item>
                <Menu.Item
                    key="3"
                    icon={<CalendarOutlined/>}
                    onClick={()=> navigate('/my-reservations')}>
                    My Reservations
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
