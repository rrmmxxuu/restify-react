import {useEffect, useState} from "react";
import {getNotification, notificationSetRead} from "../../../services/notification";
import {isAuthed} from "../../../services/auth";
import {Avatar, Badge, Popover} from "antd";
import {BellFilled} from "@ant-design/icons";
import {formatDate} from "../../../utils/format_date";
import NotificationMenu from "./NotificationMenu";

const NotificationIcon = () => {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = await isAuthed();
            const fetchedNotifications = await getNotification(token);
            console.log(fetchedNotifications)
            setNotifications(fetchedNotifications);
        };

        fetchNotifications();
    }, []);

    const handleClearAll = async () => {
        const notificationIds = notifications.map(notification => notification.id);
        const token = await isAuthed()
        try {

            await Promise.all(
                notificationIds.map(notificationId =>
                    notificationSetRead(token, notificationId)
                )
            );
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const content = (
        <NotificationMenu
            notifications={notifications}
            handleClearAll={handleClearAll}
            formatDate={formatDate}
        />
    );

    return (
        <Popover content={content}>
            <Badge count={notifications.length}>
                <Avatar size={40} shape="square" icon={<BellFilled/>}/>
            </Badge>
        </Popover>
    );
};

export default NotificationIcon;

