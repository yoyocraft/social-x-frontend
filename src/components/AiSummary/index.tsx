import { getApiEndpoint } from '@/constants/config';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useModel } from '@umijs/max';
import { Alert, Card, message, Typography } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import './index.less';

interface AiSummaryProps {
  ugcId: string;
}

const AiSummary: React.FC<AiSummaryProps> = ({ ugcId }) => {
  const [summary, setSummary] = useState<string>('');
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);

  const apiEndpoint = getApiEndpoint('AI_SUMMARY');

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
    <Card
      className="ai-summary-card"
      bordered={false}
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
      }}
    >
      <Alert
        message={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              智能总结
            </Typography.Title>
          </div>
        }
        description={
          <div style={{ marginTop: '16px' }}>
            {summary && (
              <MarkdownPreview
                source={summary}
                style={{
                  backgroundColor: 'transparent',
                  color: '#2c3e50',
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
                className="markdown-preview"
              />
            )}
          </div>
        }
        type="info"
        style={{
          background: 'transparent',
          border: 'none',
          padding: '16px',
        }}
      />
    </Card>
  ) : null;
};

export default AiSummary;
