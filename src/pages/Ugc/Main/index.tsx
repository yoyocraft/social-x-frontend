import { Footer } from '@/components';
import CheckInCard from '@/components/CheckInCard';
import IconText from '@/components/IconText';
import TagList from '@/components/TagList';
import UgcHotRank from '@/components/UgcHotRank';
import {
  listFollowUgcFeedUsingGet,
  listRecommendUgcFeedUsingGet,
  listTimelineUgcFeedUsingGet,
} from '@/services/socialx/ugcController';
import { queryUgcCategoryUsingGet } from '@/services/socialx/ugcMetadataController';
import { dateTimeFormat } from '@/services/utils/time';
import { EyeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import {
  Affix,
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
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Sider, Content } = Layout;

const initSideMenuItems = [
  { key: 'follow', label: '关注', icon: '👥' },
  { key: 'comprehensive', label: '综合', icon: '📚' },
];

const tabItems = [
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
  const [ugcList, setUgcList] = useState<API.UgcResponse[]>([]);
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
      const res = await listTimelineUgcFeedUsingGet({
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
      const res = await listRecommendUgcFeedUsingGet({
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
      const res = await listFollowUgcFeedUsingGet({
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
    Promise.all([loadSideMenu(), timeFeedUgc()]);
  }, []);

  useEffect(() => {
    setUgcList([]);
    setCursor('0');
    setHasMore(true);
    loadUgcData();
  }, [categoryId, viewFollow, activeTab]);

  return (
    <Layout
      style={{
        padding: '12px',
        transition: 'margin 0.2s',
        height: '100vh',
      }}
    >
      <Affix offsetTop={55}>
        <Sider
          theme="light"
          width={200}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
            overflow: 'auto',
          }}
        >
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

      <Content style={{ marginLeft: 16, minHeight: '100%' }}>
        <Row gutter={16}>
          <Col span={18}>
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '0 12px',
              }}
            >
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
                      style={{
                        padding: '24px 0',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        transition: 'background-color 0.3s',
                      }}
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
                      extra={
                        item.cover && (
                          <img
                            alt="cover"
                            src={item.cover}
                            style={{
                              width: 200,
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: 4,
                              marginLeft: 24,
                            }}
                          />
                        )
                      }
                    >
                      <List.Item.Meta
                        title={
                          <Typography.Title level={4} style={{ marginBottom: 8, fontSize: 18 }}>
                            <a
                              href={`/article/${item.ugcId}`}
                              style={{ color: 'rgba(0,0,0,0.85)' }}
                            >
                              {item.title}
                            </a>
                          </Typography.Title>
                        }
                        description={
                          <Typography.Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{
                              color: 'rgba(0,0,0,0.65)',
                              marginBottom: 4,
                              fontSize: 14,
                            }}
                          >
                            {item.summary}
                          </Typography.Paragraph>
                        }
                      />
                      <Space size={8} align="center">
                        <Typography.Text>{item.author?.nickname}</Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Text style={{ fontSize: 12 }}>
                          {item.gmtCreate
                            ? dateTimeFormat(item.gmtCreate, 'YYYY-MM-DD HH:mm')
                            : 'N/A'}
                        </Typography.Text>
                        <Divider type="vertical" />
                        <Space size={4}>
                          <TagList tags={item.tags} />
                        </Space>
                      </Space>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </Card>
          </Col>

          <Col span={6}>
            <CheckInCard />
            <UgcHotRank />
            <Footer />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
