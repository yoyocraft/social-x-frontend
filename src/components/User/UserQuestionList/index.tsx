import { UgcStatus, UgcType } from '@/constants/UgcConstant';
import { listSelfUgcUsingPost, queryUserPageUgcUsingPost } from '@/services/socialx/ugcController';
import { useParams } from '@umijs/max';
import { List, message, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserQuestionCard from './UserQuestionCard';

interface Props {
  self?: boolean;
  ugcStatus?: string;
}

const UserQuestionList: React.FC<Props> = ({ self = false, ugcStatus = UgcStatus.PUBLISHED }) => {
  const params = useParams();
  const { userId } = params;
  const [questionList, setQuestionList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
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
    setQuestionList([]);
    setHasMore(true);
    cursorRef.current = '0';
    loadUgcData();
  }, [ugcStatus]);

  return (
    <div id="scrollableDiv">
      <InfiniteScroll
        dataLength={questionList.length}
        next={loadUgcData}
        hasMore={hasMore}
        loader={<Skeleton avatar active />}
        scrollableTarget="scrollableDiv"
      >
        <List
          itemLayout="vertical"
          size="large"
          dataSource={questionList}
          renderItem={(item) => <UserQuestionCard question={item} />}
        />
      </InfiniteScroll>
    </div>
  );
};

export default UserQuestionList;
