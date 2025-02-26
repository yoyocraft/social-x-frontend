import { Avatar, Button, Card, Space, Typography } from 'antd';
import { useState } from 'react';

const { Meta } = Card;
const { Text } = Typography;

interface Props {
  user: API.UserBasicInfoResponse;
}

const UserCard = (props: Props) => {
  const { user } = props;
  const [hasFollowed, setHasFollowed] = useState(user.hasFollowed);

  const toggleFollow = () => {
    setHasFollowed(!hasFollowed);
  };

  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '8px',
      }}
    >
      <Meta
        avatar={<Avatar src={user.avatar} size={64} />}
        title={<Text strong>{user.nickname}</Text>}
        description={
          <Text type="secondary" style={{ fontSize: 14 }}>
            {user.bio}
          </Text>
        }
        style={{ marginBottom: 16 }}
      />
      <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
        <Button
          type={hasFollowed ? 'default' : 'primary'}
          onClick={toggleFollow}
          style={{
            width: '100%',
            borderRadius: 20,
            fontWeight: 'bold',
            transition: 'all 0.3s',
          }}
        >
          {hasFollowed ? '取关' : '关注'}
        </Button>
      </Space>
    </Card>
  );
};

export default UserCard;
