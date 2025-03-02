import IconText from '@/components/IconText';
import { UgcType } from '@/constants/UgcConstant';
import { listSelfUgcUsingPost, queryUserPageUgcUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CheckCircleFilled,
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useParams } from '@umijs/max';
import { Avatar, Divider, List, message, Skeleton, Space, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  self?: boolean;
  ugcStatus?: string;
}
const { Link, Text } = Typography;

const UserQuestionList: React.FC<Props> = ({ self = false, ugcStatus = 'PUBLISHED' }) => {
  const params = useParams();
  const { userId } = params;
  const [questionList, setQuestionList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // 使用 useRef 管理 cursor
  const cursorRef = useRef('0');
  const isFirstLoad = useRef(true);

  const setPostData = (res: API.ResultPageCursorResultStringUgcResponse_) => {
    setQuestionList((prev) => [...prev, ...(res.data?.data || [])]);
    cursorRef.current = res.data?.cursor || '0';
    setHasMore(res.data?.hasMore || false);
  };

  const loadSelfArticles = async () => {
    try {
      const res = await listSelfUgcUsingPost({
        ugcType: UgcType.QUESTION,
        ugcStatus,
        cursor: cursorRef.current,
      });
      setPostData(res);
    } catch (error: any) {
      message.error('查询失败', error.message);
    }
  };

  const loadUserArticles = async () => {
    try {
      const res = await queryUserPageUgcUsingPost({
        authorId: userId,
        ugcType: UgcType.QUESTION,
        cursor: cursorRef.current,
      });
      setPostData(res);
    } catch (error: any) {
      message.error('查询失败', error.message);
    }
  };

  const loadUgcData = async () => {
    if (self) {
      await loadSelfArticles();
      return;
    }
    await loadUserArticles();
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadUgcData();
      isFirstLoad.current = false;
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      return;
    }
    // 重置列表数据
    setQuestionList([]);
    setHasMore(true);

    // 切换 tab 时，重置 cursor
    cursorRef.current = '0';
    loadUgcData();
  }, [ugcStatus]);

  return (
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
                  {item.gmtCreate ? dateTimeFormat(item.gmtCreate, 'YYYY-MM-DD HH:mm') : 'N/A'}
                </Text>
                <IconText
                  icon={LikeOutlined}
                  text={item.likeCount?.toString() || '0'}
                  key="list-vertical-like-o"
                />
                <IconText
                  icon={CommentOutlined}
                  text={item.commentaryCount?.toString() || '0'}
                  key="list-vertical-comment-o"
                />
                <IconText
                  icon={StarOutlined}
                  text={item.collectCount?.toString() || '0'}
                  key="list-vertical-star-o"
                />
                <IconText icon={ShareAltOutlined} text="分享" key="list-vertical-share-o" />
                <Space key={item.author?.userId}>
                  <Avatar size={32} src={item.author?.avatar} />
                  <Text>{item.author?.nickname}</Text>
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
              title={<Typography.Title level={4}>{item.title}</Typography.Title>}
              description={
                <Typography.Paragraph
                  strong
                  type="secondary"
                  ellipsis={{
                    rows: 3,
                    expandable: false,
                  }}
                  style={{
                    marginBottom: 4,
                    fontSize: 16,
                  }}
                >
                  {item.summary}
                </Typography.Paragraph>
              }
            />
            <Link href={`/question/${item.ugcId}`} style={{ fontSize: 16, color: '#1990ff' }}>
              查看全文
            </Link>
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
};

export default UserQuestionList;
