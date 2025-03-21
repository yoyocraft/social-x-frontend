import { followUserUsingPost } from '@/services/socialx/userController';
import { dateTimeFormat } from '@/services/utils/time';
import { UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Badge, Button, List, message, Space, Typography } from 'antd';
import type React from 'react';
import { useState } from 'react';

const { Text } = Typography;

interface Props {
  notification: API.NotificationResponse;
}

const FollowNotificationItem: React.FC<Props> = ({ notification }) => {
  const { initialState } = useModel('@@initialState');
  const [hasFollowed, setHasFollowed] = useState(notification.followed);
  const toggleFollow = () => {
    followUserUsingPost({
      followUserId: notification.senderId,
      reqId: initialState?.currentUser?.userId,
      follow: !hasFollowed,
    })
      .then(() => {
        message.success(!hasFollowed ? '关注成功' : '取关成功');
        setHasFollowed(!hasFollowed);
      })
      .catch(() => {
        message.error('操作失败，请重试');
      });
  };
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
        avatar={<Avatar size={40} src={notification.senderAvatar} icon={<UserOutlined />} />}
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
          <Text type="secondary" key={notification.gmtCreate}>
            {dateTimeFormat(notification.gmtCreate)}
          </Text>
        }
      />
    </List.Item>
  );
};

export default FollowNotificationItem;
