import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Button, Steps, Space, Progress, Menu, message } from 'antd';
import type { MenuItemProps } from 'antd';
import styled from '@emotion/styled';
import { ArrowLeftOutlined, ArrowRightOutlined, SendOutlined, HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import axios from 'axios';
import { getApiUrl } from '../../config';

const { Title, Paragraph, Text } = Typography;
const { Content, Sider } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: #f5f5f5;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

const QuestionCard = styled(Card)`
  margin: 16px 0;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const StyledMenuItem = styled(Menu.Item as React.FC<MenuItemProps>)`
  padding: 8px 16px !important;
  min-height: 60px;
  position: relative;
  margin: 2px 8px !important;
  border-radius: 8px;
  
  .ant-menu-title-content {
    white-space: normal !important;
    line-height: 1.3;
    padding-right: 28px;
    width: 100%;
    
    .ant-space {
      width: 100%;
      gap: 2px !important;
    }
    
    .question-text {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.85);
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 1.4;
      
      .question-number {
        font-weight: bold;
        margin-right: 2px;
      }
    }
    
    .answer-preview {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 11px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 2px;
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 1.3;
    }
  }

  .ant-menu-item-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
  }
`;

const THEMES = ['动力探索', '强项认知', '奋斗方向', '共赢发展'];

const getThemeQuestions = (themeIndex: number, questions: Question[]) => {
  const startIndex = themeIndex * 12;
  const endIndex = startIndex + 12;
  return questions.slice(startIndex, endIndex);
};

const getThemeProgress = (themeIndex: number, questions: Question[], answers: Answer[]) => {
  const themeQuestions = getThemeQuestions(themeIndex, questions);
  const answeredCount = themeQuestions.filter(q => 
    answers.some(a => a.questionId === q.id)
  ).length;
  return {
    total: themeQuestions.length,
    completed: answeredCount,
    percent: themeQuestions.length ? Math.round((answeredCount / themeQuestions.length) * 100) : 0
  };
};

const StyledSubMenu = styled(Menu.SubMenu)`
  .ant-menu-sub {
    background: #fafafa !important;
  }
  
  .ant-menu-item {
    margin: 4px 0 !important;
  }

  .ant-menu-submenu-title {
    font-weight: bold;
    height: auto !important;
    padding: 12px 24px !important;
    
    .ant-progress {
      margin-top: 8px;
    }
  }
`;

interface Question {
  id: number;
  content: string;
  ageRange: '4-8' | '9-14' | '14+';
}

interface Answer {
  questionId: number;
  content: string;
  submittedAt: string;
}

interface AnswerSummary {
  total: number;
  completed: number;
  answers: Answer[];
}

const AdultQAAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnswerSummary | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchAnswerSummary();
  }, []);

  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      message.error('用户未登录');
      navigate('/login');
      return null;
    }
    const user = JSON.parse(userStr);
    return user.id;
  };

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        navigate('/login');
        return;
      }

      const response = await axios.get(getApiUrl('/questions'), {
        params: { ageRange: '14+' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQuestions(response.data);
    } catch (error) {
      console.error('获取题目失败:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        message.error('登录已过期，请重新登录');
        navigate('/login');
      } else {
        message.error('获取题目失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswerSummary = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(`/questions/answers/user/${userId}/summary`), {
        params: { ageRange: '14+' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSummary(response.data);
    } catch (error) {
      console.error('获取答题进度失败:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        message.error('登录已过期，请重新登录');
        navigate('/login');
      } else {
        message.error('获取答题进度失败');
      }
    }
  };

  const handleAnswer = (editor: IDomEditor) => {
    const html = editor.getHtml();
    const currentQuestionId = questions[currentQuestion].id;
    setAnswers(prev => ({
      ...prev,
      [currentQuestionId]: html
    }));
  };

  const handleSubmit = async () => {
    if (!editor) return;
    
    const userId = getUserId();
    if (!userId) return;

    const currentQuestionId = questions[currentQuestion].id;
    const content = editor.getHtml();
    const plainText = content?.replace(/<[^>]*>/g, '').trim();
    
    if (!plainText) {
      message.warning('请输入答案');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(getApiUrl(`/questions/${currentQuestionId}/answers`), {
        userId,
        content,
        submittedBy: '用户名', // TODO: 使用实际的用户名
        ageRange: '14+'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      message.success('保存成功');
      fetchAnswerSummary();
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        if (editor) {
          editor.setHtml('');
        }
      } else {
        navigate('/report');
      }
    } catch (error) {
      console.error('保存答案失败:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        message.error('登录已过期，请重新登录');
        navigate('/login');
      } else {
        message.error('保存失败');
      }
    }
  };

  const handleSelectQuestion = (questionId: number) => {
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      setCurrentQuestion(index);
    }
  };
  useEffect(() => {
    if (summary?.answers) {
      const savedAnswers = summary.answers.reduce((acc, answer) => ({
        ...acc,
        [answer.questionId]: answer.content
      }), {});
      setAnswers(prev => ({ ...prev, ...savedAnswers }));
      
      // 如果编辑器已经创建，设置当前问题的答案
      if (editor && questions[currentQuestion]) {
        const currentQuestionId = questions[currentQuestion].id;
        const savedAnswer = summary.answers.find(a => a.questionId === currentQuestionId);
        if (savedAnswer) {
          editor.setHtml(savedAnswer.content);
        } else {
          editor.setHtml('');
        }
      }
    }
  }, [summary, currentQuestion, questions, editor]);
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入你的答案...',
    MENU_CONF: {},
    onCreated: (editor: IDomEditor) => {
      setEditor(editor);
      // 在编辑器创建后设置初始答案
      if (questions[currentQuestion]) {
        const currentQuestionId = questions[currentQuestion].id;
        const savedAnswer = summary?.answers?.find(a => a.questionId === currentQuestionId);
        if (savedAnswer) {
          editor.setHtml(savedAnswer.content);
        }
      }
    }
  };
  if (loading) return null;

  const progress = summary ? (summary.completed / summary.total * 100) : 0;

  return (
    <StyledLayout>
      <Sider width={300} style={{ background: '#fff', padding: '24px 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 16 }}>
          <Progress
            percent={Math.round(progress)}
            format={percent => `已完成 ${percent}%`}
          />
          {progress < 100 && (
            <Button
              type="primary"
              block
              onClick={() => {
                const nextUnanswered = questions.findIndex((q) => !summary?.answers.find(a => a.questionId === q.id));
                if (nextUnanswered !== -1) {
                  setCurrentQuestion(nextUnanswered);
                }
              }}
              style={{ marginTop: 16 }}
            >
              继续答题
            </Button>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[questions[currentQuestion]?.id.toString()]}
          defaultOpenKeys={[]}
          style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}
        >
          {THEMES.map((theme, themeIndex) => {
            const progress = getThemeProgress(themeIndex, questions, summary?.answers || []);
            return (
              <StyledSubMenu
                key={`theme-${themeIndex}`}
                title={
                  <div>
                    <div>{theme} ({themeIndex * 12 + 1}-{(themeIndex + 1) * 12}题)</div>
                    <Progress
                      percent={progress.percent}
                      size="small"
                      format={() => `${progress.completed}/${progress.total}`}
                    />
                  </div>
                }
              >
                {getThemeQuestions(themeIndex, questions).map((question, index) => {
                  const answer = summary?.answers.find(a => a.questionId === question.id);
                  const globalIndex = themeIndex * 12 + index;
                  return (
                    <StyledMenuItem
                      key={question.id}
                      onClick={() => handleSelectQuestion(question.id)}
                      icon={answer ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : null}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text className="question-text">
                          <span className="question-number">Q{globalIndex + 1}：</span>
                          {question.content}
                        </Text>
                        {answer && (
                          <Text className="answer-preview">
                            答：{answer.content?.replace(/<[^>]+>/g, '').trim()}
                          </Text>
                        )}
                      </Space>
                    </StyledMenuItem>
                  );
                })}
              </StyledSubMenu>
            );
          })}
        </Menu>
      </Sider>

      <StyledContent>
        <Button 
          icon={<HomeOutlined />} 
          onClick={() => navigate('/home')}
          style={{ marginBottom: '20px' }}
        >
          返回主页
        </Button>

        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          不一样的自己问答测评（14岁以上）
        </Title>

        <Steps
          current={Math.floor(currentQuestion / 12)}
          items={THEMES.map((theme, index) => ({
            title: theme,
            description: `${index * 12 + 1}-${(index + 1) * 12}题`
          }))}
          style={{ marginBottom: 40 }}
        />

        <QuestionCard
          title={`Q${currentQuestion + 1}/${questions.length}`}
        >
          <Paragraph style={{ fontSize: '18px', marginBottom: 24 }}>
            {questions[currentQuestion].content}
          </Paragraph>
          
          <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px' }}>
            <Toolbar
              editor={editor}
              defaultConfig={{}}
              mode="default"
              style={{ borderBottom: '1px solid #f0f0f0' }}
            />
            <Editor
              defaultConfig={editorConfig}
              value={answers[questions[currentQuestion].id] || ''}
              onCreated={setEditor}
              onChange={handleAnswer}
              mode="default"
              style={{ height: '300px', overflowY: 'hidden' }}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Space size="large">
              {currentQuestion > 0 && (
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                >
                  上一题
                </Button>
              )}
              <Button 
                type="primary"
                icon={currentQuestion < questions.length - 1 ? <ArrowRightOutlined /> : <SendOutlined />}
                onClick={handleSubmit}
              >
                {currentQuestion < questions.length - 1 ? '保存并继续' : '完成'}
              </Button>
            </Space>
          </div>
        </QuestionCard>
      </StyledContent>
    </StyledLayout>
  );
};

export default AdultQAAssessment;