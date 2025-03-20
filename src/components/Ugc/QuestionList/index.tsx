import IconText from '@/components/IconText';
import { InteractType, UgcType } from '@/constants/UgcConstant';
import {
  interactUgcUsingPost,
  listQuestionsUsingPost,
  listTimelineUgcFeedUsingPost,
} from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CheckCircleFilled,
  CommentOutlined,
  LikeFilled,
  LikeOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Avatar, Divider, List, message, Skeleton, Space, Tag, Typography } from 'antd';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Text } = Typography;

interface QuestionListProps {
  category?: API.UgcCategoryInfoResponse;
  qaStatus?: string;
}
const QuestionList: React.FC<QuestionListProps> = ({
  category = { categoryId: '' },
  qaStatus = 'all',
}) => {
  const [questionList, setQuestionList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const cursorRef = useRef('0');
  const firstLoad = useRef(true);

  const timelineQuestionFeed = async () => {
    try {
      const res = await listTimelineUgcFeedUsingPost({
        ugcType: UgcType.QUESTION,
        cursor: cursorRef.current,
        categoryId: category.categoryId,
      });
      setQuestionList((prev) => [...prev, ...(res.data?.data || [])]);
      cursorRef.current = res.data?.cursor || '0';
      setHasMore(res.data?.hasMore || false);
    } catch {}
  };

  const listQuestionsWithQaStatusAndCursor = async () => {
    try {
      const res = await listQuestionsUsingPost({
        ugcType: UgcType.QUESTION,
        cursor: cursorRef.current,
        categoryId: category.categoryId,
        qaStatus: qaStatus === 'adopted',
      });
      setQuestionList((prev) => [...prev, ...(res.data?.data || [])]);
      cursorRef.current = res.data?.cursor || '0';
      setHasMore(res.data?.hasMore || false);
    } catch {}
  };

  const loadQuestions = async () => {
    if (qaStatus === 'all') {
      await timelineQuestionFeed();
    } else {
      await listQuestionsWithQaStatusAndCursor();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadQuestions();
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
    setQuestionList([]);
    loadQuestions();
  }, [category, qaStatus]);

  return (
    <InfiniteScroll
      dataLength={questionList.length}
      next={timelineQuestionFeed}
      hasMore={hasMore}
      loader={<Skeleton avatar active />}
      pullDownToRefreshThreshold={50}
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
                <Text key={item.gmtCreate} type="secondary">
                  {dateTimeFormat(item.gmtCreate)}
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
                <Space key={item.author?.userId}>
                  <Avatar size={32} src={item.author?.avatar} />
                  <Text strong>
                    <Link
                      style={{
                        color: 'black',
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                      to={`/user/${item.author?.userId}`}
                    >
                      {item.author?.nickname}
                    </Link>
                  </Text>
                </Space>
                {item.hasSolved && (
                  <Tag
                    icon={<CheckCircleFilled />}
                    color="success"
                    style={{
                      padding: '0 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      lineHeight: '18px',
                      margin: 0,
                    }}
                  >
                    已解决
                  </Tag>
                )}
              </Space>,
            ]}
          >
            <List.Item.Meta
              title={<Typography.Title level={5}>{item.title}</Typography.Title>}
              description={
                <Typography.Paragraph
                  ellipsis={{
                    rows: 3,
                    expandable: false,
                  }}
                  style={{
                    marginBottom: 2,
                    fontSize: 14,
                  }}
                >
                  {item.summary}
                </Typography.Paragraph>
              }
            />
            <Link to={`/question/${item.ugcId}`} style={{ fontSize: 16, color: '#1990ff' }}>
              查看全文
            </Link>
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
};

export default QuestionList;
