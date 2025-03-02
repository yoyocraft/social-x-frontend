import IconText from '@/components/IconText';
import TagList from '@/components/TagList';
import { UgcType } from '@/constants/UgcConstant';
import { listSelfUgcUsingPost, queryUserPageUgcUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import { EyeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { useParams } from '@umijs/max';
import { Divider, Empty, List, message, Skeleton, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  self?: boolean;
  ugcStatus?: string;
}

const UserArticleList: React.FC<Props> = ({ self = false, ugcStatus = 'PUBLISHED' }) => {
  const params = useParams();
  const { userId } = params;
  const [articleList, setArticleList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // 使用 useRef 管理 cursor
  const cursorRef = useRef('0');
  const isFirstLoad = useRef(true);

  const setArticleData = (res: API.ResultPageCursorResultStringUgcResponse_) => {
    setArticleList((prev) => [...prev, ...(res.data?.data || [])]);
    cursorRef.current = res.data?.cursor || '0';
    setHasMore(res.data?.hasMore || false);
  };

  const loadSelfArticles = async () => {
    try {
      const res = await listSelfUgcUsingPost({
        ugcType: UgcType.ARTICLE,
        ugcStatus,
        cursor: cursorRef.current,
      });
      setArticleData(res);
    } catch (error: any) {
      message.error('查询失败', error.message);
    }
  };

  const loadUserArticles = async () => {
    try {
      const res = await queryUserPageUgcUsingPost({
        authorId: userId,
        ugcType: UgcType.ARTICLE,
        cursor: cursorRef.current,
      });
      setArticleData(res);
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
    setArticleList([]);
    setHasMore(true);

    // 切换 tab 时，重置 cursor
    cursorRef.current = '0';
    loadUgcData();
  }, [ugcStatus]);

  return (
    <InfiniteScroll
      dataLength={articleList.length}
      next={loadUgcData}
      hasMore={hasMore}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      endMessage={<Divider plain>没有更多啦～</Divider>}
      scrollableTarget="scrollableDiv"
    >
      <List
        itemLayout="vertical"
        size="large"
        dataSource={articleList}
        locale={{
          emptyText: <Empty description="暂无数据" />,
        }}
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
                  <a href={`/article/${item.ugcId}`} style={{ color: 'rgba(0,0,0,0.85)' }}>
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
                {item.gmtCreate ? dateTimeFormat(item.gmtCreate, 'YYYY-MM-DD HH:mm') : 'N/A'}
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
  );
};

export default UserArticleList;
