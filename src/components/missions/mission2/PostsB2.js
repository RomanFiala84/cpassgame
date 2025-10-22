// src/components/missions/mission2/PostsB2.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

// Použiť rovnaké styled komponenty ako PostsA2
const Container = styled.div`
  padding: 20px;
  max-width: 935px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: ${p => p.hasError ? `2px solid ${p.theme.ACCENT_COLOR_2}` : `1px solid ${p.theme.BORDER_COLOR}`};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid ${p => p.theme.BORDER_COLOR};
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${p => p.theme.CARD_BACKGROUND};
  }
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
`;

const PostContent = styled.div`
  padding: 16px;
`;

const ContentText = styled.p`
  line-height: 1.5;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 14px;
  margin-bottom: 16px;
`;

const RatingSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${p => p.theme.BORDER_COLOR};
`;

const RatingLabel = styled.div`
  font-size: 12px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RatingScale = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const RatingButton = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.checked ? p.theme.ACCENT_COLOR : 'transparent'};
  color: ${p => p.checked ? '#FFFFFF' : p.theme.PRIMARY_TEXT_COLOR};
  font-weight: 600;
  font-size: 14px;
  
  &:hover {
    background: ${p => p.checked ? p.theme.ACCENT_COLOR : p.theme.HOVER_OVERLAY};
  }
  
  input {
    display: none;
  }
`;

const ErrorText = styled.div`
  color: ${p => p.theme.ACCENT_COLOR_2};
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const mockPostsB2 = [
  { id: 1, username: 'user_m2_b1', content: 'Mission 2 Post B2-1.' },
  { id: 2, username: 'user_m2_b2', content: 'Mission 2 Post B2-2.' },
  { id: 3, username: 'user_m2_b3', content: 'Mission 2 Post B2-3.' }
];

const PostsB2 = () => {
  const navigate = useNavigate();
  const { dataManager, userId, addPoints } = useUserStats();
  const [ratings, setRatings] = useState({});
  const [errors, setErrors] = useState({});
  const refs = useRef({});

  useEffect(() => {
    (async () => {
      if (userId) {
        const progress = await dataManager.loadUserProgress(userId);
        const saved = (progress && progress['postsB2_data']) || {};
        setRatings(saved);
      }
    })();
  }, [userId, dataManager]);

  const handleRating = (id, value) => {
    setRatings(r => ({ ...r, [id]: value }));
    setErrors(e => { const copy = { ...e }; delete copy[id]; return copy; });
    
    (async () => {
      const progress = await dataManager.loadUserProgress(userId);
      const cur = (progress && progress['postsB2_data']) || {};
      cur[id] = value;
      cur.timestamp = new Date().toISOString();
      progress['postsB2_data'] = cur;
      await dataManager.saveProgress(userId, progress);
    })();
  };

  const handleContinue = async () => {
    const missing = mockPostsB2.map(p => p.id).filter(id => !ratings[id]);
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map(id => [id, true])));
      refs.current[missing]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    await addPoints(15, 'postsB2');
    navigate('/mission2/questionnaire2b');
  };

  return (
    <Layout>
      <Container>
        <Title>Hodnotenie príspevkov B - Misia 2</Title>
        <PostsGrid>
          {mockPostsB2.map(post => (
            <PostCard 
              key={post.id} 
              ref={el => refs.current[post.id] = el} 
              hasError={errors[post.id]}
            >
              <PostHeader>
                <Avatar />
                <Username>{post.username}</Username>
              </PostHeader>
              
              <PostContent>
                <ContentText>{post.content}</ContentText>
                
                <RatingSection>
                  <RatingLabel>Ohodnotiť príspevok</RatingLabel>
                  <RatingScale>
                    {[1, 2, 3, 4, 5].map(v => (
                      <RatingButton key={v} checked={ratings[post.id] === v}>
                        <input
                          type="radio"
                          checked={ratings[post.id] === v}
                          onChange={() => handleRating(post.id, v)}
                        />
                        {v}
                      </RatingButton>
                    ))}
                  </RatingScale>
                  {errors[post.id] && <ErrorText>Prosím označte rating.</ErrorText>}
                </RatingSection>
              </PostContent>
            </PostCard>
          ))}
        </PostsGrid>
        
        <ButtonContainer>
          <StyledButton accent onClick={handleContinue}>
            Pokračovať
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Layout>
  );
};

export default PostsB2;
