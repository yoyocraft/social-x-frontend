import IconText from '@/components/IconText';
import MdViewer from '@/components/MdViewer';
import TagList from '@/components/TagList';
import { InteractType } from '@/constants/UgcConstant';
import { interactUgcUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CheckCircleFilled,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Card, Divider, message, Space, Tag, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';

interface Props {
  ugc: API.UgcResponse;
}

const UgcCard = (props: Props) => {
  const { ugc } = props;
  const [likeCount, setLikeCount] = useState(ugc.likeCount || 0);
  const [collectCount, setCollectCount] = useState(ugc.collectCount || 0);
  const [liked, setLiked] = useState(ugc.liked);
  const [collected, setCollected] = useState(ugc.collected);

  const handleLike = () => {
    const interact = !ugc.liked;
    interactUgcUsingPost({
      targetId: ugc.ugcId,
      interactionType: InteractType.LIKE,
      interact,
      reqId: ugc.ugcId,
    })
      .then(() => {
        setLikeCount((prev) => (prev || 0) + (liked ? -1 : 1));
        setLiked(interact);
      })
      .catch(() => {
        message.error('失败，请重试');
      });
  };

  const handleCollect = () => {
    const interact = !ugc.collected;
    interactUgcUsingPost({
      targetId: ugc.ugcId,
      interactionType: InteractType.COLLECT,
      interact,
      reqId: ugc.ugcId,
    })
      .then(() => {
        setCollectCount((prev) => (prev || 0) + (collected ? -1 : 1));
        setCollected(interact);
      })
      .catch(() => {
        message.error('失败，请重试');
      });
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
          {ugc.hasSolved && (
            <>
              <Divider type="vertical" />
              <Tag
                icon={<CheckCircleFilled />}
                color="success"
                style={{
                  padding: '0 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  lineHeight: '18px',
                  margin: 0,
                }}
              >
                已解决
              </Tag>
            </>
          )}
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
