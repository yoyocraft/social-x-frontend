import AiSummary from '@/components/AiSummary';
import IconText from '@/components/IconText';
import MdViewer from '@/components/MdViewer';
import ShareIconText from '@/components/ShareModal';
import TagList from '@/components/Ugc/TagList';
import { UgcType } from '@/constants/UgcConstant';
import { useUgcInteraction } from '@/hooks/useUgcInteraction';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CheckCircleFilled,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Card, Divider, Space, Tag, Typography } from 'antd';
import Title from 'antd/es/typography/Title';

interface Props {
  ugc: API.UgcResponse;
}

const UgcCard: React.FC<Props> = ({ ugc }) => {
  const { likeCount, collectCount, liked, collected, handleLike, handleCollect } =
    useUgcInteraction(ugc.ugcId ?? '', ugc.likeCount, ugc.collectCount, ugc.liked, ugc.collected);

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
