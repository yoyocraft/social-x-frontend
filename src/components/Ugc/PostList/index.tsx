import IconText from '@/components/IconText';
import { InteractType, UgcType } from '@/constants/UgcConstant';
import {
  interactUgcUsingPost,
  listTimelineUgcFeedUsingPost,
} from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CommentOutlined,
  LikeFilled,
  LikeOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Card,
  ConfigProvider,
  Image,
  List,
  message,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Text, Link, Paragraph } = Typography;

interface PostListProps {
  categoryId: string;
}

const PostList: React.FC<PostListProps> = ({ categoryId }) => {
  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isFirstLoad = useRef(true);
  const cursorRef = useRef('0');

  const setPostData = (res: API.ResultPageCursorResultStringUgcResponse_) => {
    setPostList((prev) => [...prev, ...(res.data?.data || [])]);
    cursorRef.current = res.data?.cursor || '0';
    setHasMore(res.data?.hasMore || false);
  };

  const loadPostData = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await listTimelineUgcFeedUsingPost({
        cursor: cursorRef.current,
        ugcType: UgcType.POST,
        categoryId,
      });
      setPostData(res);
    } finally {
      setLoading(false);
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
        setPostList((prev) => {
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
        await Promise.all([loadPostData()]);
        isFirstLoad.current = false;
      } catch (error: any) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      return;
    }
    setPostList([]);
    setHasMore(true);
    cursorRef.current = '0';
    loadPostData();
  }, [categoryId]);

  const renderPostContent = (item: API.UgcResponse) => {
    const hasLink = item.content?.includes('http');
    const contentWithLineBreaks = item.content?.split('\n');

    if (!hasLink) {
      return (
        <Paragraph
          ellipsis={{
            rows: 10,
            expandable: true,
            symbol: '展开更多',
          }}
        >
          {contentWithLineBreaks?.join('\n')}
        </Paragraph>
      );
    }

    return (
      <Paragraph
        ellipsis={{
          rows: 10,
          expandable: true,
          symbol: '展开更多',
        }}
      >
        {contentWithLineBreaks?.map((line, index) => {
          if (line.startsWith('http')) {
            return (
              <span key={index}>
                <Link href={line} target="_blank">
                  {line}
                </Link>
                {index < contentWithLineBreaks.length - 1 && '\n'}
              </span>
            );
          }
          return (
            <span key={index}>
              {line}
              {index < contentWithLineBreaks.length - 1 && '\n'}
            </span>
          );
        })}
      </Paragraph>
    );
  };

  return (
    <InfiniteScroll
      dataLength={postList.length}
      next={loadPostData}
      hasMore={hasMore}
      loader={<Skeleton avatar active />}
      pullDownToRefreshThreshold={50}
    >
      <List
        itemLayout="vertical"
        size="large"
        dataSource={postList}
        renderItem={(item) => (
          <List.Item key={item.ugcId}>
            <ConfigProvider
              theme={{
                components: {
                  Card: {
                    bodyPadding: 4,
                  },
                },
              }}
            >
              <Card
                bordered={false}
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
                  <Link
                    key={item.ugcId}
                    href={`/post/${item.ugcId}`}
                    style={{
                      color: '#1990ff',
                      fontSize: '15px',
                    }}
                  >
                    查看原贴
                  </Link>,
                ]}
              >
                <Card.Meta
                  avatar={<Avatar src={item.author?.avatar} size={40} />}
                  title={
                    <Space size={0} direction="vertical">
                      <Text strong>
                        <Link
                          style={{
                            color: 'black',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                          href={`/user/${item.author?.userId}`}
                        >
                          {item.author?.nickname}
                        </Link>
                      </Text>
                      <Text type="secondary">{dateTimeFormat(item.gmtCreate)}</Text>
                    </Space>
                  }
                />
                <>
                  {renderPostContent(item)}
                  {item.attachmentUrls && item.attachmentUrls.length > 0 && (
                    <Space size={[16, 8]} wrap style={{ marginTop: 16 }}>
                      {item.attachmentUrls.map((url, index) => (
                        <Image key={index} width={100} src={url} fallback="/media/fallback/1.png" />
                      ))}
                    </Space>
                  )}
                </>
              </Card>
            </ConfigProvider>
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
};

export default PostList;
