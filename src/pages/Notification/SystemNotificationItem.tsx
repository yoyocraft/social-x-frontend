import MdViewer from '@/components/MdViewer';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, List, Space, Typography } from 'antd';
import type React from 'react';

interface Props {
  notification: API.NotificationResponse;
}

const { Text } = Typography;

const SystemNotificationItem: React.FC<Props> = ({ notification }) => {
  return (
    <List.Item key={notification.notificationId}>
      <List.Item.Meta
        avatar={<Avatar size={40} src={notification.senderAvatar} icon={<UserOutlined />} />}
        title={
          <Space size={8}>
            <Text strong style={{ fontSize: 15 }}>
              {notification.summary}
            </Text>
          </Space>
        }
        description={<MdViewer value={notification.content} />}
      />
    </List.Item>
  );
};

export default SystemNotificationItem;
