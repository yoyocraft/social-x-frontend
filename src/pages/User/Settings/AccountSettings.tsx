import { Typography } from 'antd';
import type React from 'react';

const { Title } = Typography;

const AccountSettings: React.FC = () => {
  return (
    <div>
      <Title level={2}>账号设置</Title>
      <p>这里是账号设置的内容。</p>
    </div>
  );
};

export default AccountSettings;
