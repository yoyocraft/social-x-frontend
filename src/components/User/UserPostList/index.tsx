import { UgcStatus, UgcType } from '@/constants/UgcConstant';
import { listSelfUgcUsingPost, queryUserPageUgcUsingPost } from '@/services/socialx/ugcController';
import { useParams } from '@umijs/max';
import { List, message, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserPostCard from './UserPostCard';

interface Props {
  self?: boolean;
  ugcStatus?: string;
}
const UserPostList: React.FC<Props> = ({ self = false, ugcStatus = UgcStatus.PUBLISHED }) => {
  const params = useParams();
  const { userId } = params;
  const [postList, setPostList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef('0');
  const isFirstLoad = useRef(true);

  const setPostData = (res: API.ResultPageCursorResultStringUgcResponse_) => {
    setPostList((prev) => [...prev, ...(res.data?.data || [])]);
    cursorRef.current = res.data?.cursor || '0';
    setHasMore(res.data?.hasMore || false);
  };

  const loadSelfArticles = async () => {
    try {
      const res = await listSelfUgcUsingPost({
        ugcType: UgcType.POST,
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
        ugcType: UgcType.POST,
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

  const refreshUgcList = (ugcId: string) => {
    setPostList((prevData) => {
      if (!prevData) {
        return prevData;
      }
      const updatedData = prevData.filter((item) => item.ugcId !== ugcId);
      return updatedData;
    });
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
    setPostList([]);
    setHasMore(true);
    cursorRef.current = '0';
    loadUgcData();
  }, [ugcStatus]);

  return (
    <div id="scrollableDiv">
      <InfiniteScroll
        dataLength={postList.length}
        next={loadUgcData}
        hasMore={hasMore}
        loader={<Skeleton avatar active />}
        scrollableTarget="scrollableDiv"
      >
        <List
          itemLayout="vertical"
          size="large"
          dataSource={postList}
          renderItem={(item) => <UserPostCard refreshUgcList={refreshUgcList} post={item} />}
        />
      </InfiniteScroll>
    </div>
  );
};

export default UserPostList;
