import { Footer } from '@/components';
import IconText from '@/components/IconText';
import TagList from '@/components/TagList';
import UserCard from '@/components/UserCard';
import { UgcType } from '@/constants/UgcConstant';
import { listTimelineUgcFeedUsingGet } from '@/services/socialx/ugcController';
import { queryUgcTopicUsingGet } from '@/services/socialx/ugcMetadataController';
import { dateTimeFormat } from '@/services/utils/time';
import { CommentOutlined, EyeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Card, Col, Divider, Layout, List, Row, Skeleton, Space, Tabs, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostPublisher from '../components/PostPublisher';

const { Content } = Layout;

const initTabItems = [
  {
    key: 'all',
    label: '综合',
  },
];

export default function PostPage() {
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const [ugcList, setUgcList] = useState<API.UgcResponse[]>([]); // Use the imported API type
  const [hasMore, setHasMore] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [tabItems, setTabItems] = useState([]);

  // 使用 useRef 管理 cursor
  const cursorRef = useRef('0');

  const setUgcData = (res: API.ResultPageCursorResultStringUgcResponse_) => {
    setUgcList((prev) => [...prev, ...(res.data?.data || [])]);
    cursorRef.current = res.data?.cursor || '0';
    setHasMore(res.data?.hasMore || false);
  };

  const timeFeedUgc = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await listTimelineUgcFeedUsingGet({
        cursor: cursorRef.current,
        ugcType: UgcType.POST,
        categoryId,
      });
      setUgcData(res);
    } finally {
      setLoading(false);
    }
  };

  const loadUgcData = async () => {
    await timeFeedUgc();
  };

  const loadPostTopics = () => {
    queryUgcTopicUsingGet().then((res) => {
      const categories = res.data?.ugcCategoryList?.map((item) => {
        return {
          key: item.categoryId,
          label: item.categoryName,
        };
      });
      // @ts-ignore
      setTabItems([...initTabItems, ...(categories || [])]);
    });
  };

  const handlePublishPost = (content: string, attachments: any[]) => {
    // Here you would typically call an API to publish the post
    console.log('Publishing post:', { content, attachments });

    // Refresh the feed after publishing
    setUgcList([]);
    cursorRef.current = '0';
    loadUgcData();
  };

  useEffect(() => {
    Promise.all([loadUgcData(), loadPostTopics()]);
  }, []);

  useEffect(() => {
    // 重置列表数据
    setUgcList([]);
    setHasMore(true);

    // 切换 tab 时，重置 cursor
    cursorRef.current = '0';
    loadUgcData();
  }, [categoryId]);

  return (
    <Layout
      style={{
        padding: '24px',
        transition: 'margin 0.2s',
        height: '100vh',
        margin: '0 24px',
      }}
    >
      <Content style={{ marginLeft: 16, minHeight: '100%' }}>
        <Row gutter={16}>
          <Col span={18}>
            {initialState?.currentUser && <PostPublisher onPublish={handlePublishPost} />}
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '0 12px',
              }}
            >
              <Tabs
                size="large"
                defaultActiveKey="all"
                items={tabItems}
                onTabClick={setCategoryId}
              />
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
                        <IconText
                          icon={CommentOutlined}
                          text={item.commentaryCount?.toString() || '0'}
                          key="list-vertical-commentary-o"
                        />,
                      ]}
                      extra={
                        item.cover && (
                          <img
                            alt="cover"
                            src={item.cover || '/placeholder.svg'}
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
            {initialState?.currentUser && <UserCard user={initialState.currentUser} self />}
            <Footer />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
