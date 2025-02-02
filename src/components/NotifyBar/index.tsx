import {
  BellOutlined,
  CommentOutlined,
  InteractionOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Dropdown, MenuProps, message } from 'antd';

const items: MenuProps['items'] = [
  {
    key: 'comment',
    label: '评论',
    icon: <CommentOutlined />,
  },
  {
    key: 'interact',
    label: '赞和收藏',
    icon: <InteractionOutlined />,
  },
  {
    key: 'follower',
    label: '新增粉丝',
    icon: <UsergroupAddOutlined />,
  },
  {
    key: 'system',
    label: '系统通知',
    icon: <NotificationOutlined />,
  },
];

const NotifyBar: React.FC = () => {
  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`);
  };
  return (
    <Dropdown menu={{ items, onClick }} placement="bottom">
      <BellOutlined style={{ fontSize: '150%' }} />
    </Dropdown>
  );
};

export default NotifyBar;
