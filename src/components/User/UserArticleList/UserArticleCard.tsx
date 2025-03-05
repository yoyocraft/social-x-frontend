import IconText from '@/components/IconText';
import ShareIconText from '@/components/ShareModal';
import TagList from '@/components/Ugc/TagList';
import { UgcStatus } from '@/constants/UgcConstant';
import { deleteUgcUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CommentOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  MoreOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import {
  Button,
  Divider,
  Dropdown,
  Image,
  List,
  MenuProps,
  message,
  Modal,
  Space,
  Tag,
  Typography,
} from 'antd';

const { confirm } = Modal;

const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: '删除',
    danger: true,
  },
];

interface Props {
  article: API.UgcResponse;
  refreshUgcList?: (ugcId: string) => void;
  collectPage?: boolean;
}

const UserArticleCard: React.FC<Props> = ({ article, refreshUgcList, collectPage = false }) => {
  const canSeeDetail = article.status === UgcStatus.PUBLISHED;
  const showRejectInfo = article.status === UgcStatus.REJECTED;
  const showEditFeature =
    article.status === UgcStatus.DRAFT || article.status === UgcStatus.REJECTED;

  const { initialState } = useModel('@@initialState');

  const showAuthorFeature =
    initialState?.currentUser?.userId === article.author?.userId && !collectPage;

  const handleDeleteUgc = async () => {
    try {
      await deleteUgcUsingPost({ ugcId: article.ugcId });
      message.success('删除成功');
      if (refreshUgcList) {
        refreshUgcList(article.ugcId || '');
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const onMoreOptClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'delete') {
      confirm({
        title: '确认删除吗？',
        icon: <ExclamationCircleFilled />,
        onOk() {
          handleDeleteUgc();
        },
      });
    }
  };

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
          <ShareIconText key="list-vertical-share-o" item={article} />
          {showRejectInfo && <Tag color="error">{article.auditRet}</Tag>}
          {showEditFeature && (
            <Button
              type="link"
              size="small"
              onClick={() => history.push(`/article/edit/${article.ugcId}`)}
            >
              编辑
            </Button>
          )}
          {showAuthorFeature && (
            <Dropdown menu={{ items, onClick: onMoreOptClick }}>
              <MoreOutlined style={{ color: '#666', cursor: 'pointer' }} />
            </Dropdown>
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
              color: 'black',
              fontWeight: 500,
              textDecoration: 'none',
            }}
            href={`/user/${article.author?.userId}`}
          >
            {article.author?.nickname}
          </Typography.Link>
        </Typography.Text>
        <Divider type="vertical" />
        <Typography.Text>{dateTimeFormat(article.gmtModified)}</Typography.Text>
        <Divider type="vertical" />
        <Space size={4}>
          <TagList tags={article.tags} />
        </Space>
      </Space>
    </List.Item>
  );
};

export default UserArticleCard;
