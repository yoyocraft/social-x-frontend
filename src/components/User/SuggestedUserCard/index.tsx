import { querySuggestedUsersUsingGet } from '@/services/socialx/userController';
import { useModel } from '@umijs/max';
import { Card, Empty, List, message } from 'antd';
import { useEffect, useState } from 'react';
import UserFollowRelationCard from '../UserCard/UserFollowRelationCard';

const SuggestedUserCard = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<API.UserBasicInfoResponse[]>([]);
  const { initialState } = useModel('@@initialState');

  const loadSuggestedUsers = async () => {
    const reqId = initialState?.currentUser?.userId;
    try {
      const res = await querySuggestedUsersUsingGet({ reqId });
      setSuggestedUsers(res.data || []);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    loadSuggestedUsers();
  }, []);
  return (
    <Card title="可能认识的人">
      <List
        itemLayout="horizontal"
        size="large"
        dataSource={suggestedUsers}
        renderItem={(item) => <UserFollowRelationCard user={item} />}
        locale={{
          emptyText: <Empty description="暂无认识的人，快去认识吧" />,
        }}
      />
    </Card>
  );
};

export default SuggestedUserCard;
