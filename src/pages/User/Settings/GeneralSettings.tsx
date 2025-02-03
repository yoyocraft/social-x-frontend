import { Typography } from 'antd';
import type React from 'react';

const { Title } = Typography;

const GeneralSettings: React.FC = () => {
  return (
    <div>
      <Title level={2}>通用设置</Title>
      <p>这里是通用设置的内容。</p>
    </div>
  );
};

export default GeneralSettings;
