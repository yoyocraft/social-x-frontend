import MarkdownPreview from '@uiw/react-markdown-preview';
import { Avatar, List } from 'antd';
import type React from 'react';

interface Props {
  notification: API.NotificationResponse;
}

const SystemNotificationItem: React.FC<Props> = ({ notification }) => {
  return (
    <List.Item key={notification.notificationId}>
      <List.Item.Meta
        avatar={<Avatar size={40} src={notification.senderAvatar || '/placeholder-user.jpg'} />}
        title={
          <MarkdownPreview
            source={notification.content}
            style={{
              backgroundColor: 'transparent',
              color: 'black',
              fontSize: 18,
            }}
            className="markdown-preview"
          />
        }
      />
    </List.Item>
  );
};

export default SystemNotificationItem;
