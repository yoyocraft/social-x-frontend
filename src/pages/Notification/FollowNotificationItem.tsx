import { dateTimeFormat } from '@/services/utils/time';
import { Avatar, Badge, Button, List, Space, Typography } from 'antd';
import type React from 'react';

const { Text } = Typography;

interface Props {
  notification: API.NotificationResponse;
}

const FollowNotificationItem: React.FC<Props> = ({ notification }) => {
  /* TODO */
  const toggleFollow = () => {};
  return (
    <List.Item
      key={notification.notificationId}
      actions={[
        <Button
          key="follow-button"
          type={notification.followed ? 'default' : 'primary'}
          onClick={toggleFollow}
          style={{
            width: '100%',
            borderRadius: 20,
            fontWeight: 'bold',
            transition: 'all 0.3s',
          }}
        >
          {notification.followed ? '取关' : '关注'}
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar size={40} src={notification.senderAvatar || '/placeholder-user.jpg'} />}
        title={
          <Space size={8}>
            <Text strong style={{ fontSize: 15 }}>
              {notification.senderName}
            </Text>
            <Text type="secondary" style={{ fontSize: 15 }}>
              {notification.summary}
            </Text>
            {!notification.read && <Badge count="未读" style={{ fontSize: 12 }} />}
          </Space>
        }
        description={
          <Text type="secondary" style={{ fontSize: 12 }} key={notification.gmtCreate}>
            {notification.gmtCreate ? dateTimeFormat(notification.gmtCreate) : 'N/A'}
          </Text>
        }
      />
    </List.Item>
  );
};

export default FollowNotificationItem;
