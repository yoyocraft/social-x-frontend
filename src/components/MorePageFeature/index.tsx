import { PhoneOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

const MorePageFeature = () => {
  const handleContactClick = () => {
    window.open('mailto:codejuzi@qq.com', '_blank');
  };

  return (
    <FloatButton.Group shape="circle">
      <FloatButton icon={<PhoneOutlined />} tooltip="联系我们" onClick={handleContactClick} />
      <FloatButton.BackTop visibilityHeight={600} />
    </FloatButton.Group>
  );
};

export default MorePageFeature;
