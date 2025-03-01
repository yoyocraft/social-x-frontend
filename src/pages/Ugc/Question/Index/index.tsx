import IconText from '@/components/IconText';
import { InteractType, UgcType } from '@/constants/UgcConstant';
import {
  interactUgcUsingPost,
  listTimelineUgcFeedUsingGet,
} from '@/services/socialx/ugcController';
import { queryUgcQuestionCategoryUsingGet } from '@/services/socialx/ugcMetadataController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CommentOutlined,
  LikeFilled,
  LikeOutlined,
  QuestionOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Link } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  List,
  message,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Text } = Typography;
const QuestionPage: React.FC = () => {
  const [questionList, setQuestionList] = useState<API.UgcResponse[]>([]);
  const [questionTags, setQuestionTags] = useState<API.UgcCategoryInfoResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<API.UgcCategoryInfoResponse>();
  const [hasMore, setHasMore] = useState(false);
  const cursorRef = useRef('0');
  const firstLoad = useRef(true);

  const loadUgcData = async () => {
    try {
      const res = await listTimelineUgcFeedUsingGet({
        ugcType: UgcType.QUESTION,
        cursor: cursorRef.current,
        categoryId: selectedTag?.categoryId,
      });
      setQuestionList((prev) => [...prev, ...(res.data?.data || [])]);
      cursorRef.current = res.data?.cursor || '0';
      setHasMore(res.data?.hasMore || false);
    } catch {}
  };

  const loadQuestionTags = async () => {
    try {
      const res = await queryUgcQuestionCategoryUsingGet();
      setQuestionTags(res.data?.ugcCategoryList || []);
      setSelectedTag(res.data?.ugcCategoryList?.[0]);
    } catch (error: any) {}
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
        setQuestionList((prev) => {
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

  const handleSelect = (tag: API.UgcCategoryInfoResponse) => {
    setSelectedTag(tag);
  };

  const operations = (
    <Button icon={<QuestionOutlined />} type="primary">
      提问题
    </Button>
  );

  useEffect(() => {
    Promise.all([loadUgcData(), loadQuestionTags()]).then(() => {
      firstLoad.current = false;
    });
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      return;
    }
    cursorRef.current = '0';
    setQuestionList([]);
    loadUgcData();
  }, [selectedTag]);

  const items = [
    {
      label: '全部',
      key: 'all',
    },
    {
      label: '待解决',
      key: 'unadopted',
    },
    {
      label: '采纳',
      key: 'adopted',
    },
  ];
  return (
    <Card style={{ margin: '0 24px', padding: '16px' }}>
      <Row gutter={[33, 16]}>
        <Col xs={24} md={18}>
          <Form layout="horizontal">
            <Form.Item
              label={<Typography.Text strong>分类搜索：</Typography.Text>}
              labelCol={{ style: { fontSize: '14px', fontWeight: 'normal' } }}
            >
              <Space size="middle" wrap>
                {questionTags.map((tag) => (
                  <Tag.CheckableTag
                    key={tag.categoryId}
                    checked={selectedTag?.categoryId === tag.categoryId}
                    onChange={() => handleSelect(tag)}
                    style={{
                      fontSize: '14px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      marginRight: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {tag.categoryName}
                  </Tag.CheckableTag>
                ))}
              </Space>
            </Form.Item>
          </Form>
          <Divider />
          <Tabs tabBarExtraContent={operations} items={items} size="middle" />
          <InfiniteScroll
            dataLength={questionList.length}
            next={loadUgcData}
            hasMore={hasMore}
            loader={<Skeleton avatar active />}
            endMessage={<Divider plain>没有更多啦～</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <List
              itemLayout="vertical"
              size="large"
              dataSource={questionList}
              renderItem={(item) => (
                <List.Item
                  key={item.ugcId}
                  style={{
                    padding: '24px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}
                  actions={[
                    <Space key={item.categoryId} size={[2, 0]} split={<Divider type="vertical" />}>
                      <Text key={item.gmtCreate} type="secondary" style={{ fontSize: 12 }}>
                        {item.gmtCreate
                          ? dateTimeFormat(item.gmtCreate, 'YYYY-MM-DD HH:mm')
                          : 'N/A'}
                      </Text>
                      <IconText
                        icon={item.liked ? LikeFilled : LikeOutlined}
                        text={item.likeCount?.toString() || '0'}
                        key="list-vertical-like-o"
                        onClick={() => handleLike(item)}
                      />
                      <IconText
                        icon={CommentOutlined}
                        text={item.commentaryCount?.toString() || '0'}
                        key="list-vertical-comment-o"
                      />
                      <IconText
                        icon={item.collected ? StarFilled : StarOutlined}
                        text={item.collectCount?.toString() || '0'}
                        key="list-vertical-star-o"
                        onClick={() => handleCollect(item)}
                      />
                      <IconText icon={ShareAltOutlined} text="分享" key="list-vertical-share-o" />
                      <Space key={item.author?.userId}>
                        <Avatar size={32} src={item.author?.avatar} />
                        <Text>{item.author?.nickname}</Text>
                      </Space>
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    title={<Typography.Title level={4}>{item.title}</Typography.Title>}
                    description={
                      <Typography.Paragraph
                        strong
                        type="secondary"
                        ellipsis={{
                          rows: 3,
                          expandable: false,
                        }}
                      >
                        {item.summary}
                      </Typography.Paragraph>
                    }
                  />
                  <Link to={`/question/${item.categoryId}`} style={{ marginTop: 8 }}>
                    查看全文
                  </Link>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </Col>

        <Col xs={24} md={6}>
          <Card style={{ background: 'red', padding: 16 }}>右侧内容</Card>
        </Col>
      </Row>
    </Card>
  );
};

export default QuestionPage;
