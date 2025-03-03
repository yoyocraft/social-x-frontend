import IconText from '@/components/IconText';
import { InteractType } from '@/constants/UgcConstant';
import {
  adoptCommentaryUsingPost,
  deleteCommentaryUsingPost,
  likeCommentaryUsingPost,
  publishCommentaryUsingPost,
} from '@/services/socialx/commentaryController';
import {
  CheckCircleFilled,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Dropdown, Image, MenuProps, message, Space, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import CommentPublisher from './CommentPublisher';

const { Text, Paragraph } = Typography;

const CommentItem: React.FC<{
  comment: API.CommentaryInfo;
  isReply?: boolean;
  isQuestion?: boolean;
  topCommentaryId?: string;
  refreshComments?: () => void;
}> = ({ comment, isReply = false, topCommentaryId = '', refreshComments, isQuestion = false }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [liked, setLiked] = useState(comment.liked);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [adopted, setAdopted] = useState(comment.adopted);
  const { initialState } = useModel('@@initialState');

  const onCommentaryPublish = async (content: string, attachmentUrls: string[]) => {
    try {
      await publishCommentaryUsingPost({
        ugcId: comment.ugcId,
        commentary: content,
        attachmentUrls,
        parentId: topCommentaryId || comment.commentaryId,
        reqId: comment.ugcId,
      });
      message.success('回复成功');
      setShowReplyBox(false);
      if (refreshComments) {
        refreshComments();
      }
    } catch (error: any) {
      message.error('回复失败: ' + error.message);
    }
  };

  const checkSelf = () => {
    return initialState?.currentUser?.userId === comment.commentatorId;
  };

  const handleDeleteComment = async () => {
    try {
      await deleteCommentaryUsingPost({
        commentaryId: comment.commentaryId,
      });
      message.success('删除成功');
      if (refreshComments) {
        refreshComments();
      }
    } catch (error: any) {
      message.error('删除失败，请重试');
    }
  };

  const handleAdoptComment = async () => {
    if (adopted) {
      return;
    }
    try {
      await adoptCommentaryUsingPost({
        targetId: comment.commentaryId,
        interactionType: InteractType.ADOPT,
        reqId: comment.ugcId,
      });
      message.success('采纳成功');
      setAdopted(true);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const onMoreOptClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'adopt') {
      handleAdoptComment();
      return;
    }
    if (key === 'delete') {
      handleDeleteComment();
    }
  };

  const handleLike = (item: API.CommentaryInfo) => {
    const interact = !item.liked;
    likeCommentaryUsingPost({
      targetId: item.commentaryId,
      reqId: initialState?.currentUser?.userId,
      interactionType: InteractType.LIKE,
      interact,
    })
      .then(() => {
        setLiked(interact);
        setLikeCount(interact ? likeCount + 1 : likeCount - 1);
      })
      .catch(() => {
        message.error('操作失败，请重试');
      });
  };

  const handleReply = () => {
    setShowReplyBox(!showReplyBox);
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm');
  };

  const items: MenuProps['items'] = [
    isQuestion
      ? {
          key: 'adopt',
          label: '采纳',
        }
      : null,
    {
      key: 'delete',
      label: '删除',
      danger: true,
    },
  ].filter(Boolean);

  return (
    <div
      style={{
        padding: isReply ? '8px 0' : '16px 0',
        borderBottom: isReply ? 'none' : '1px solid #f0f0f0',
        width: '100%',
        position: 'relative',
      }}
    >
      <Space align="start" style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
        <Avatar size={40} src={comment.commentatorAvatar} icon={<UserOutlined />} />
        <div style={{ flex: 1, width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }} size={2}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space size={8} align="center">
                <Text strong style={{ fontSize: '14px' }}>
                  {comment.commentatorNickname || 'Anonymous'}
                </Text>

                {comment.adopted && (
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
                    已采纳
                  </Tag>
                )}
                {/* {comment.featured && (
                  <Tag
                    icon={<CrownFilled />}
                    color="blue"
                    style={{
                      padding: '0 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      lineHeight: '18px',
                      margin: 0,
                    }}
                  >
                    精选
                  </Tag>
                )} */}
              </Space>
              <Tooltip title={dayjs(comment.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatTime(comment.gmtCreate)}
                </Text>
              </Tooltip>
            </div>

            <Paragraph
              style={{
                margin: '8px 0',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                color: '#333',
              }}
            >
              {comment.commentary}
            </Paragraph>

            {comment.attachmentUrls && comment.attachmentUrls.length > 0 && (
              <Space size={[16, 4]} wrap style={{ marginTop: 8 }}>
                {comment.attachmentUrls.map((url, index) => (
                  <Image
                    key={index}
                    width={100}
                    src={url || '/placeholder.svg'}
                    style={{ borderRadius: '4px' }}
                    fallback="/media/fallback/1.png"
                  />
                ))}
              </Space>
            )}

            <Space size={16} style={{ marginTop: 8 }}>
              <IconText
                icon={liked ? LikeFilled : LikeOutlined}
                text={likeCount?.toString() || '0'}
                key="list-vertical-like-o"
                onClick={() => handleLike(comment)}
                style={{ fontSize: '14px', color: liked ? '#1890ff' : '#666' }}
              />
              <IconText
                icon={MessageOutlined}
                text={'回复'}
                key="list-vertical-reply-o"
                onClick={handleReply}
                style={{ fontSize: '14px', color: '#666' }}
              />
              {(checkSelf() || isQuestion) && (
                <Dropdown menu={{ items, onClick: onMoreOptClick }}>
                  <MoreOutlined style={{ color: '#666', cursor: 'pointer' }} />
                </Dropdown>
              )}
            </Space>
          </Space>
        </div>
      </Space>

      {showReplyBox && (
        <div style={{ marginTop: '12px', width: '100%', paddingLeft: 48 }}>
          <CommentPublisher onPublish={onCommentaryPublish} />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
