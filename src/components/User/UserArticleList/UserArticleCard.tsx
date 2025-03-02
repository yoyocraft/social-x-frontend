import IconText from '@/components/IconText';
import TagList from '@/components/TagList';
import { dateTimeFormat } from '@/services/utils/time';
import { EyeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { Divider, List, Space, Typography } from 'antd';

interface Props {
  article: API.UgcResponse;
}

const UserArticleCard: React.FC<Props> = ({ article }) => {
  return (
    <List.Item
      key={article.title}
      style={{
        padding: '24px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        transition: 'background-color 0.3s',
      }}
      actions={[
        <IconText
          icon={EyeOutlined}
          text={article.viewCount?.toString() || '0'}
          key="list-vertical-view-o"
        />,
        <IconText
          icon={LikeOutlined}
          text={article.likeCount?.toString() || '0'}
          key="list-vertical-like-o"
        />,
        <IconText
          icon={StarOutlined}
          text={article.collectCount?.toString() || '0'}
          key="list-vertical-star-o"
        />,
      ]}
      extra={
        article.cover && (
          <img
            alt="cover"
            src={article.cover}
            style={{
              width: 200,
              height: 120,
              objectFit: 'cover',
              borderRadius: 4,
              marginLeft: 24,
            }}
          />
        )
      }
    >
      <List.Item.Meta
        title={
          <Typography.Title level={4} style={{ marginBottom: 8, fontSize: 18 }}>
            <a href={`/article/${article.ugcId}`} style={{ color: 'rgba(0,0,0,0.85)' }}>
              {article.title}
            </a>
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
        <Typography.Text>{article.author?.nickname}</Typography.Text>
        <Divider type="vertical" />
        <Typography.Text style={{ fontSize: 12 }}>
          {article.gmtCreate ? dateTimeFormat(article.gmtCreate, 'YYYY-MM-DD HH:mm') : 'N/A'}
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
