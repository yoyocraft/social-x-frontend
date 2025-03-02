import { queryNotificationUsingGet } from '@/services/socialx/notificationController';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Card, Divider, Empty, List, Skeleton, Space, Tabs } from 'antd';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadNotificationData();
        firstLoad.current = false;
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      return;
    }
    cursorRef.current = '0';
    setNotificationList([]);
    loadNotificationData();
  }, [activeKey]);

  const operations = (
    <Space>
      <Button>已读当前</Button>
      <Button type="primary">全部已读</Button>
    </Space>
  );

  const renderNotificationItem = (item: API.NotificationResponse) => {
    if (activeKey === 'comment') {
      return <CommentNotificationItem notification={item} />;
    } else if (activeKey === 'interact') {
      return <InteractNotificationItem notification={item} />;
    } else if (activeKey === 'follow') {
      return <FollowNotificationItem notification={item} />;
    } else if (activeKey === 'system') {
      return <SystemNotificationItem notification={item} />;
    }

    return (
      <Card>
        <Empty description="暂无通知" />
      </Card>
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
          items={items}
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
