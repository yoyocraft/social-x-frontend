import { dateTimeFormat } from '@/services/utils/time';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, List, Space, Typography } from 'antd';
import type React from 'react';
import { calJumpUrl } from '../../services/utils/notification';

const { Text, Link } = Typography;

interface Props {
  notification: API.NotificationResponse;
}

const CommentNotificationItem: React.FC<Props> = ({ notification }) => {
  return (
    <List.Item
      key={notification.notificationId}
      actions={[
        <Text type="secondary" style={{ fontSize: 12 }} key={notification.gmtCreate}>
          {dateTimeFormat(notification.gmtCreate)}
        </Text>,
        <Space size={16} style={{ marginTop: 4 }} key={notification.notificationId}>
          {notification.targetId && (
            <Link
              key={notification.notificationId}
              href={calJumpUrl(notification)}
              style={{ color: '#1990ff' }}
            >
              查看原贴
            </Link>
          )}
        </Space>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar size={40} src={notification.senderAvatar} icon={<UserOutlined />} />}
        title={
          <Space size={8}>
            <Text strong style={{ fontSize: 15 }}>
              {notification.senderName}
            </Text>
            <Text type="secondary" style={{ fontSize: 15, fontWeight: 'bold' }}>
              {notification.summary}
            </Text>
            {/* 如果是未读的通知，显示“未读”标记 */}
            {!notification.read && <Badge count="未读" style={{ fontSize: 12 }} />}
          </Space>
        }
        description={
          <Text style={{ width: 200, fontSize: 16, color: '#333' }} ellipsis>
            {notification.content}
          </Text>
        }
      />
    </List.Item>
  );
};

export default CommentNotificationItem;
