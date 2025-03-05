import IconText from '@/components/IconText';
import ShareIconText from '@/components/ShareModal';
import { UgcStatus } from '@/constants/UgcConstant';
import { deleteUgcUsingPost } from '@/services/socialx/ugcController';
import { dateTimeFormat } from '@/services/utils/time';
import {
  CheckCircleFilled,
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
  List,
  MenuProps,
  message,
  Modal,
  Space,
  Tag,
  Typography,
} from 'antd';

const { Link, Text } = Typography;
const { confirm } = Modal;

const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: '删除',
    danger: true,
  },
];

interface Props {
  question: API.UgcResponse;
  refreshUgcList?: (ugcId: string) => void;
  collectPage?: boolean;
}

const UserQuestionCard: React.FC<Props> = ({ question, refreshUgcList, collectPage = false }) => {
  const canSeeDetail = !!!question.auditRet && question.status === UgcStatus.PUBLISHED;
  const showRejectInfo = question.status === UgcStatus.REJECTED;
  const { initialState } = useModel('@@initialState');

  const showAuthorFeature =
    initialState?.currentUser?.userId === question.author?.userId && !collectPage;

  const handleDeleteUgc = async () => {
    try {
      await deleteUgcUsingPost({ ugcId: question.ugcId });
      message.success('删除成功');
      if (refreshUgcList) {
        refreshUgcList(question.ugcId || '');
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
          <ShareIconText key="list-vertical-share-o" item={question} />
          <Space key={question.author?.userId}>
            <Avatar size={32} src={question.author?.avatar} />
            <Text strong>
              <Link
                style={{
                  color: 'black',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                href={`/user/${question.author?.userId}`}
              >
                {question.author?.nickname}
              </Link>
            </Text>
          </Space>
          {showAuthorFeature && (
            <Dropdown menu={{ items, onClick: onMoreOptClick }}>
              <MoreOutlined style={{ color: '#666', cursor: 'pointer' }} />
            </Dropdown>
          )}
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
