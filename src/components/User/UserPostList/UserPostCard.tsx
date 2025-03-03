import IconText from '@/components/IconText';
import { UgcStatus } from '@/constants/UgcConstant';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CommentOutlined,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Avatar, Divider, Image, List, Space, Tag, Typography } from 'antd';

const { Link, Text, Paragraph } = Typography;

interface Props {
  post: API.UgcResponse;
}

const UserPostCard: React.FC<Props> = ({ post }) => {
  const canSeeDetail = !!!post.auditRet && post.status === UgcStatus.PUBLISHED;
  const showRejectInfo = post.status === UgcStatus.REJECTED;

  const renderPostContent = (item: API.UgcResponse) => {
    const hasLink = item.content?.includes('http');

    // 处理换行符，将 \n 转换为 <br />，保持原始格式
    const contentWithLineBreaks = item.content?.split('\n');

    // 如果没有链接，直接渲染内容并保留换行
    if (!hasLink) {
      return contentWithLineBreaks?.map((line, index) => <Paragraph key={index}>{line}</Paragraph>);
    }

    return (
      <>
        {contentWithLineBreaks?.map((line, index) => {
          if (line.startsWith('http')) {
            return (
              <Link key={index} href={line} target="_blank">
                {line}
              </Link>
            );
          }
          // 渲染其他文本内容
          return <Paragraph key={index}>{line}</Paragraph>;
        })}
      </>
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
          <IconText icon={ShareAltOutlined} text="分享" key="list-vertical-share-o" />
          {canSeeDetail && (
            <Link key={post.ugcId} href={`/post/${post.ugcId}`} style={{ color: '#1990ff' }}>
              查看原贴
            </Link>
          )}
          {showRejectInfo && <Tag color="error">{post.auditRet}</Tag>}
        </Space>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={post.author?.avatar} size={40} />}
        title={
          <Space size={2} direction="vertical">
            <Text strong>{post.author?.nickname}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {post.gmtCreate ? dateTimeFormat(post.gmtCreate, 'YYYY-MM-DD HH:mm') : 'N/A'}
            </Text>
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
