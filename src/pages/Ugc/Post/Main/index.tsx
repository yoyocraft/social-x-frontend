import { Footer } from '@/components';
import IconText from '@/components/IconText';
import UserCard from '@/components/UserCard';
import { InteractType, UgcType } from '@/constants/UgcConstant';
import {
  interactUgcUsingPost,
  listTimelineUgcFeedUsingGet,
  publishUgcUsingPost,
} from '@/services/socialx/ugcController';
import { queryUgcTopicUsingGet } from '@/services/socialx/ugcMetadataController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CommentOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Avatar,
  Card,
  Col,
  Divider,
  Image,
  Layout,
  List,
  message,
  Row,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostPublisher from '../components/PostPublisher';

const { Content } = Layout;
const { Text, Link, Paragraph } = Typography;

const initTabItems = [
  {
    key: 'all',
    label: '综合',
  },
];

export default function PostPage() {
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const [ugcList, setUgcList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [tabItems, setTabItems] = useState([]);
  const isFirstLoad = useRef(true);

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

  const handlePublishPost = async (content: string, topic: string, attachmentUrls: string[]) => {
    try {
      const reqId = initialState?.currentUser?.userId + '_' + content;
      await publishUgcUsingPost({
        ugcType: UgcType.POST,
        content,
        categoryId: topic,
        attachmentUrls,
        reqId,
      });
      message.success('发布成功');

      // Refresh the list
      setUgcList([]);
      cursorRef.current = '0';
      loadUgcData();
    } catch (error: any) {
      message.error(error.message || '发布失败，请重试');
    }
  };

  const handleInteraction = (item: API.UgcResponse, interactionType: InteractType) => {
    const ugcId = item.ugcId;
    const interactionField = interactionType === InteractType.LIKE ? 'likeCount' : 'collectCount';
    const hasInteractionField = interactionType === InteractType.LIKE ? 'liked' : 'collected';

    interactUgcUsingPost({
      targetId: ugcId,
      interactionType: interactionType,
      interact: !item[hasInteractionField],
      reqId: ugcId,
    })
      .then(() => {
        setUgcList((prev) => {
          return prev.map((prevItem) => {
            if (prevItem.ugcId === ugcId) {
              return {
                ...prevItem,
                [interactionField]:
                  prevItem[interactionField] || 0 + (item[hasInteractionField] ? -1 : 1),
                [hasInteractionField]: !item[hasInteractionField],
              };
            }
            return prevItem;
          });
        });
        message.success(`${interactionType === InteractType.LIKE ? '点赞' : '收藏'}成功`);
      })
      .catch(() => {
        message.error(`${interactionType === InteractType.LIKE ? '点赞' : '收藏'}失败，请重试`);
      });
  };

  const handleLike = (item: API.UgcResponse) => {
    handleInteraction(item, InteractType.LIKE);
  };

  const handleCollect = (item: API.UgcResponse) => {
    handleInteraction(item, InteractType.COLLECT);
  };
  useEffect(() => {
    Promise.all([loadUgcData(), loadPostTopics()]).then(() => {
      isFirstLoad.current = false;
    });
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      return;
    }
    setUgcList([]);
    setHasMore(true);
    cursorRef.current = '0';
    loadUgcData();
  }, [categoryId]);

  const renderPostContent = (item: API.UgcResponse) => {
    const hasLink = item.content?.includes('http');

    // 处理换行符，将 \n 转换为 <br />，保持原始格式
    const contentWithLineBreaks = item.content?.split('\n');

    // 如果没有链接，直接渲染内容并保留换行
    if (!hasLink) {
      return contentWithLineBreaks?.map((line, index) => <Paragraph key={index}>{line}</Paragraph>);
    }

    return (
      <>
        {contentWithLineBreaks?.map((line, index) => {
          if (line.startsWith('http')) {
            return (
              <Link key={index} href={line} target="_blank">
                {line}
              </Link>
            );
          }
          // 渲染其他文本内容
          return <Paragraph key={index}>{line}</Paragraph>;
        })}
      </>
    );
  };

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
                onTabClick={(key) => {
                  if (key === 'all') {
                    setCategoryId('');
                    return;
                  }
                  setCategoryId(key);
                }}
              />
              <InfiniteScroll
                dataLength={ugcList.length}
                next={loadUgcData}
                hasMore={hasMore}
                loader={<Skeleton avatar active />}
                endMessage={<Divider plain>没有更多啦～</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  itemLayout="vertical"
                  size="large"
                  dataSource={ugcList}
                  renderItem={(item) => (
                    <List.Item
                      key={item.ugcId}
                      style={{
                        padding: '24px 0',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                      }}
                      actions={[
                        <IconText
                          icon={item.liked ? LikeFilled : LikeOutlined}
                          text={item.likeCount?.toString() || '0'}
                          key="list-vertical-like-o"
                          onClick={() => handleLike(item)}
                        />,
                        <IconText
                          icon={CommentOutlined}
                          text={item.commentaryCount?.toString() || '0'}
                          key="list-vertical-comment-o"
                        />,
                        <IconText
                          icon={item.collected ? StarFilled : StarOutlined}
                          text={item.collectCount?.toString() || '0'}
                          key="list-vertical-star-o"
                          onClick={() => handleCollect(item)}
                        />,
                        <IconText
                          icon={ShareAltOutlined}
                          text="分享"
                          key="list-vertical-share-o"
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.author?.avatar} size={40} />}
                        title={
                          <Space size={2} direction="vertical">
                            <Text strong>{item.author?.nickname}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.gmtCreate
                                ? dateTimeFormat(item.gmtCreate, 'YYYY-MM-DD HH:mm')
                                : 'N/A'}
                            </Text>
                          </Space>
                        }
                      />
                      <div style={{ margin: '8px 0' }}>{renderPostContent(item)}</div>
                      {item.attachmentUrls && item.attachmentUrls.length > 0 && (
                        <Space size={[16, 8]} wrap style={{ marginTop: 16 }}>
                          {item.attachmentUrls.map((url, index) => (
                            <Image
                              key={index}
                              width={100}
                              src={url}
                              fallback="/media/fallback/1.png"
                            />
                          ))}
                        </Space>
                      )}
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
