import CommentaryCard from '@/components/Commentary/CommentaryCard';
import IconText from '@/components/IconText';
import MdViewer from '@/components/MdViewer';
import RelatedContentCard from '@/components/RelatedContentCard';
import UserCard from '@/components/User/UserCard';
import { InteractType } from '@/constants/UgcConstant';
import { interactUgcUsingPost, queryUgcDetailUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { useParams } from '@umijs/max';
import { Avatar, Button, Card, Col, message, Row, Skeleton, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  ugc: API.UgcResponse;
}

const PostCard = (props: Props) => {
  const { ugc } = props;
  const [likeCount, setLikeCount] = useState(ugc.likeCount || 0);
  const [collectCount, setCollectCount] = useState(ugc.collectCount || 0);
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);

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
      <Card bordered={false} style={{ padding: '16px 20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}
        >
          <Space size={12} align="start">
            <Avatar size={42} src={ugc.author?.avatar} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {ugc.author?.nickname}
                </Typography.Text>
                {/* {ugc.author?.level && (
                  <Tooltip title="用户等级">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#e6f7ff',
                        borderRadius: 4,
                        padding: '0 6px',
                        height: 20,
                      }}
                    >
                      <span style={{ color: '#1890ff', fontSize: 12 }}>{ugc.author.level}</span>
                    </div>
                  </Tooltip>
                )} */}
              </div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {ugc.gmtCreate ? dateTimeFormat(ugc.gmtCreate, 'YYYY-MM-DD HH:mm') : 'N/A'}
              </Typography.Text>
            </div>
          </Space>
          <Button icon={<PlusOutlined />} type="primary" shape="round" size="small">
            关注
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Typography.Paragraph style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            {ugc.title}
          </Typography.Paragraph>
          <MdViewer value={ugc.content} />
        </div>

        <Space size={16}>
          <IconText
            icon={liked ? LikeFilled : LikeOutlined}
            text={likeCount?.toString() || '0'}
            key="list-vertical-like-o"
            onClick={handleLike}
          />
          <IconText
            icon={MessageOutlined}
            text={ugc.commentaryCount?.toString() || '0'}
            key="list-vertical-comment-o"
          />
          <IconText
            icon={collected ? StarFilled : StarOutlined}
            text={collectCount?.toString() || '0'}
            key="list-vertical-star-o"
            onClick={handleCollect}
          />
          <IconText
            icon={ShareAltOutlined}
            text="分享"
            key="list-vertical-share-o"
            onClick={() => {}}
          />
        </Space>
      </Card>
    </div>
  );
};

const PostDetail: React.FC = () => {
  const params = useParams();
  const { ugcId } = params;

  const [postDetail, setPostDetail] = useState<API.UgcResponse | null>(null);

  const loadUgcDetail = async () => {
    const res = await queryUgcDetailUsingPost({ ugcId });
    if (res.data) {
      setPostDetail(res.data);
    }
  };

  useEffect(() => {
    loadUgcDetail();
  }, []);

  if (!postDetail) {
    return <Skeleton active />;
  }

  return (
    <div id="ugc-detail" style={{ padding: '24px', backgroundColor: '#f5f7fa' }}>
      <Row gutter={20}>
        <Col
          span={18}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <PostCard ugc={postDetail} />
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <CommentaryCard />
          </div>
        </Col>

        <Col span={6}>
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            {postDetail.author && <UserCard user={postDetail.author} />}
            <RelatedContentCard
              style={{ marginTop: 16 }}
              ugcId={postDetail.ugcId || ''}
              ugcType={postDetail.type || ''}
              categoryId={postDetail.categoryId || ''}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PostDetail;
