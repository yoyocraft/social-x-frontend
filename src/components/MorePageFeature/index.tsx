import { GithubOutlined, PhoneOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

const MorePageFeature = () => {
  const handleContactClick = () => {
    window.open('mailto:codejuzi@qq.com', '_blank');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/yoyocraft/social-x', '_blank');
  };

  return (
    <FloatButton.Group shape="circle">
      <FloatButton icon={<PhoneOutlined />} tooltip="联系我们" onClick={handleContactClick} />
      <FloatButton icon={<GithubOutlined />} tooltip="项目地址" onClick={handleGithubClick} />
      <FloatButton.BackTop visibilityHeight={600} />
    </FloatButton.Group>
  );
};

export default MorePageFeature;
