import useInterval from '@/hooks/useInterval';
import { queryUnreadCountUsingGet } from '@/services/socialx/notificationController';
import {
  BellOutlined,
  CommentOutlined,
  InteractionOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Badge, Dropdown, MenuProps } from 'antd';
import { useState } from 'react';

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
    history.replace(`/notification/${key}`);
  };
  const onBellClick = () => {
    history.replace('/notification');
  };
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const res = await queryUnreadCountUsingGet({ queryAll: true });
      const allCount = res.data?.unreadInfoList?.[0]?.unreadCount ?? 0;
      setUnreadCount(allCount);
    } catch (error) {}
  };

  useInterval(loadUnreadCount, 10000);

  return (
    <Dropdown menu={{ items, onClick }} placement="bottom">
      <Badge count={unreadCount} overflowCount={10}>
        <BellOutlined onClick={onBellClick} style={{ fontSize: '150%' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotifyBar;
