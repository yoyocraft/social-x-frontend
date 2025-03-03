import { followUserUsingPost } from '@/services/socialx/userController';
import { UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Button, List, message, Typography } from 'antd';
import { useState } from 'react';

interface Props {
  user: API.UserBasicInfoResponse;
}

const { Text, Link } = Typography;
const UserFollowRelationCard: React.FC<Props> = ({ user }) => {
  const { initialState } = useModel('@@initialState');
  const [hasFollowed, setHasFollowed] = useState(user.hasFollowed);
  const toggleFollow = () => {
    followUserUsingPost({
      followUserId: user.userId,
      reqId: initialState?.currentUser?.userId,
      follow: !hasFollowed,
    })
      .then(() => {
        message.success(!hasFollowed ? '关注成功' : '取关成功');
        setHasFollowed(!hasFollowed);
      })
      .catch(() => {
        message.error('操作失败，请重试');
      });
  };
  return (
    <List.Item
      key={user.userId}
      actions={[
        <Button
          key="follow-button"
          type={user.hasFollowed ? 'default' : 'primary'}
          onClick={toggleFollow}
          style={{
            width: '100%',
            borderRadius: 20,
            fontWeight: 'bold',
            transition: 'all 0.3s',
          }}
        >
          {user.hasFollowed ? '取关' : '关注'}
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar size={40} src={user.avatar} icon={<UserOutlined />} />}
        title={
          <Text strong style={{ fontSize: 16 }}>
            <Link
              style={{
                color: '#1677ff',
                fontWeight: 500,
                textDecoration: 'none',
              }}
              href={`/user/${user?.userId}`}
            >
              {user.nickname}
            </Link>
          </Text>
        }
        description={
          <Text type="secondary" style={{ fontSize: 14, fontWeight: 'bold' }}>
            {user.bio}
          </Text>
        }
      />
    </List.Item>
  );
};

export default UserFollowRelationCard;
