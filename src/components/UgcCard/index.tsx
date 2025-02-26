// UgcCard.tsx
import { dateTimeFormat } from '@/services/utils/time';
import {
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Card, Divider, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';
import IconText from '../IconText';
import MdViewer from '../MdViewer';
import TagList from '../TagList';

interface Props {
  ugc: API.UgcResponse;
}

const UgcCard = (props: Props) => {
  const { ugc } = props;
  const [likeCount, setLikeCount] = useState(ugc.likeCount || 0);
  const [collectCount, setCollectCount] = useState(ugc.collectCount || 0);
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));
  };

  const handleCollect = () => {
    setCollected(!collected);
    setCollectCount(collectCount + (collected ? -1 : 1));
  };

  return (
    <div className="ugc-card">
      <Card
        bordered={false}
        actions={[
          <IconText
            icon={liked ? LikeFilled : LikeOutlined}
            text={likeCount?.toString() || '0'}
            key="list-vertical-like-o"
            onClick={handleLike}
          />,
          <IconText
            icon={collected ? StarFilled : StarOutlined}
            text={collectCount?.toString() || '0'}
            key="list-vertical-star-o"
            onClick={handleCollect}
          />,
          <IconText
            icon={ShareAltOutlined}
            text="分享"
            key="list-vertical-share-o"
            onClick={() => {}}
          />,
        ]}
      >
        <Title level={1} style={{ fontSize: 24 }}>
          {ugc.title}
        </Title>
        <Space size={8} align="center">
          <Typography.Text>{ugc.author?.nickname}</Typography.Text>
          <Divider type="vertical" />
          <Typography.Text style={{ fontSize: 12 }}>
            {ugc.gmtCreate ? dateTimeFormat(ugc.gmtCreate, 'YYYY-MM-DD HH:mm') : 'N/A'}
          </Typography.Text>
          <Divider type="vertical" />
          <Space size={4}>
            <IconText
              icon={EyeOutlined}
              text={ugc.viewCount?.toString() || '0'}
              key="list-vertical-view-o"
            />
          </Space>
        </Space>
        <div style={{ marginBottom: 16 }} />
        <MdViewer value={ugc.content} />
        <div style={{ marginBottom: 16 }} />
        <TagList tags={ugc.tags} />
      </Card>
    </div>
  );
};

export default UgcCard;
