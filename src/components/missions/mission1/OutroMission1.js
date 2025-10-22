import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import {useUserStats} from '../../../contexts/UserStatsContext';

const C=styled.div`padding:40px;text-align:center;`;
const T=styled.h2`color:${p=>p.theme.ACCENT_COLOR};margin-bottom:20px;`;
const P=styled.p`color:${p=>p.theme.SECONDARY_TEXT_COLOR};margin-bottom:30px;`;

const OutroMission1=()=>{
  const nav=useNavigate();
  const{dataManager,userId,addPoints}=useUserStats();

  useEffect(()=>{(async()=>{const p=await dataManager.loadUserProgress(userId);p.mission1_completed=true;p.mission1_timestamp_end=new Date().toISOString();await dataManager.saveProgress(userId,p);await addPoints(5,'mission1_outro');})()},[dataManager,userId,addPoints]);

  return(
    <Layout>
      <C>
        <T>Debriefing dokončený</T>
        <P>Ďakujeme za vašu účasť na Misiu 1!</P>
        <StyledButton accent onClick={()=>nav('/mainmenu')}>Hlavné menu</StyledButton>
      </C>
    </Layout>
  );
};

export default OutroMission1;
