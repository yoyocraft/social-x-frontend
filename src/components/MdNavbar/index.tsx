import { Card } from 'antd';
import MarkNav from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';

interface Props {
  content: string;
}

const MdNavbar = (props: Props) => {
  const { content } = props;
  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      hoverable
      bordered={false}
      title="文章目录"
    >
      <MarkNav className="article-menu" source={content} headingTopOffset={80} ordered={false} />
    </Card>
  );
};

export default MdNavbar;
