import { queryUnreadCountUsingGet } from '@/services/socialx/notificationController';
import {
  BellOutlined,
  CommentOutlined,
  InteractionOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Badge, Dropdown, MenuProps } from 'antd';
import { useEffect, useState } from 'react';

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
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = ({ key }) => {
    navigate(`/notification/${key}`);
  };
  const onBellClick = () => {
    navigate('/notification');
  };
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = () => {
    queryUnreadCountUsingGet({
      queryAll: true,
    }).then((res) => {
      const allCount = res.data?.unreadInfoList?.[0]?.unreadCount ?? 0;
      setUnreadCount(allCount);
    });
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);
  return (
    <Dropdown menu={{ items, onClick }} placement="bottom">
      <Badge count={unreadCount} overflowCount={10}>
        <BellOutlined onClick={onBellClick} style={{ fontSize: '150%' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotifyBar;
