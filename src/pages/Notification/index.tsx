import {
  queryNotificationUsingGet,
  queryUnreadCountUsingGet,
  readAllNotificationByTypeUsingPost,
  readAllNotificationUsingPost,
  readSingleNotificationUsingPost,
} from '@/services/socialx/notificationController';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel, useParams } from '@umijs/max';
import { Badge, Button, Card, Divider, Empty, List, message, Skeleton, Space, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentNotificationItem from './CommentNotificationItem';
import FollowNotificationItem from './FollowNotificationItem';
import InteractNotificationItem from './InteractNotificationItem';
import SystemNotificationItem from './SystemNotificationItem';

const items = [
  { label: '评论', key: 'comment' },
  { label: '赞和评论', key: 'interact' },
  { label: '关注', key: 'follow' },
  { label: '系统通知', key: 'system' },
];

const NotificationPage = () => {
  const params = useParams();
  const { type } = params;

  const [activeKey, setActiveKey] = useState(type || 'comment');
  const [notificationList, setNotificationList] = useState<API.NotificationResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef('0');
  const firstLoad = useRef(true);
  const { initialState } = useModel('@@initialState');

  const [unreadCount, setUnreadCount] = useState<{ [key: string]: number }>({
    comment: 0,
    interact: 0,
    follow: 0,
    system: 0,
  });

  // 监听 URL 变化，更新 activeKey
  useEffect(() => {
    if (type && type !== activeKey) {
      setActiveKey(type);
    }
  }, [type]);

  // 处理 tab 切换，同时更新 URL
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    history.push(`/notification/${key}`);
  };

  const markAsRead = async (notificationId: string, type: string) => {
    try {
      await readSingleNotificationUsingPost({ notificationId });

      setNotificationList((prevList) =>
        prevList.map((item) =>
          item.notificationId === notificationId ? { ...item, read: true } : item,
        ),
      );

      // 减少未读计数（确保不变负数）
      setUnreadCount((prev) => ({
        ...prev,
        [type]: Math.max((prev[type] || 0) - 1, 0),
      }));
    } catch (error) {
      message.error('标记已读失败，请重试');
    }
  };

  const markTypeNotificationRead = async () => {
    try {
      await readAllNotificationByTypeUsingPost({
        notificationType: activeKey.toUpperCase(),
      });

      setNotificationList((prevList) =>
        prevList.map((item) =>
          item.notificationType === activeKey.toUpperCase() ? { ...item, read: true } : item,
        ),
      );

      // 当前类型未读数归零
      setUnreadCount((prev) => ({
        ...prev,
        [activeKey]: 0,
      }));
    } catch (error) {
      message.error('标记已读失败，请重试');
    }
  };

  const markAllNotificationRead = async () => {
    try {
      await readAllNotificationUsingPost({
        reqId: initialState?.currentUser?.userId,
      });

      setNotificationList((prevList) => prevList.map((item) => ({ ...item, read: true })));

      // 所有未读数清零
      setUnreadCount({
        comment: 0,
        interact: 0,
        follow: 0,
        system: 0,
      });
    } catch (error) {
      message.error('标记已读失败，请重试');
    }
  };

  const loadNotificationData = async () => {
    try {
      const res = await queryNotificationUsingGet({
        notificationType: activeKey.toUpperCase(),
        cursor: cursorRef.current,
      });

      setNotificationList((prevData) => [...prevData, ...(res.data?.data || [])]);
      setHasMore(res.data?.hasMore || false);
      cursorRef.current = res.data?.cursor || '0';
    } catch (error: any) {}
  };

  const queryUnreadNotificationCount = async () => {
    try {
      const res = await queryUnreadCountUsingGet({});
      if (res.data?.unreadInfoList) {
        const newUnreadCount: { [key: string]: number } = {
          comment: 0,
          interact: 0,
          follow: 0,
          system: 0,
        };

        res.data.unreadInfoList.forEach((item: API.NotificationUnreadInfo) => {
          const key = item.notificationType ? item.notificationType.toLowerCase() : '';
          if (newUnreadCount.hasOwnProperty(key)) {
            newUnreadCount[key] = item.unreadCount ?? 0;
          }
        });

        setUnreadCount(newUnreadCount);
      }
      console.log('unreadCount', unreadCount);
    } catch (error) {
      console.error('获取未读消息失败', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadNotificationData();
        firstLoad.current = false;
      } catch (error) {}
    };

    fetchData();
    queryUnreadNotificationCount();
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      return;
    }
    cursorRef.current = '0';
    setNotificationList([]);
    loadNotificationData();
  }, [activeKey]);

  const tabItems = items.map((tab) => ({
    ...tab,
    label: (
      <Badge count={unreadCount[tab.key]} offset={[8, -2]} size="small">
        {tab.label}
      </Badge>
    ),
  }));

  const operations = (
    <Space>
      <Button onClick={markTypeNotificationRead}>已读当前</Button>
      <Button onClick={markAllNotificationRead} type="primary">
        全部已读
      </Button>
    </Space>
  );

  const renderNotificationItem = (item: API.NotificationResponse) => {
    return (
      <div onClick={() => item.notificationId && markAsRead(item.notificationId, activeKey)}>
        {activeKey === 'comment' && <CommentNotificationItem notification={item} />}
        {activeKey === 'interact' && <InteractNotificationItem notification={item} />}
        {activeKey === 'follow' && <FollowNotificationItem notification={item} />}
        {activeKey === 'system' && <SystemNotificationItem notification={item} />}
      </div>
    );
  };

  return (
    <PageContainer
      header={{
        title: '',
        breadcrumb: {},
      }}
      ghost
    >
      <Card>
        <Tabs
          size="large"
          items={tabItems}
          activeKey={activeKey}
          onChange={handleTabChange}
          tabBarExtraContent={operations}
        />
        <InfiniteScroll
          dataLength={notificationList.length}
          next={loadNotificationData}
          hasMore={hasMore}
          loader={<Skeleton avatar active />}
          endMessage={<Divider plain>没有更多啦～</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout={type === 'follow' ? 'horizontal' : 'vertical'}
            size="large"
            dataSource={notificationList}
            renderItem={(item) => renderNotificationItem(item)}
            locale={{
              emptyText: <Empty description="暂无通知" />,
            }}
          />
        </InfiniteScroll>
      </Card>
    </PageContainer>
  );
};

export default NotificationPage;
