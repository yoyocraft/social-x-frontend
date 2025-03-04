import IconText from '@/components/IconText';
import ShareIconText from '@/components/ShareModal';
import TagList from '@/components/Ugc/TagList';
import { UgcStatus } from '@/constants/UgcConstant';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CommentOutlined,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Divider, Image, List, Space, Tag, Typography } from 'antd';

interface Props {
  article: API.UgcResponse;
}

const UserArticleCard: React.FC<Props> = ({ article }) => {
  const canSeeDetail = article.status === UgcStatus.PUBLISHED;
  const showRejectInfo = article.status === UgcStatus.REJECTED;
  const showEditFeature =
    article.status === UgcStatus.DRAFT || article.status === UgcStatus.REJECTED;

  return (
    <List.Item
      key={article.title}
      style={{
        padding: '24px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        transition: 'background-color 0.3s',
      }}
      actions={[
        <Space key={article.categoryId} size={[2, 0]} split={<Divider type="vertical" />}>
          <IconText
            icon={EyeOutlined}
            text={article.viewCount?.toString() || '0'}
            key="list-vertical-view-o"
          />
          <IconText
            icon={article.liked ? LikeFilled : LikeOutlined}
            text={article.likeCount?.toString() || '0'}
            key="list-vertical-like-o"
          />
          <IconText
            icon={CommentOutlined}
            text={article.commentaryCount?.toString() || '0'}
            key="list-vertical-comment-o"
          />
          <IconText
            icon={article.collected ? StarFilled : StarOutlined}
            text={article.collectCount?.toString() || '0'}
            key="list-vertical-star-o"
          />
          <ShareIconText key="list-vertical-share-o" item={article} />,
          {showRejectInfo ? <Tag color="error">{article.auditRet}</Tag> : null}
          {showEditFeature && (
            <Button
              type="link"
              size="small"
              onClick={() => history.push(`/article/edit/${article.ugcId}`)}
            >
              编辑
            </Button>
          )}
        </Space>,
      ]}
      extra={
        article.cover && (
          <Image
            width={200}
            src={article.cover}
            style={{
              height: 150,
              objectFit: 'cover',
            }}
          />
        )
      }
    >
      <List.Item.Meta
        title={
          <Typography.Title
            delete={showRejectInfo}
            level={4}
            style={{ marginBottom: 8, fontSize: 18 }}
          >
            {canSeeDetail ? (
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => history.push(`/article/${article.ugcId}`)}
              >
                {article.title}
              </div>
            ) : (
              article.title
            )}
          </Typography.Title>
        }
        description={
          <Typography.Paragraph
            ellipsis={{ rows: 2 }}
            style={{
              color: 'rgba(0,0,0,0.65)',
              marginBottom: 4,
              fontSize: 14,
            }}
          >
            {article.summary}
          </Typography.Paragraph>
        }
      />
      <Space size={8} align="center">
        <Typography.Text strong>
          <Typography.Link
            style={{
              color: '#1677ff',
              fontWeight: 500,
              textDecoration: 'none',
            }}
            href={`/user/${article.author?.userId}`}
          >
            {article.author?.nickname}
          </Typography.Link>
        </Typography.Text>
        <Divider type="vertical" />
        <Typography.Text style={{ fontSize: 12 }}>
          {dateTimeFormat(article.gmtModified)}
        </Typography.Text>
        <Divider type="vertical" />
        <Space size={4}>
          <TagList tags={article.tags} />
        </Space>
      </Space>
    </List.Item>
  );
};

export default UserArticleCard;
