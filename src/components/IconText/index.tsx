import { Space } from 'antd';
import type React from 'react';

interface IconTextProps {
  icon: React.FC;
  text: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const IconText: React.FC<IconTextProps> = ({ icon, text, onClick, style }) => {
  const Icon = icon;

  return (
    <Space
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        color: '#666',
        ...style,
      }}
    >
      <Icon />
      <span>{text}</span>
    </Space>
  );
};

export default IconText;
