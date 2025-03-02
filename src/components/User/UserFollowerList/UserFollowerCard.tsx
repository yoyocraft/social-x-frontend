import { Avatar, Button, List, Typography } from 'antd';

interface Props {
  user: API.UserBasicInfoResponse;
}

const { Text } = Typography;
const UserFollowerCard: React.FC<Props> = ({ user }) => {
  const toggleFollow = () => {};
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
        avatar={<Avatar size={40} src={user.avatar || '/placeholder-user.jpg'} />}
        title={
          <Text strong style={{ fontSize: 16 }}>
            {user.nickname}
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

export default UserFollowerCard;
