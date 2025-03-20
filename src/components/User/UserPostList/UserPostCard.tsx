import IconText from '@/components/IconText';
import ShareIconText from '@/components/ShareModal';
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
import { useModel } from '@umijs/max';
import {
  Avatar,
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

const { Link, Text, Paragraph } = Typography;

const { confirm } = Modal;

const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: '删除',
    danger: true,
  },
];

interface Props {
  post: API.UgcResponse;
  refreshUgcList?: (ugcId: string) => void;
  collectPage?: boolean;
}

const UserPostCard: React.FC<Props> = ({ post, refreshUgcList, collectPage = false }) => {
  const canSeeDetail = !!!post.auditRet && post.status === UgcStatus.PUBLISHED;
  const showRejectInfo = post.status === UgcStatus.REJECTED;

  const { initialState } = useModel('@@initialState');

  const showAuthorFeature =
    initialState?.currentUser?.userId === post.author?.userId && !collectPage;

  const handleDeleteUgc = async () => {
    try {
      await deleteUgcUsingPost({ ugcId: post.ugcId });
      message.success('删除成功');
      if (refreshUgcList) {
        refreshUgcList(post.ugcId || '');
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

  const renderPostContent = (item: API.UgcResponse) => {
    const hasLink = item.content?.includes('http');
    const contentWithLineBreaks = item.content?.split('\n');

    if (!hasLink) {
      return (
        <Paragraph
          ellipsis={{
            rows: 10,
            expandable: true,
            symbol: '展开更多',
          }}
        >
          {contentWithLineBreaks?.join('\n')}
        </Paragraph>
      );
    }

    return (
      <Paragraph
        ellipsis={{
          rows: 10,
          expandable: true,
          symbol: '展开更多',
        }}
      >
        {contentWithLineBreaks?.map((line, index) => {
          if (line.startsWith('http')) {
            return (
              <span key={index}>
                <Link href={line} target="_blank">
                  {line}
                </Link>
                {index < contentWithLineBreaks.length - 1 && '\n'}
              </span>
            );
          }
          return (
            <span key={index}>
              {line}
              {index < contentWithLineBreaks.length - 1 && '\n'}
            </span>
          );
        })}
      </Paragraph>
    );
  };
  return (
    <List.Item
      key={post.ugcId}
      style={{
        padding: '24px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
      actions={[
        <Space key={post.categoryId} size={[2, 0]} split={<Divider type="vertical" />}>
          <IconText
            icon={EyeOutlined}
            text={post.viewCount?.toString() || '0'}
            key="list-vertical-view-o"
          />
          <IconText
            icon={post.liked ? LikeFilled : LikeOutlined}
            text={post.likeCount?.toString() || '0'}
            key="list-vertical-like-o"
          />
          <IconText
            icon={CommentOutlined}
            text={post.commentaryCount?.toString() || '0'}
            key="list-vertical-comment-o"
          />
          <IconText
            icon={post.collected ? StarFilled : StarOutlined}
            text={post.collectCount?.toString() || '0'}
            key="list-vertical-star-o"
          />
          <ShareIconText key="list-vertical-share-o" item={post} />
          {canSeeDetail && (
            <Link key={post.ugcId} href={`/post/${post.ugcId}`} style={{ color: '#1990ff' }}>
              查看原贴
            </Link>
          )}
          {showRejectInfo && <Tag color="error">{post.auditRet}</Tag>}
          {showAuthorFeature && (
            <Dropdown menu={{ items, onClick: onMoreOptClick }}>
              <MoreOutlined style={{ color: '#666', cursor: 'pointer' }} />
            </Dropdown>
          )}
        </Space>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={post.author?.avatar} size={40} />}
        title={
          <Space size={2} direction="vertical">
            <Text strong>
              <Link
                style={{
                  color: 'black',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                href={`/user/${post.author?.userId}`}
              >
                {post.author?.nickname}
              </Link>
            </Text>
            <Text type="secondary">{dateTimeFormat(post.gmtCreate)}</Text>
          </Space>
        }
      />
      <div style={{ margin: '8px 0' }}>{renderPostContent(post)}</div>
      {post.attachmentUrls && post.attachmentUrls.length > 0 && (
        <Space size={[16, 8]} wrap style={{ marginTop: 16 }}>
          {post.attachmentUrls.map((url, index) => (
            <Image key={index} width={100} src={url} fallback="/media/fallback/1.png" />
          ))}
        </Space>
      )}
    </List.Item>
  );
};

export default UserPostCard;
