import CommentaryCard from '@/components/Commentary/CommentaryCard';
import IconText from '@/components/IconText';
import MdViewer from '@/components/MdViewer';
import ShareIconText from '@/components/ShareModal';
import RelatedContentCard from '@/components/Ugc/RelatedContentCard';
import UserCard from '@/components/User/UserCard';
import { InteractType } from '@/constants/UgcConstant';
import { interactUgcUsingPost, queryUgcDetailUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { history, useModel, useParams } from '@umijs/max';
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
              </div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {dateTimeFormat(ugc.gmtModified)}
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
          <ShareIconText key="list-vertical-share-o" item={ugc} />,
        </Space>
      </Card>
    </div>
  );
};

const PostDetail: React.FC = () => {
  const params = useParams();
  const { ugcId } = params;

  const [post, setPost] = useState<API.UgcResponse>();

  const { initialState } = useModel('@@initialState');

  const loadUgcDetail = async () => {
    try {
      const res = await queryUgcDetailUsingPost({ ugcId });
      setPost(res.data);
    } catch (error: any) {
      message.error(error.message);
      history.back();
    }
  };

  useEffect(() => {
    loadUgcDetail();
  }, []);

  if (!post) {
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
            <PostCard ugc={post} />
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <CommentaryCard ugcAuthorId={post.author?.userId} />
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
            {post.author && (
              <UserCard
                self={initialState?.currentUser?.userId === post.author.userId}
                user={post.author}
              />
            )}
            <RelatedContentCard
              style={{ marginTop: 16 }}
              ugcId={post.ugcId || ''}
              ugcType={post.type || ''}
              categoryId={post.categoryId || ''}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PostDetail;
