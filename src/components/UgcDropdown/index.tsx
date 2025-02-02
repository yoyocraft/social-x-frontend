import {
  BookOutlined,
  DownOutlined,
  FireOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Dropdown, MenuProps, message } from 'antd';

const items: MenuProps['items'] = [
  {
    label: '写文章',
    key: 'article',
    icon: <BookOutlined />,
  },
  {
    label: '发动态',
    key: 'post',
    icon: <FireOutlined />,
  },
  {
    label: '问问题',
    key: 'question',
    icon: <QuestionCircleOutlined />,
  },
];

const UgcDropdown: React.FC = () => {
  const onBtnClick = () => {
    message.info('Click on left button.');
  };
  const onItemClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  return (
    <>
      <Dropdown.Button
        icon={<DownOutlined />}
        type="primary"
        menu={{ items, onClick: onItemClick }}
        onClick={onBtnClick}
      >
        创作者中心
      </Dropdown.Button>
    </>
  );
};

export default UgcDropdown;
