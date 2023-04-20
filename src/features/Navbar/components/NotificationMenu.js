import {Button, Divider, Empty, Typography} from 'antd';
import {formatDate} from '../../../utils/format_date';

const {Text} = Typography;
const {Title} = Typography

const NotificationMenu = ({notifications, handleClearAll}) => {

    const menuItems = notifications && notifications.length > 0 ? (
        notifications.map((notification, index) => (
            <div key={index} style={{padding: '8px 12px'}}>
                {notification.message}
                <br/>
                <Text type="secondary" style={{fontSize: '12px'}}>
                    {formatDate(notification.time_created)}
                </Text>
                {index !== notifications.length - 1 && <Divider style={{margin: '8px 0'}}/>}
            </div>
        ))
    ) : (
        <div style={{padding: '8px 12px'}}>
            <Empty description="No notifications"/>
        </div>
    );

    return (
        <div style={{minWidth: '200px'}}>
            <Title level={5}>Notifications</Title>
            {menuItems}
            {notifications && notifications.length > 0 && (
                <>
                    <Divider style={{margin: '8px 0'}}/>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button type="link" onClick={handleClearAll}>
                            Clear all notifications
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationMenu;
