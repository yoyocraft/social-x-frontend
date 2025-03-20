import { listHotUserUsingGet } from '@/services/socialx/userController';
import { Card, Empty, List, message } from 'antd';
import { useEffect, useState } from 'react';
import UserFollowRelationCard from '../UserCard/UserFollowRelationCard';

const HotAuthorCard = () => {
  const [hotUsers, setHotUsers] = useState<API.UserBasicInfoResponse[]>([]);

  const loadHotUsers = async () => {
    try {
      const res = await listHotUserUsingGet();
      setHotUsers(res.data || []);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    loadHotUsers();
  }, []);
  return (
    <Card title="热门作者榜" styles={{ body: { padding: '0' } }}>
      <List
        itemLayout="horizontal"
        size="large"
        dataSource={hotUsers}
        renderItem={(item) => (
          <UserFollowRelationCard avatarSize={30} btnSize="small" user={item} />
        )}
        locale={{
          emptyText: <Empty description="暂无热门作者，快去成为吧" />,
        }}
      />
    </Card>
  );
};

export default HotAuthorCard;
