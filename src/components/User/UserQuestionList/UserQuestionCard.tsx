import IconText from '@/components/IconText';
import { UgcStatus } from '@/constants/UgcConstant';
import { dateTimeFormat } from '@/services/utils/time';
import { copyCurrentUrlToClipboard } from '@/services/utils/ugc';
import {
  CheckCircleFilled,
  CommentOutlined,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Avatar, Divider, List, Space, Tag, Typography } from 'antd';

const { Link, Text } = Typography;

interface Props {
  question: API.UgcResponse;
}

const UserQuestionCard: React.FC<Props> = ({ question }) => {
  const canSeeDetail = !!!question.auditRet && question.status === UgcStatus.PUBLISHED;
  const showRejectInfo = question.status === UgcStatus.REJECTED;
  return (
    <List.Item
      key={question.ugcId}
      style={{
        padding: '24px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
      actions={[
        <Space key={question.categoryId} size={[2, 0]} split={<Divider type="vertical" />}>
          <Text key={question.gmtModified} type="secondary" style={{ fontSize: 12 }}>
            {dateTimeFormat(question.gmtModified)}
          </Text>
          <IconText
            icon={EyeOutlined}
            text={question.viewCount?.toString() || '0'}
            key="list-vertical-view-o"
          />
          <IconText
            icon={question.liked ? LikeFilled : LikeOutlined}
            text={question.likeCount?.toString() || '0'}
            key="list-vertical-like-o"
          />
          <IconText
            icon={CommentOutlined}
            text={question.commentaryCount?.toString() || '0'}
            key="list-vertical-comment-o"
          />
          <IconText
            icon={question.collected ? StarFilled : StarOutlined}
            text={question.collectCount?.toString() || '0'}
            key="list-vertical-star-o"
          />
          <IconText
            onClick={() => copyCurrentUrlToClipboard(question)}
            icon={ShareAltOutlined}
            text="分享"
            key="list-vertical-share-o"
          />
          <Space key={question.author?.userId}>
            <Avatar size={32} src={question.author?.avatar} />
            <Text strong>
              <Link
                style={{
                  color: '#1677ff',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                href={`/user/${question.author?.userId}`}
              >
                {question.author?.nickname}
              </Link>
            </Text>
          </Space>
          {question.hasSolved && (
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
          )}
        </Space>,
      ]}
    >
      <List.Item.Meta
        title={
          <Typography.Title delete={!!question.auditRet} level={4}>
            {question.title}
          </Typography.Title>
        }
        description={
          <Typography.Paragraph
            strong
            type="secondary"
            ellipsis={{
              rows: 3,
              expandable: false,
            }}
            style={{
              marginBottom: 4,
              fontSize: 16,
            }}
          >
            {question.summary}
          </Typography.Paragraph>
        }
      />
      {canSeeDetail && (
        <Link href={`/question/${question.ugcId}`} style={{ fontSize: 16, color: '#1990ff' }}>
          查看全文
        </Link>
      )}
      {showRejectInfo && <Tag color="error">{question.auditRet}</Tag>}
    </List.Item>
  );
};

export default UserQuestionCard;
