import { Card, ConfigProvider, Empty } from 'antd';
import MarkNav from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';
import './index.css';

interface Props {
  content: string;
}

const MdNavbar = (props: Props) => {
  const { content } = props;

  const hasHeadings = /^(#{1,6})\s/.test(content);

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            bodyPadding: 12,
          },
        },
      }}
    >
      <Card
        style={{
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '8px 0px 0px',
          overflow: 'auto',
        }}
        hoverable
        bordered={false}
        title="文章目录"
      >
        {hasHeadings ? (
          <MarkNav
            className="article-menu custom-nav"
            source={content}
            headingTopOffset={80}
            ordered={false}
          />
        ) : (
          <Empty description="暂无目录" />
        )}
      </Card>
    </ConfigProvider>
  );
};

export default MdNavbar;
