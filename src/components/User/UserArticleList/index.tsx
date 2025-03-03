import { UgcType } from '@/constants/UgcConstant';
import { listSelfUgcUsingPost, queryUserPageUgcUsingPost } from '@/services/socialx/ugcController';
import { useParams } from '@umijs/max';
import { Empty, List, message, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserArticleCard from './UserArticleCard';

interface Props {
  self?: boolean;
  ugcStatus?: string;
}

const UserArticleList: React.FC<Props> = ({ self = false, ugcStatus = 'PUBLISHED' }) => {
  const params = useParams();
  const { userId } = params;
  const [articleList, setArticleList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
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
    setArticleList([]);
    setHasMore(true);

    cursorRef.current = '0';
    loadUgcData();
  }, [ugcStatus]);

  return (
    <div id="scrollableDiv">
      <InfiniteScroll
        dataLength={articleList.length}
        next={loadUgcData}
        hasMore={hasMore}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        scrollableTarget="scrollableDiv"
      >
        <List
          itemLayout="vertical"
          size="large"
          dataSource={articleList}
          locale={{
            emptyText: <Empty description="暂无数据" />,
          }}
          renderItem={(item) => <UserArticleCard article={item} />}
        />
      </InfiniteScroll>
    </div>
  );
};

export default UserArticleList;
