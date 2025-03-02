import IconText from '@/components/IconText';
import TagList from '@/components/TagList';
import { UgcType } from '@/constants/UgcConstant';
import {
  listFollowUgcFeedUsingPost,
  listRecommendUgcFeedUsingPost,
  listTimelineUgcFeedUsingPost,
} from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import { EyeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { Divider, List, Skeleton, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  categoryId?: string;
  fetchType?: string;
  viewFollow?: boolean;
}

const ArticleList: React.FC<Props> = ({
  categoryId = '',
  fetchType = 'latest',
  viewFollow = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [articleList, setArticleList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isFirstLoad = useRef(true);

  // 使用 useRef 管理 cursor
  const cursorRef = useRef('0');

  const setArticleData = (res: API.ResultPageCursorResultStringUgcResponse_) => {
    setArticleList((prev) => [...prev, ...(res.data?.data || [])]);
    cursorRef.current = res.data?.cursor || '0';
    setHasMore(res.data?.hasMore || false);
  };

  const timeFeedUgc = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await listTimelineUgcFeedUsingPost({
        cursor: cursorRef.current,
        ugcType: 'ARTICLE',
        categoryId,
      });
      setArticleData(res);
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
      const res = await listRecommendUgcFeedUsingPost({
        cursor: cursorRef.current,
        ugcType: UgcType.ARTICLE,
        categoryId,
      });
      setArticleData(res);
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
      const res = await listFollowUgcFeedUsingPost({
        cursor: cursorRef.current,
        ugcType: UgcType.ARTICLE,
      });
      setArticleData(res);
    } finally {
      setLoading(false);
    }
  };

  const loadUgcData = async () => {
    if (viewFollow) {
      await followFeedUgc();
      return;
    }
    if (fetchType === 'recommended') {
      await recommendFeedUgc();
    } else {
      await timeFeedUgc();
    }
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
  }, [categoryId, viewFollow, fetchType]);

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

export default ArticleList;
