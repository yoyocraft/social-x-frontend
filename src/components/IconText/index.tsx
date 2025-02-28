import { Button, Typography } from 'antd';
import React from 'react';

interface IconTextProps {
  icon: React.FC;
  text: string;
  onClick?: (obj?: any) => void;
}

const IconText: React.FC<IconTextProps> = ({ icon, text, onClick }) => (
  <>
    <Button type="text" onClick={onClick}>
      {React.createElement(icon)}
      <Typography.Text>{text}</Typography.Text>
    </Button>
  </>
);

export default IconText;
