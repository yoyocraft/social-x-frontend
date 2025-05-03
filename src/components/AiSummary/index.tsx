import { getApiEndpoint } from '@/constants/config';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useModel } from '@umijs/max';
import { Alert, Button, Card, Input, message, Space, Typography } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import './index.less';

interface AiSummaryProps {
  ugcId: string;
}

const AiSummary: React.FC<AiSummaryProps> = ({ ugcId }) => {
  const [summary, setSummary] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');

  const apiEndpoint = getApiEndpoint('AI_SUMMARY');

  const fetchSummary = () => {
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

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      message.warning('请输入问题');
      return;
    }

    setIsAsking(true);
    setAnswer('');

    // Mock AI response
    const mockResponses = [
      '根据文章内容，这个问题可以从以下几个方面来回答...',
      '文章中提到，这个问题的关键点在于...',
      '从作者的论述来看，这个问题的答案应该是...',
      '这是一个很好的问题，文章中的相关论述表明...',
    ];

    // Simulate typing effect
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    let currentText = '';
    for (let i = 0; i < response.length; i++) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      currentText += response[i];
      setAnswer(currentText);
    }

    setIsAsking(false);
  };

  useEffect(() => {
    if (!ugcId) {
      return;
    }
    fetchSummary();
  }, [ugcId]);

  return (
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
            <div style={{ marginTop: '24px' }}>
              <Typography.Title level={5} style={{ marginBottom: '16px', color: '#1890ff' }}>
                向AI提问
              </Typography.Title>
              <Space.Compact
                className="question-input"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                <Input
                  placeholder="输入您的问题..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onPressEnter={handleAskQuestion}
                  disabled={isAsking}
                />
                <Button type="primary" onClick={handleAskQuestion} loading={isAsking}>
                  提问
                </Button>
              </Space.Compact>
              {answer && (
                <div className="answer-container">
                  <MarkdownPreview
                    source={answer}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#2c3e50',
                      fontSize: 15,
                      lineHeight: 1.6,
                    }}
                    className="markdown-preview"
                  />
                </div>
              )}
            </div>
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
  );
};

export default AiSummary;
