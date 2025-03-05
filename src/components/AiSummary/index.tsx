import MarkdownPreview from '@uiw/react-markdown-preview';
import { useModel } from '@umijs/max';
import { Alert, Card, message, Typography } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';

interface AiSummaryProps {
  ugcId: string;
}

const AiSummary: React.FC<AiSummaryProps> = ({ ugcId }) => {
  const [summary, setSummary] = useState<string>('');
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);

  // const apiEndpoint = 'http://127.0.0.1:8085/api/ugc/summary';
  const apiEndpoint = 'http://127.0.0.1:8080/api/ugc/summary';

  const fetchSummary = () => {
    setLoading(true);
    setSummary('');

    const reqId = `${initialState?.currentUser?.userId}_${Date.now()}`;

    // 创建新的 SSE 连接
    const eventSource = new EventSource(`${apiEndpoint}?ugcId=${ugcId}&reqId=${reqId}`, {
      withCredentials: true,
    });

    let firstMessage = true;

    eventSource.onmessage = (event) => {
      if (firstMessage) {
        message.success('开始总结文章');
        firstMessage = false;
      }
      const ret = event.data + '\n';
      setSummary((prev) => prev + ret);
    };

    eventSource.onerror = (event) => {
      if (event.eventPhase === EventSource.CLOSED) {
        message.info('文章总结完成');
        eventSource.close();
      }
    };
  };

  useEffect(() => {
    if (!ugcId) {
      return;
    }
    fetchSummary();
  }, [ugcId]);

  return loading ? (
    <Card className="ai-summary-card" bordered={false}>
      <Alert
        message={<Typography.Title level={4}>智能总结</Typography.Title>}
        description={
          <>
            {summary && (
              <MarkdownPreview
                source={summary}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black',
                  fontSize: 15,
                }}
                className="markdown-preview"
              />
            )}
          </>
        }
        type="info"
      />
    </Card>
  ) : null;
};

export default AiSummary;
