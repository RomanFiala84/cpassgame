import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import { useUserStats } from '../../../contexts/UserStatsContext';

const C=styled.div`padding:40px;text-align:center;`;
const Title=styled.h2`color:${p=>p.theme.ACCENT_COLOR};margin-bottom:20px;`;
const Text=styled.p`color:${p=>p.theme.SECONDARY_TEXT_COLOR};margin-bottom:30px;`;

const OutroMission3=()=>{
  const nav=useNavigate();
  const { dataManager,userId,addPoints}=useUserStats();

  useEffect(()=>{
    (async()=>{
      const prog=await dataManager.loadUserProgress(userId);
      prog.mission3_completed=true;
      prog.mission3_timestamp_end=new Date().toISOString();
      await dataManager.saveProgress(userId,prog);
      await addPoints(5,'mission3_outro');
    })();
  },[dataManager,userId,addPoints]);

  return (
    <Layout>
      <C>
        <Title>Debriefing dokončený</Title>
        <Text>Ďakujeme za ukončenie Misie 3.</Text>
        <StyledButton accent onClick={()=>nav('/mainmenu')}>Hlavné menu</StyledButton>
      </C>
    </Layout>
  );
};

export default OutroMission3;
