import type React from 'react';

import IconText from '@/components/IconText';
import { InteractType } from '@/constants/UgcConstant';
import {
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
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Avatar,
  Badge,
  Dropdown,
  Image,
  MenuProps,
  message,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import CommentPublisher from './CommentPublisher';

const { Text, Paragraph } = Typography;

const CommentItem: React.FC<{
  comment: API.CommentaryInfo;
  isReply?: boolean;
  topCommentaryId?: string;
  refreshComments?: () => void;
}> = ({ comment, isReply = false, topCommentaryId = '', refreshComments }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [liked, setLiked] = useState(comment.liked);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
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

  const onMoreOptClick: MenuProps['onClick'] = ({ key }) => {
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
    {
      key: 'delete',
      label: '删除',
      danger: true,
    },
  ];

  return (
    <div
      style={{
        padding: isReply ? '8px 0' : '16px 0',
        borderBottom: isReply ? 'none' : '1px solid #f0f0f0',
        width: '100%',
      }}
    >
      <Space align="start" style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
        <Avatar
          src={comment.commentatorAvatar || '/placeholder-user.jpg'}
          alt={comment.commentatorNickname}
        />
        <div style={{ flex: 1, width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Text strong style={{ fontSize: '14px' }}>
                {comment.commentatorNickname || 'Anonymous'}
              </Text>
              {comment.adopted && (
                <Badge
                  count={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                  style={{ backgroundColor: 'transparent' }}
                />
              )}
              <Tooltip title={dayjs(comment.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatTime(comment.gmtCreate)}
                </Text>
              </Tooltip>
            </Space>

            <Paragraph
              style={{
                margin: '8px 0',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {comment.commentary}
            </Paragraph>
            {comment.attachmentUrls && comment.attachmentUrls.length > 0 && (
              <Space size={[16, 4]} wrap style={{ marginTop: 8 }}>
                {comment.attachmentUrls.map((url, index) => (
                  <Image key={index} width={100} src={url} fallback="/media/fallback/1.png" />
                ))}
              </Space>
            )}

            <Space>
              <IconText
                icon={liked ? LikeFilled : LikeOutlined}
                text={likeCount?.toString() || '0'}
                key="list-vertical-like-o"
                onClick={() => handleLike(comment)}
              />
              <IconText
                icon={MessageOutlined}
                text={'回复'}
                key="list-vertical-reply-o"
                onClick={handleReply}
              />
              {checkSelf() && (
                <Dropdown menu={{ items, onClick: onMoreOptClick }}>
                  <MoreOutlined />
                </Dropdown>
              )}
            </Space>
          </Space>
        </div>
      </Space>
      {showReplyBox && (
        <div style={{ marginTop: '12px', width: '100%' }}>
          <CommentPublisher onPublish={onCommentaryPublish} />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
