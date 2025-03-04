import AiSummary from '@/components/AiSummary';
import IconText from '@/components/IconText';
import MdViewer from '@/components/MdViewer';
import ShareIconText from '@/components/ShareModal';
import TagList from '@/components/Ugc/TagList';
import { InteractType, UgcType } from '@/constants/UgcConstant';
import { interactUgcUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CheckCircleFilled,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
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
    const newLiked = !liked;
    interactUgcUsingPost({
      targetId: ugc.ugcId,
      interactionType: InteractType.LIKE,
      interact: newLiked,
      reqId: ugc.ugcId,
    })
      .then(() => {
        setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
        setLiked(newLiked);
      })
      .catch(() => {
        message.error('点赞失败，请重试');
      });
  };

  const handleCollect = () => {
    const newCollected = !collected;
    interactUgcUsingPost({
      targetId: ugc.ugcId,
      interactionType: InteractType.COLLECT,
      interact: newCollected,
      reqId: ugc.ugcId,
    })
      .then(() => {
        setCollectCount((prev) => (newCollected ? prev + 1 : prev - 1));
        setCollected(newCollected);
      })
      .catch(() => {
        message.error('收藏失败，请重试');
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
          <ShareIconText key="list-vertical-share-o" item={ugc} />,
        ]}
      >
        <Title level={1} style={{ fontSize: 24 }}>
          {ugc.title}
        </Title>
        <Space size={8} align="center">
          <Typography.Text>{ugc.author?.nickname}</Typography.Text>
          <Divider type="vertical" />
          <Typography.Text style={{ fontSize: 12 }}>
            {dateTimeFormat(ugc.gmtModified)}
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
        {ugc.type === UgcType.ARTICLE && ugc.ugcId && <AiSummary ugcId={ugc.ugcId} />}
        <div style={{ marginBottom: 16 }} />
        <MdViewer value={ugc.content} />
        <div style={{ marginBottom: 16 }} />
        <TagList tags={ugc.tags} />
      </Card>
    </div>
  );
};

export default UgcCard;
