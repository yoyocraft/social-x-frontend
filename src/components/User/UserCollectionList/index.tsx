import { UgcType } from '@/constants/UgcConstant';
import { listSelfCollectedUgcUsingPost } from '@/services/socialx/ugcController';
import { List, message, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserArticleCard from '../UserArticleList/UserArticleCard';
import UserPostCard from '../UserPostList/UserPostCard';
import UserQuestionCard from '../UserQuestionList/UserQuestionCard';

const UserCollectionList: React.FC = () => {
  const [ugcList, setUgcList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const cursorRef = useRef<number | null>(null);
  const isFirstLoad = useRef(true);

  const setUgcData = (res: API.ResultPageCursorResultLongUgcResponse_) => {
    setUgcList((prev) => [...prev, ...(res.data?.data || [])]);
    cursorRef.current = res.data?.cursor || null;
    setHasMore(res.data?.hasMore || false);
  };

  const loadSelfCollectedUgc = async () => {
    try {
      const res = await listSelfCollectedUgcUsingPost({
        // @ts-ignore
        timeCursor: cursorRef.current,
      });
      setUgcData(res);
    } catch (error: any) {
      message.error('查询失败', error.message);
    }
  };

  const renderUgcItem = (item: API.UgcResponse) => {
    return (
      <>
        {item.type === UgcType.ARTICLE && <UserArticleCard collectPage article={item} />}
        {item.type === UgcType.POST && <UserPostCard collectPage post={item} />}
        {item.type === UgcType.QUESTION && <UserQuestionCard collectPage question={item} />}
      </>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadSelfCollectedUgc();
      isFirstLoad.current = false;
    };

    fetchData();
  }, []);

  return (
    <InfiniteScroll
      dataLength={ugcList.length}
      next={loadSelfCollectedUgc}
      hasMore={hasMore}
      loader={<Skeleton avatar active />}
      pullDownToRefreshThreshold={50}
    >
      <List
        itemLayout="vertical"
        size="large"
        dataSource={ugcList}
        renderItem={(item) => renderUgcItem(item)}
      />
    </InfiniteScroll>
  );
};

export default UserCollectionList;
