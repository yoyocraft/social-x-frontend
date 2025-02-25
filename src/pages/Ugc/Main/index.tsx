import { Footer } from '@/components';
import {
  queryFollowPageUgcUsingGet,
  queryHotUgcUsingGet,
  queryMainPageUgcUsingGet,
  queryRecommendPageUgcUsingGet,
} from '@/services/socialx/ugcController';
import { queryUgcCategoryUsingGet } from '@/services/socialx/ugcMetadataController';
import { EyeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import {
  Affix,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Layout,
  List,
  Menu,
  Row,
  Skeleton,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Sider, Content } = Layout;

const initSideMenuItems = [
  { key: 'follow', label: '关注', icon: '👥' },
  { key: 'comprehensive', label: '综合', icon: '📚' },
];

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const tabItems: TabsProps['items'] = [
  {
    key: 'recommended',
    label: '推荐',
  },
  {
    key: 'latest',
    label: '最新',
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [hotLoading, setHotLoading] = useState(false);
  const [ugcList, setUgcList] = useState<API.UgcResponse[]>([]);
  const [hotUgcList, setHotUgcList] = useState<API.UgcResponse[]>([]);
  const [cursor, setCursor] = useState('0');
  const [hasMore, setHasMore] = useState(true);
  const [sideMenu, setSideMenu] = useState(initSideMenuItems);
  const [categoryId, setCategoryId] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  const [viewFollow, setViewFollow] = useState(false);

  const setUgcData = (res: API.ResultPageCursorResultStringUgcResponse_) => {
    setUgcList((prev) => [...prev, ...(res.data?.data || [])]);
    setCursor(res.data?.cursor || '0');
    setHasMore(!!res.data?.data?.length);
  };

  const timeFeedUgc = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await queryMainPageUgcUsingGet({
        cursor,
        ugcType: 'ARTICLE',
        categoryId,
      });
      setUgcData(res);
    } finally {
      setLoading(false);
    }
  };

  const recommendFeedUgc = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const res = await queryRecommendPageUgcUsingGet({
        cursor,
        ugcType: 'ARTICLE',
        categoryId,
        recommendFeed: true,
      });
      setUgcData(res);
    } finally {
      setLoading(false);
    }
  };

  const followFeedUgc = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const res = await queryFollowPageUgcUsingGet({
        cursor,
        ugcType: 'ARTICLE',
        followFeed: true,
      });
      setUgcData(res);
    } finally {
      setLoading(false);
    }
  };

  const loadUgcData = async () => {
    if (viewFollow) {
      await followFeedUgc();
      return;
    }

    if (activeTab === 'recommended') {
      await recommendFeedUgc();
    } else {
      await timeFeedUgc();
    }
  };

  const loadHotUgc = () => {
    if (hotLoading) {
      return;
    }
    setHotLoading(true);
    queryHotUgcUsingGet()
      .then((res) => {
        setHotUgcList(res.data || []);
      })
      .finally(() => {
        setHotLoading(false);
      });
  };

  const loadSideMenu = () => {
    queryUgcCategoryUsingGet().then((res) => {
      const categories = res.data?.ugcCategoryList?.map((item) => {
        return {
          key: item.categoryId,
          icon: item.icon,
          label: item.categoryName,
        };
      });
      // @ts-ignore
      setSideMenu([...initSideMenuItems, ...(categories || [])]);
    });
  };

  useEffect(() => {
    Promise.all([loadSideMenu(), timeFeedUgc(), loadHotUgc()]);
  }, []);

  useEffect(() => {
    setUgcList([]);
    setCursor('0');
    setHasMore(true);
    Promise.all([loadUgcData()]);
  }, [categoryId, viewFollow, activeTab]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Affix offsetTop={55}>
        <Sider theme="light" width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['comprehensive']}
            items={sideMenu.map((item) => ({
              key: item.key,
              icon: <span>{item.icon}</span>,
              label: item.label,
            }))}
            style={{ height: '100%', borderRight: 0 }}
            onSelect={(item) => {
              if (item.key === 'follow') {
                setViewFollow(true);
                return;
              }
              if (item.key === 'comprehensive') {
                setCategoryId('');
              } else {
                setCategoryId(item.key);
              }
              setViewFollow(false);
            }}
          />
        </Sider>
      </Affix>

      <Layout style={{ padding: '0 12px 12px' }}>
        <Content style={{ margin: 0, minHeight: 280 }}>
          <Row gutter={12}>
            <Col span={18}>
              <Card>
                {!viewFollow && (
                  <Tabs
                    size="large"
                    defaultActiveKey="recommended"
                    items={tabItems}
                    onChange={(key) => {
                      setActiveTab(key);
                    }}
                  />
                )}

                <InfiniteScroll
                  dataLength={ugcList.length}
                  next={loadUgcData}
                  hasMore={hasMore}
                  loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                  endMessage={<Divider plain>没有更多啦～</Divider>}
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={ugcList}
                    renderItem={(item) => (
                      <List.Item
                        key={item.title}
                        actions={[
                          <IconText
                            icon={EyeOutlined}
                            text={item.viewCount?.toString() || '0'}
                            key="list-vertical-view-o"
                          />,
                          <IconText
                            icon={LikeOutlined}
                            text={item.likeCount?.toString() || '0'}
                            key="list-vertical-like-o"
                          />,
                          <IconText
                            icon={StarOutlined}
                            text={item.collectCount?.toString() || '0'}
                            key="list-vertical-star-o"
                          />,
                        ]}
                        extra={item.cover && <img alt="logo" src={item.cover} />}
                      >
                        <List.Item.Meta
                          title={<a href={item.ugcId}>{item.title}</a>}
                          description={item.summary}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              size="small"
                              style={{ marginRight: 8 }}
                              src={item.authorAvatar}
                            />
                            <span>{item.authorName}</span>
                          </div>
                          <div>
                            {item.tags && item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </Card>
            </Col>

            <Col span={6}>
              <div>
                <Card style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <Typography.Text strong style={{ fontSize: 20 }}>
                        中午好！
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        点亮在社区的每一天
                      </Typography.Text>
                    </div>
                    <Button type="primary" disabled>
                      去签到（TODO）
                    </Button>
                  </div>
                </Card>

                <Card title="📈 文章榜">
                  <List
                    size="small"
                    dataSource={hotUgcList}
                    renderItem={(item) => (
                      <List.Item>
                        <Typography.Link
                          href="#"
                          style={{
                            display: 'inline-block',
                            maxWidth: 'calc(100% - 38px)',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            verticalAlign: 'middle',
                          }}
                        >
                          {item.title}
                        </Typography.Link>
                      </List.Item>
                    )}
                  />
                </Card>
                <Footer />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
