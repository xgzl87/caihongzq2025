import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Row, Col, Space, Card, Carousel, Statistic, message, Spin, Menu, Dropdown } from 'antd';
import { WechatOutlined, SafetyCertificateOutlined, PlayCircleOutlined, BookOutlined, UserOutlined, SettingOutlined, LogoutOutlined, CaretDownOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../../config';
import Avatar from '../../components/Avatar';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(45deg, #89C4F4 0%, #C7F4D3 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/tree-rings.png');
    background-size: cover;
    opacity: 0.05;
    pointer-events: none;
  }
`;

const NavBar = styled.div`
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const UserAvatar = styled(Avatar)`
  background: #1890ff;
  border: 2px solid #fff;
`;

const MainContent = styled(Content)`
  padding: 0 40px;
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: -32px;
`;

const WechatButton = styled(Button)`
  height: 60px;
  width: 240px;
  font-size: 18px;
  background: #FFB347;
  border-color: #FFB347;
  box-shadow: 0 4px 12px rgba(255, 179, 71, 0.3);
  
  &:hover {
    background: #FFA533;
    border-color: #FFA533;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  animation: pulse 2s infinite;
`;

const CaseCard = styled(Card)`
  margin: 16px 0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .ant-card-body {
    padding: 16px;
  }
`;

const BottomBar = styled.div`
  padding: 24px 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuickLink = styled(Button)`
  color: #333;
  &:hover {
    color: #1890ff;
  }
`;

const RealTimeNotice = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`;

const cases = [
  {
    title: '6岁发现音乐天赋',
    result: '钢琴比赛金奖',
    description: '通过天赋测评发现音乐潜能，3个月后参赛获奖'
  },
  {
    title: '8岁确认逻辑天赋',
    result: '奥数竞赛一等奖',
    description: '定制学习方案，激发数理思维能力'
  },
  {
    title: '5岁识别运动天赋',
    result: '少儿体操冠军',
    description: '科学选择运动项目，充分发挥身体优势'
  }
];

const GrowthStages = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-height: 600px;
  margin-top: 100px;
`;

const StageCard = styled.div`
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.6s forwards;
  padding: 24px;
  background: #f8f9ff;
  border-radius: 12px;
  margin-bottom: 24px;
  border-left: 4px solid #1890ff;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:nth-child(1) { animation-delay: 0.2s; }
  &:nth-child(2) { animation-delay: 0.4s; }
  &:nth-child(3) { animation-delay: 0.6s; }
  &:nth-child(4) { animation-delay: 0.8s; }
  &:nth-child(5) { animation-delay: 1s; }
`;

const StageTitle = styled.h3`
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StageContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  font-size: 14px;
  margin-top: 12px;
`;

const StageSubItem = styled.div`
  padding: 8px;
  background: #f8f9ff;
  border-radius: 6px;
  position: relative;
  &::before {
    content: '▫️';
    margin-right: 8px;
  }
`;

const StageItem = styled.div`
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

// 新增滚动容器样式
const ScrollContainer = styled.div`
  max-height: 280px;
  overflow-y: auto;
  padding-right: 8px;
  margin-top: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #1890ff;
    border-radius: 3px;
  }
`;

// 新增互动条目样式
const InteractionItem = styled.div`
  padding: 8px;
  margin: 4px 0;
  background: rgba(255,255,255,0.9);
  border-radius: 6px;
  animation: slideIn 0.5s ease-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

// 爱的互动完整数据
const loveInteractions = [
  '不轻易打断孩子说话',
  '能尝试感受孩子心里的感受',
  '能让孩子体验到被尊重、被理解',
  '孩子有好想法马上响应',
  '表达时尽量简洁',
  '说话时先说重点',
  '尽量用孩子明白的话表达',
  '没说明白时，尝试用孩子熟悉的事物举例子、打比方',
  '认同时及时表达欣赏',
  '回应时重述孩子原话或关键词',
  '自己有好想法不着急表达',
  '不懂的地方能向孩子请教',
  '看法不一致很正常，各自保留看法也是共识',
  '不认同时不着急提出，先听、多想想，再提出完善建议',
  '分享时尽量只说确认过的事实、验证过的规律',
  '不断确认与孩子有共识的点' 
];

// 发现场景完整数据
const talentScenes = [
  '玩什么游戏时孩子会不愿意停下来？',
  '干什么的时候孩子经常不专心？',
  '遇到什么时孩子会不由自主的被吸引？',
  '什么情形下孩子会显得很生气？',
  '什么情形下孩子会非常不高兴？',
  '什么情形下孩子会很快高兴起来？',
  '什么情形下孩子会安静很长时间？',
  '什么情形下孩子会接受不想做的事？',
  '没有玩具玩时孩子会做什么？',
  '什么时候孩子会不愿意学习？',
  '什么情形下孩子会发出高兴的笑声？',
  '什么情形下孩子会愿意一个人呆着？',
  '孩子在遇到回答不了的问题时的反应通常是？',
  '孩子在面对什么困难时会自己尝试解决，不会马上求助大人？',
  '孩子不乐意回答哪些方面的问题？',
  '参加什么活动时孩子最开心？',
  '孩子做什么事时最喜欢动脑筋？',
  '做什么事时孩子愿意向大人请教方法？',
  '能让孩子不断发问的是哪些方面的问题？',
  '孩子在追问什么问题时思路最清晰？',
  '学什么的过程中孩子会一直很高兴？',
  '孩子在帮大人做什么事时最有耐心？',
  '什么事能让孩子放下喜欢的玩具主动去做？',
  '什么情况下孩子会愿意与其他小朋友分享最喜欢的玩具？',
  '什么情况下得到奖品孩子最高兴？',
  '不需奖励孩子就能主动去做的事是？',
  '孩子学起来最快最省力的学科是？',
  '孩子看到后觉得很向往的人物或事情是？',
  '孩子喜欢用什么方式获取知识？',
  '孩子聊什么时比平时更愿意表达？',
  '孩子描绘什么时很多细节刻画？',
  '孩子讲述什么时可以大段引用原话？',
  '干什么时孩子会成为小朋友的模仿对象？',
  '孩子相对轻松就能做出好结果的是哪方面的事？',
  '孩子不需教就能掌握得不错的是哪方面的知识？',
  '什么事上孩子总能带领小朋友一起玩？'
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showNotice, setShowNotice] = useState(true);
  const [qrUrl, setQrUrl] = useState('');
  const [polling, setPolling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserInfo(user);
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUserId(0);
    navigate('/login');
  };

  const userMenu = (
    <Menu style={{ minWidth: 'm60px' }}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />} danger>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const handleWechatLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 修改 API 调用方式
      const response = await axios.get(getApiUrl('/wechat/qrcode'));  // 添加前导斜杠
      setQrUrl(response.data.qrUrl);
      
      // 开始轮询登录状态
      const intervalId = setInterval(async () => {
        try {
          const statusRes = await axios.get(getApiUrl(`/wechat/status?qrId=${response.data.qrId}`));  // 添加前导斜杠
          if (statusRes.data.success) {
            clearInterval(intervalId);
            
            // 保存用户信息和token
            const { token, user } = statusRes.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setToken(token);
            setUserId(user.id);
            
            message.success('登录成功');
            navigate('/home');
          }
        } catch (error) {
          console.error('检查登录状态失败:', error);
        }
      }, 2000);

      // 60秒后停止轮询
      setTimeout(() => {
        clearInterval(intervalId);
        setError('二维码已过期，请重新获取');
        setQrUrl('');
      }, 60000);

    } catch (error) {
      console.error('获取二维码失败:', error);
      setError('获取二维码失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUserId(JSON.parse(savedUser).id);
      navigate('/home');
    }
  }, []);

  return (
    <StyledLayout>
      <NavBar>
        <Logo>
          <img 
            src={new URL('/rainbow-watercolor.png', import.meta.url).href}
            alt="彩虹" 
            style={{ 
              width: '40px',
              height: '40px',
              marginRight: '12px',
              objectFit: 'contain',
              filter: 'brightness(1.05)',
            }} 
          />
          发现孩子喜欢与天赋
        
        </Logo>
        {userInfo && (
          <UserInfo>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space>
                <UserAvatar size="large">
                  {userInfo.nickname?.[0] || userInfo.username?.[0] || 'U'}
                </UserAvatar>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text strong style={{ fontSize: '16px', lineHeight: '1.2' }}>
                    {userInfo.nickname || userInfo.username}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {userInfo.role === 'parent' ? '家长' : '用户'}
                  </Text>
                </div>
                <CaretDownOutlined style={{ color: '#666' }} />
              </Space>
            </Dropdown>
          </UserInfo>
        )}
      </NavBar>

      <MainContent>
        <Row gutter={48} align="top">
          <Col span={12}>
            <GrowthStages>
              <Title level={2} style={{ marginBottom: 32, color: '#1890ff' }}>
                🌱 五道杠成长体系
              </Title>
              
              {[
                {
                  stage: '第一阶段',
                  title: '自我觉察（自然探索）',
                  timing: '自然而然时',
                  target: '发现喜欢与天赋',
                  abilities: [
                    '发展自信与自驱',
                    '基础情绪能力：感知兴趣带来的愉悦感',
                    '原始动力：无压力状态下的主动尝试'
                  ]
                },
                {
                  stage: '第二阶段',
                  title: '自我认知（选择培养）',
                  timing: '需要付出努力时', 
                  target: '培养自主选择能力，寻找天赋长项',
                  abilities: [
                    '发展自强与自律',
                    '决策能力：基于兴趣的优先级判断',
                    '延迟满足：为天赋发展承受短期压力'
                  ]
                },
                {
                  stage: '第三阶段',
                  title: '自我突破（能力锻造）',
                  timing: '需要克服困难时',
                  target: '自愿坚持并培养独立思考',
                  abilities: [
                    '发展韧性（抗压+坚持）与思辨',
                    '抗压性：将困难转化为具体可执行步骤',
                    '逻辑验证：用天赋能力反向推导问题本质'
                  ]
                },
                {
                  stage: '第四阶段',
                  title: '自我蜕变（创新实践）',
                  timing: '需要战胜挑战时',
                  target: '自我完善后自主创新',
                  abilities: [
                    '发展系统化（整合+创新）与预见性',
                    '模式重构：将经验模块化',
                    '风险预判：基于天赋评估创新可行性'
                  ]
                },
                {
                  stage: '第五阶段',
                  title: '自我超越（认知升级）',
                  timing: '需要面对挫折时',
                  target: '发现规律并实现认知升维',
                  abilities: [
                    '发展元认知（规律洞察+自我迭代）',
                    '认知升维：建立跨领域迁移框架',
                    '动态校准：用失败数据优化模型'
                  ]
                }
              ].map((phase, index) => (
                <StageCard key={index}>
                  <StageTitle>
                    <SafetyCertificateOutlined />
                    {phase.stage}：{phase.title}
                  </StageTitle>
                  <StageContent>
                    <StageItem>
                      <Text strong>🕒 时机：</Text>
                      {phase.timing}
                    </StageItem>
                    
                    <StageItem>
                      <Text strong>🎯 核心目标：</Text>
                      {phase.target}
                    </StageItem>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <Text strong>🚀 能力提升：</Text>
                      <div style={{ marginTop: 8 }}>
                        {phase.abilities.map((ability, subIndex) => (
                          <StageSubItem key={subIndex}>
                            {subIndex === 0 ? <strong>{ability}</strong> : ability}
                          </StageSubItem>
                        ))}
                      </div>
                    </div>
                  </StageContent>
                </StageCard>
              ))}
            </GrowthStages>
          </Col>

          <Col span={12} style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '100px',
          }}>
            <Space 
              direction="vertical" 
              size="large" 
              align="center" 
              style={{ 
                width: '100%',
                position: 'relative',
                top: 0,
              }}
            >
              {error ? (
                <div style={{ textAlign: 'center' }}>
                  <Text type="danger">{error}</Text>
                  <br />
                  <Button 
                    type="primary" 
                    onClick={() => handleWechatLogin()}
                    style={{ marginTop: '16px' }}
                  >
                    重试
                  </Button>
                </div>
              ) : qrUrl ? (
                <>
                  <div style={{ 
                    width: 280, 
                    height: 280, 
                    border: '1px solid #eee',
                    borderRadius: 8,
                    padding: 20,
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {loading ? (
                      <div style={{ textAlign: 'center' }}>
                        <Spin size="large" />
                        <br />
                        <Text type="secondary" style={{ marginTop: '16px' }}>
                          加载中...
                        </Text>
                      </div>
                    ) : (
                      <img 
                        src={qrUrl} 
                        alt="微信扫码登录" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain' 
                        }} 
                        onError={() => {
                          setError('二维码加载失败');
                          setQrUrl('');
                        }}
                      />
                    )}
                  </div>
                  <Text type="secondary">请使用微信扫码登录</Text>
                </>
              ) : (
                <WechatButton 
                  type="primary" 
                  icon={<WechatOutlined />} 
                  onClick={handleWechatLogin}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? '获取中...' : '获取登录二维码'}
                </WechatButton>
              )}
              
              <Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
                <Text type="secondary">
                  <SafetyCertificateOutlined /> 扫码登录
                </Text>
              </Space>

              <div style={{ width: '100%', marginTop: 40 }}>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Card
                      title={
                        <div style={{ color: '#1890ff' }}>
                          ❤️ 爱的互动指南（16条）
                        </div>
                      }
                      bordered={false}
                    >
                      <div style={{ 
                        paddingRight: '8px',
                      }}>
                        {loveInteractions.map((item, index) => (
                          <InteractionItem key={`love-${index}`}>
                            <Text>▫️ {item}</Text>
                          </InteractionItem>
                        ))}
                      </div>
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card
                      title={
                        <div style={{ color: '#1890ff' }}>
                          🔍 天赋发现场景（36个）
                        </div>
                      }
                      bordered={false}
                    >
                      <ScrollContainer style={{ 
                        height: 400,
                        overflowY: 'auto',
                        paddingRight: '8px',
                      }}>
                        {talentScenes.map((item, index) => (
                          <InteractionItem key={`scene-${index}`}>
                            <Text strong>{index + 1}.</Text> {item}
                          </InteractionItem>
                        ))}
                      </ScrollContainer>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Space>
          </Col>
        </Row>
      </MainContent>
    </StyledLayout>
  );
};

export default LoginPage;