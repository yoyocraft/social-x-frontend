import {
  BookOutlined,
  DownOutlined,
  FireOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Dropdown, MenuProps } from 'antd';

const items: MenuProps['items'] = [
  {
    label: '发动态',
    key: 'post',
    icon: <FireOutlined />,
  },
  {
    label: '写文章',
    key: 'article',
    icon: <BookOutlined />,
  },
  {
    label: '问问题',
    key: 'question',
    icon: <QuestionCircleOutlined />,
  },
];

const UgcDropdown: React.FC = () => {
  const onBtnClick = () => {
    history.push('/article/publish');
  };
  const onItemClick: MenuProps['onClick'] = ({ key }) => {
    history.push(`/${key}/publish`);
  };

  return (
    <>
      <Dropdown.Button
        icon={<DownOutlined />}
        type="primary"
        menu={{ items, onClick: onItemClick }}
        onClick={onBtnClick}
      >
        发布
      </Dropdown.Button>
    </>
  );
};

export default UgcDropdown;
