import { Typography } from 'antd';
import type React from 'react';

const { Title } = Typography;

const NotificationSettings: React.FC = () => {
  return (
    <div>
      <Title level={2}>消息设置</Title>
      <p>这里是消息设置的内容。</p>
    </div>
  );
};

export default NotificationSettings;
