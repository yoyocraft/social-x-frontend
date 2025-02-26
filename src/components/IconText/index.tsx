import { Space } from 'antd';
import React from 'react';

interface IconTextProps {
  icon: React.FC;
  text: string;
  onClick?: () => void;
}

const IconText: React.FC<IconTextProps> = ({ icon, text, onClick }) => (
  <Space onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default IconText;
