import { querySelfFollowingUsersUsingGet } from '@/services/socialx/userController';
import { Empty, List, message, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserFollowRelationCard from '../UserCard/UserFollowRelationCard';

const UserFollowingUserList: React.FC = () => {
  const [followerList, setFollowerList] = useState<API.UserBasicInfoResponse[]>([]);
  const cursorRef = useRef<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadSelfFollowingUsers = async () => {
    try {
      const res = await querySelfFollowingUsersUsingGet({
        // @ts-ignore
        cursor: cursorRef.current,
      });
      setFollowerList((prev) => [...prev, ...(res.data?.data || [])]);
      setHasMore(res.data?.hasMore || false);
      cursorRef.current = res.data?.cursor || null;
    } catch (error: any) {
      message.error('获取关注列表失败, ', error.message);
    }
  };

  useEffect(() => {
    loadSelfFollowingUsers();
  }, []);
  return (
    <InfiniteScroll
      dataLength={followerList.length}
      next={loadSelfFollowingUsers}
      hasMore={hasMore}
      loader={<Skeleton avatar active />}
      pullDownToRefreshThreshold={50}
    >
      <List
        itemLayout="horizontal"
        size="large"
        dataSource={followerList}
        renderItem={(item) => <UserFollowRelationCard user={item} />}
        locale={{
          emptyText: <Empty description="暂无关注" />,
        }}
      />
    </InfiniteScroll>
  );
};

export default UserFollowingUserList;
