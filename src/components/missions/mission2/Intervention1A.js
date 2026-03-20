// src/components/missions/mission2/Intervention1C.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../../styles/Layout';
import StyledButton from '../../../styles/StyledButton';
import DetectiveTipSmall from '../../shared/DetectiveTipSmall';
import { useUserStats } from '../../../contexts/UserStatsContext';
import { getResponseManager } from '../../../utils/ResponseManager';

// ── Styled Components ─────────────────────────────────────────────────────────

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: ${p => p.theme.CARD_BACKGROUND};
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
`;

const PageTitle = styled.h2`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  text-align: center;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 700;
`;

const PageSubtitle = styled.p`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  text-align: center;
  font-size: 14px;
  margin-bottom: 24px;
`;

const ModuleTitle = styled.h3`
  color: ${p => p.theme.ACCENT_COLOR};
  font-size: 17px;
  font-weight: 700;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid ${p => p.theme.ACCENT_COLOR}44;
`;

const BodyText = styled.p`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 16px;
`;

// ── Accordion ─────────────────────────────────────────────────────────────────

const AccordionWrapper = styled.div`
  border: 1px solid ${p => p.theme.BORDER_COLOR};
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  ${p => p.isOpen && `border-color: ${p.theme.ACCENT_COLOR}66;`}
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: ${p => p.isOpen ? `${p.theme.ACCENT_COLOR}18` : p.theme.SECONDARY_BACKGROUND};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
  gap: 12px;
  &:hover { background: ${p => p.theme.ACCENT_COLOR}18; }
`;

const AccordionTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.isOpen ? p.theme.ACCENT_COLOR : p.theme.PRIMARY_TEXT_COLOR};
  flex: 1;
`;

const AccordionIcon = styled.span`
  font-size: 18px;
  color: ${p => p.theme.ACCENT_COLOR};
  transition: transform 0.2s ease;
  transform: ${p => p.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  min-width: 20px;
  text-align: center;
`;

const RequiredBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${p => p.opened ? p.theme.ACCENT_COLOR : '#ff5c5c'};
  background: ${p => p.opened ? `${p.theme.ACCENT_COLOR}18` : '#ff5c5c18'};
  border: 1px solid ${p => p.opened ? `${p.theme.ACCENT_COLOR}44` : '#ff5c5c44'};
  border-radius: 4px;
  padding: 2px 7px;
  min-width: 70px;
  text-align: center;
`;

const AccordionBody = styled.div`
  padding: ${p => p.isOpen ? '16px' : '0 16px'};
  max-height: ${p => p.isOpen ? '2000px' : '0'};
  overflow: hidden;
  transition: all 0.35s ease;
  background: ${p => p.theme.CARD_BACKGROUND};
`;

// ── LocalList & LocalNestedList ───────────────────────────────────────────────

const LocalList = styled.ol`
  padding-left: 20px;
  margin: 8px 0 8px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LocalListItem = styled.li`
  font-size: 15px;
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  line-height: 1.7;
`;

const LocalNestedList = styled.ol`
  list-style-type: lower-alpha;
  padding-left: 20px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LocalNestedItem = styled.li`
  font-size: 14px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  line-height: 1.6;
`;

const ItemLabel = styled.strong`
  color: ${p => p.theme.PRIMARY_TEXT_COLOR};
  display: block;
  margin-bottom: 2px;
`;

const ItemDesc = styled.span`
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-size: 14px;
`;

// ── Banner (zvýraznený blok) ──────────────────────────────────────────────────



// ── Progress ──────────────────────────────────────────────────────────────────

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 6px;
  background: ${p => p.theme.BORDER_COLOR};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.pct}%;
  background: linear-gradient(to right, ${p => p.theme.ACCENT_COLOR}, ${p => p.theme.ACCENT_COLOR_2});
  transition: width 0.4s ease;
`;

const ProgressLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${p => p.theme.ACCENT_COLOR};
  white-space: nowrap;
`;



const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const RequiredNote = styled.p`
  text-align: center;
  font-size: 13px;
  color: #ff5c5c;
  margin-top: 12px;
  font-weight: 500;
`;

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — Accordion sekcie
// ═══════════════════════════════════════════════════════════════════════════════

// PAGE 1 — Modul 1 (Konšpiračné presvedčenia)
const MODULE1_ACCORDIONS = [
  {
    id: 'kp_co',
    title: 'Čo je to vlastne konšpiračné presvedčenie?',
    content: (
      <>
        <BodyText>
          Je to presvedčenie o tajnom a úmyselnom konaní mocných jednotlivcov a organizácií. Presvedčenie, že nejaká skupina sa snaží manipulovať situácie, udalosti alebo informácie za účelom dosiahnuť svoje skryté ciele.
        </BodyText>
      </>
    )
  },
  {
    id: 'kp_znaky',
    title: 'Aké sú ich spoločné znaky?',
    content: (
      <>
        <BodyText>Konšpiračné presvedčenia sa často vyskytujú v rôznych formách, ale majú niekoľko spoločných znakov. Keď si ich všimnete, viete, že sa pohybujete v území konšpiračných presvedčení:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Údajné tajné sprisahanie</ItemLabel>
            <ItemDesc>Tvrdenie, že určitá skupina — či už vláda, inštitúcie, médiá alebo špecifická skupina ľudí — tajne a úmyselne koná.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>„Dôkazy" podporujúce presvedčenie</ItemLabel>
            <ItemDesc>Selektívne vybraté informácie, ktoré sa interpretujú ako „dôkaz". Protichodné alebo faktické dôkazy sa ignorujú alebo vyvrátia.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Falošné tvrdenia</ItemLabel>
            <ItemDesc>Dezinformácie alebo čiastočné pravdy prezentované ako fakty.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Rozdelenie sveta na dobro a zlo</ItemLabel>
            <ItemDesc>Čiernobiele videnie reality — polarizácia spoločnosti. Tí, čo veria presvedčeniu, sú „osvietení", tí ostatní sú „slepí", „manipulovaní" alebo „hlúpi".</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Obvinenie špecifických skupín ľudí</ItemLabel>
            <ItemDesc>Presvedčenia sú často zamerané na konkrétne etnické, náboženské, sociálne alebo politické skupiny. V mnohých prípadoch sú to menšiny alebo skupiny, ktoré sú už stigmatizované. To môže viesť k diskriminácii alebo násiliu.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  },
  {
    id: 'kp_preco',
    title: 'Prečo sa im darí?',
    content: (
      <>
        <BodyText>Konšpiračné presvedčenia sa často objavujú ako logické vysvetlenie udalostí alebo situácií, ktoré sú ťažko zrozumiteľné, a dodávajú falošný pocit moci a vplyvu:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Hľadanie vzorov a zmyslu</ItemLabel>
            <ItemDesc>Keď sa niečo deje, automaticky hľadáme odpovede na otázku „prečo?" a „kto za tým stojí?". Konšpiračné presvedčenia nám ponúkajú jednoduché odpovede. A jednoduché odpovede sú upokojujúce.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Pocit kontroly a porozumenia</ItemLabel>
            <ItemDesc>Život je chaotický. Veci sa dejú bez toho, aby sme im rozumeli alebo ich mohli kontrolovať. To nás plní úzkosťou. Konšpiračné presvedčenia nám dávajú pocit, že sme niečo pochopili a že máme kontrolu.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Súčasť komunity</ItemLabel>
            <ItemDesc>Keď veríme konšpiračnému presvedčeniu, sme súčasťou skupiny tých, čo vedia. Tí ostatní sú slepí. Cítime sa ako súčasť komunity, ktorá pozná „pravdu".</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  },
  {
    id: 'kp_vznik',
    title: 'Ako vznikajú?',
    content: (
      <>
        <BodyText>Konšpiračné presvedčenia nevznikajú v prázdnote. Vznikajú v špecifických podmienkach:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Udalosť alebo neistota</ItemLabel>
            <ItemDesc>Niečo sa stane, napr. pandémia, politický škandál, ekonomická kríza... alebo jednoducho nerozumieme nejakej udalosti, ktorá sa stala.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Alternatívne vysvetlenie</ItemLabel>
            <ItemDesc>Nejaký jednotlivec alebo skupina vytvorí teóriu, ktorá spája pôvodnú neistotu s konkrétnym vinníkom. Táto teória je jednoduchá, emotívna a dáva „zmysel".</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Komunita a posilnenie</ItemLabel>
            <ItemDesc>Keď sa stretávajú ľudia s rovnakým presvedčením, vzájomne si ho potvrdzujú. Algoritmy sociálnych médií nám ukazujú viac a viac obsahu, ktorý nám potvrdzuje to, čo sledujeme. Presvedčenie sa posilňuje, pretože počujeme to isté opakovane.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  },
  {
    id: 'kp_siria',
    title: 'Prečo ich ľudia šíria?',
    content: (
      <>
        <BodyText>Ľudia konšpiračné presvedčenia šíria z mnohých dôvodov a väčšinou si toho ani neuvedomujú:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Chcú pomôcť</ItemLabel>
            <ItemDesc>Osoba verí, že objavila „pravdu", a chce ju zdieľať s ostatnými. Šírenie presvedčenia môže byť vnímané ako morálna povinnosť.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Chcú byť časťou komunity</ItemLabel>
            <ItemDesc>Keď zdieľajú presvedčenie, sú súčasťou komunity. Dostávajú pozitívnu odozvu od ostatných — lajky, komentáre, pocit spolupatričnosti.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Pocit moci a vplyvu</ItemLabel>
            <ItemDesc>Keď šíria konšpiračné presvedčenie a niekto mu verí, cítia pocit moci a vplyvu.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Strach a úzkosť</ItemLabel>
            <ItemDesc>Keď sa bojím, prirodzene sa chcem deliť s ostatnými o svoje obavy.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Algoritmy a sociálne médiá</ItemLabel>
            <ItemDesc>Algoritmy nám ponúkajú obsah, ktorý nás udržiava online. Čím viac naň reagujem — lajkami, komentovaním a zdieľaním — tým viac ho vidíme všetci. Konšpiračné presvedčenia sú ideálnou „potravou" pre algoritmy.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  },
  {
    id: 'kp_sebareflexia',
    title: 'Sebareflexia — otázky, ktoré ti pomôžu',
    content: (
      <>
        <BodyText>Tieto sebareflektujúce otázky môžu byť užitočným nástrojom nielen pri odhaľovaní konšpiračných presvedčení, ale aj v každodennom živote:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Ako som prišiel k tomuto názoru?</ItemLabel>
            <ItemDesc>Každé presvedčenie má pôvod. Keď si uvedomíte, odkiaľ pochádza vaše presvedčenie, môžete si položiť otázku: je to moje presvedčenie, alebo som ho len prevzal od ostatných?</ItemDesc>
            <LocalNestedList>
              <LocalNestedItem>Kde ste sa prvýkrát s týmto tvrdením stretli alebo kto vám o tom povedal?</LocalNestedItem>
              <LocalNestedItem>Ako dlho ste o tom presvedčený?</LocalNestedItem>
              <LocalNestedItem>Čo vás viedlo k tomu, aby ste tomu uverili v tú dobu?</LocalNestedItem>
              <LocalNestedItem>Skúmali ste to tvrdenie, alebo ste ho len prijali?</LocalNestedItem>
            </LocalNestedList>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Čo ma presvedčilo, že je to pravda?</ItemLabel>
            <ItemDesc>Existuje rozdiel medzi tým, čo vás presvedčilo na základe faktov, a tým, čo vás presvedčilo na základe emócií.</ItemDesc>
            <LocalNestedList>
              <LocalNestedItem>Aké konkrétne dôkazy alebo argumenty vás presvedčili?</LocalNestedItem>
              <LocalNestedItem>Sú to faktické dôkazy (články, štúdie) alebo emócie (strach, hnev, pocit nespravodlivosti)?</LocalNestedItem>
              <LocalNestedItem>Overili ste si tieto dôkazy aj z iných zdrojov?</LocalNestedItem>
              <LocalNestedItem>Pozreli ste sa aj na argumenty, ktoré spochybňujú vaše presvedčenie?</LocalNestedItem>
            </LocalNestedList>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Mám pocit, že existujú aj iné pohľady na túto tému?</ItemLabel>
            <ItemDesc>Každá téma má viacero legitímnych pohľadov.</ItemDesc>
            <LocalNestedList>
              <LocalNestedItem>Poznám ľudí, ktorí majú iný názor na túto tému?</LocalNestedItem>
              <LocalNestedItem>Ako sa cítim, keď s niekým nesúhlasím?</LocalNestedItem>
              <LocalNestedItem>Vidím v inom argumente čokoľvek, čo by malo zmysel? Alebo všetko automaticky odmietam?</LocalNestedItem>
            </LocalNestedList>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Čo by mi pomohlo pochopiť veci z iného uhla pohľadu?</ItemLabel>
            <ItemDesc>Ak si dokážete predstaviť scenár, v ktorom by ste mohli zmeniť názor, je to dobrý signál. Ak nie, je to známka dogmy.</ItemDesc>
            <LocalNestedList>
              <LocalNestedItem>Ako by som sa cítil, keby som mal opačný názor?</LocalNestedItem>
              <LocalNestedItem>Aké dôkazy by ma presvedčili, že sa mýlim?</LocalNestedItem>
              <LocalNestedItem>Čo by som musel vidieť, počuť alebo skúsiť, aby som pochopil iný pohľad?</LocalNestedItem>
              <LocalNestedItem>Bolo v mojej minulosti obdobie, keď som zmenil názor? Čo ma k tomu viedlo?</LocalNestedItem>
              <LocalNestedItem>Bol som vždy presvedčený o tom istom, bez ohľadu na okolnosti?</LocalNestedItem>
            </LocalNestedList>
          </LocalListItem>
        </LocalList>
      </>
    )
  }
];

// PAGE 2 — Modul 2 (Inštitúcie EÚ)
const MODULE2_ACCORDIONS = [
  {
    id: 'eu_institucie',
    title: 'Aké sú inštitúcie EÚ a čo robia?',
    content: (
      <>
        <BodyText>Tieto inštitúcie EÚ sú najkľúčovejšie:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Európsky parlament</ItemLabel>
            <ItemDesc>Priamo volený občanmi, rozhoduje o zákonoch a kontroluje ostatné inštitúcie.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Európska rada</ItemLabel>
            <ItemDesc>Hlavy štátov, určuje strategické smerovanie EÚ.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Rada EÚ</ItemLabel>
            <ItemDesc>Ministri krajín, vyjednávajú a prijímajú zákony spolu s parlamentom.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Európska komisia</ItemLabel>
            <ItemDesc>Výkonná moc, navrhuje zákony a zabezpečuje ich dodržiavanie.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Súdny dvor EÚ</ItemLabel>
            <ItemDesc>Súdna moc, zaručuje rovnaké právo pre všetkých vo všetkých 27 krajinách.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Európska centrálna banka</ItemLabel>
            <ItemDesc>Menová politika, udržiava stabilitu cien a chráni hodnotu eura.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Európsky dvor audítorov</ItemLabel>
            <ItemDesc>Finančná kontrola, kontroluje, či sú peniaze daňovníkov vynakladané správne.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  },
  {
    id: 'eu_transparentnost',
    title: 'Ako EÚ zabezpečuje transparentnosť?',
    content: (
      <>
        <BodyText>Základným znakom dôveryhodnej inštitúcie je, ak sú transparentné a zodpovedné. EÚ má preto nástroje, ktoré zabezpečujú, že inštitúcie nepracujú v skrytosti.</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Právo na prístup k dokumentom EÚ</ItemLabel>
            <ItemDesc>Môže požiadať každý občan EÚ — inštitúcie musia odpovedať do 15 pracovných dní.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Kto má povinnosť byť transparentný?</ItemLabel>
            <ItemDesc>Všetky inštitúcie, orgány, úrady a agentúry EÚ — nielen tri hlavné inštitúcie.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Aké dokumenty možno žiadať?</ItemLabel>
            <ItemDesc>Rôzne typy dokumentov: rozpočty, zápisnice, e-maily, videozáznamy, zoznamy stretnutí a ďalšie.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Proaktívna transparentnosť</ItemLabel>
            <ItemDesc>Verejné online registre dokumentov a legislatívneho postupu, ktoré môžeš sledovať bez akejkoľvek žiadosti.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Priama účasť občanov</ItemLabel>
            <ItemDesc>Môžete podávať petície parlamentu, zúčastniť sa verejných konzultácií a iniciovať Európsku občiansku iniciatívu.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  },
  {
    id: 'eu_pre_vas',
    title: 'Čo EÚ robí pre vás?',
    content: (
      <>
        <BodyText>Dôveryhodné inštitúcie nekonajú len efektívne a transparentne — konajú v záujme ľudí. Pozrite sa na konkrétne výhody, ktoré EÚ zabezpečuje:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Voľný pohyb</ItemLabel>
            <ItemDesc>Môžete študovať, pracovať, žiť alebo odísť do dôchodku kdekoľvek v EÚ bez vízových obmedzení.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Cenová ochrana</ItemLabel>
            <ItemDesc>14-dňová lehota na vrátenie online nákupov, žiadne roamingové poplatky, ochrana bankových vkladov do 100 000 €.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Vzdelávanie</ItemLabel>
            <ItemDesc>Program Erasmus+ a možnosť študovať na akejkoľvek vysokej škole v rámci EÚ.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Životné prostredie</ItemLabel>
            <ItemDesc>Podpora ochrany životného prostredia a právne záväzný cieľ klimatickej neutrality do roku 2050.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Zdravie</ItemLabel>
            <ItemDesc>Európska karta zdravotného poistenia — lekárska starostlivosť v celej EÚ za rovnakých podmienok.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Bezpečnosť</ItemLabel>
            <ItemDesc>Prísne bezpečnostné štandardy pre hračky, potraviny a lieky patria medzi najprísnejšie na svete.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  }
];

// PAGE 3 — Modul 3 (Príspevkový semafor — Bonus)
const MODULE3_ACCORDIONS = [
  {
    id: 'semafor_zaklad',
    title: 'Príspevkový semafor — základné tri otázky',
    content: (
      <>
        <BodyText>Poďme začať so základnými troma otázkami, z ktorých sa každá farba semaforu skladá:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Kto profituje?</ItemLabel>
            <ItemDesc>Keď si čítate príspevok, zastavte sa a spýtajte sa: Kto to napísal? Kto má záujem, aby ste verili konkrétnemu príspevku?</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Odkiaľ to pochádza?</ItemLabel>
            <ItemDesc>Spýtajte sa: Vidím konkrétny zdroj? Meno autora? Organizáciu? Link na článok? Alebo je to len príspevok bez akéhokoľvek predloženia dôkazov?</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Je príspevok bez emócií presvedčivý?</ItemLabel>
            <ItemDesc>Predstavte si príspevok bez výkričníkov, bez veľkých písmen, bez urgencií, bez dramatických fotiek. Zostáva presvedčivý? Alebo sa sila informácie príspevku rozpadá?</ItemDesc>
          </LocalListItem>
        </LocalList>
        <BodyText>Tieto tri otázky spolu fungujú ako detektívny nástroj. Keď si ich položíte, môžete všimnúť zámer tvorcu príspevku.</BodyText>
      </>
    )
  },
  {
    id: 'semafor_cervena',
    title: '🔴 Červená — znaky manipulatívneho príspevku',
    content: (
      <>
        <BodyText>Ak sa tvorca pokúša o manipuláciu, často si môžete všimnúť tieto znaky:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Kto profituje?</ItemLabel>
            <ItemDesc>Autor sa skrýva: účet môže byť anonymný, bez histórie, bez fotky alebo s fotkou, ktorá ho anonymizuje, bez informácií. Čo chce? Vašu pozornosť a vašu emóciu. Ako profituje? Z vášho konania: zdieľania, lajkovania, komentovania — vášho strachu a úzkosti.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Odkiaľ to pochádza?</ItemLabel>
            <ItemDesc>Príspevok môže byť od anonymného autora, bez uvedenia inštitúcie alebo organizácie. Bez konkrétneho zdroja odkiaľ čerpal. Ak autor neuvedie zdroj, poskytne informáciu, ktorú si nikto bez dodatočného úsilia nemôže overiť.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Je príspevok bez emócií presvedčivý?</ItemLabel>
            <ItemDesc>Príspevok je zameraný na emócie: snaží sa vyvolať strach, úzkosť, hnev, vzrušenie alebo šok, pomocou dramatického textu, fotky alebo videa. S výkričníkmi a veľkými písmenami príspevok apeluje na urgenciu („zdieľaj kým to nevymažú!"). Bez emócií v príspevku ostáva iba prázdne tvrdenie: bez faktov, bez zdrojov.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  },
  {
    id: 'semafor_oranzova',
    title: '🟠 Oranžová — znaky neistého príspevku',
    content: (
      <>
        <BodyText>Ako aj na cestách, predtým ako prejdeme na zelenú je dôležité dať si pozor na premávku — v takomto prípade môže ísť o manipulatívny príspevok, ale aj o dôveryhodný. Preto je potrebné si všímať tieto znaky:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Kto profituje?</ItemLabel>
            <ItemDesc>Autor sa čiastočne predstavuje: poznáte meno, inštitúciu alebo organizáciu. Môže sa ale stať, že niektoré informácie chýbajú, nie sú úplné alebo prípadne vymyslené.</ItemDesc>
            <LocalNestedList>
              <LocalNestedItem>Ak autor uvádza meno, ale bez detailov o kvalifikácii — pýtajte sa: Čo ho kvalifikuje na to, aby o tomto hovoril?</LocalNestedItem>
              <LocalNestedItem>Ak autor uvádza inštitúciu, ale bez overenia či naozaj v nej pracuje — pýtajte sa: Dá sa toto overiť?</LocalNestedItem>
              <LocalNestedItem>Ak sa autor rozhodol vynechať informácie — pýtajte sa: Prečo? Je to zámerné?</LocalNestedItem>
            </LocalNestedList>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Odkiaľ to pochádza?</ItemLabel>
            <ItemDesc>Zdroje sú uvedené, ale nie sú úplné — napríklad „podľa štúdie" alebo „americkí vedci zistili" bez presného odkazu.</ItemDesc>
            <LocalNestedList>
              <LocalNestedItem>Sú zdroje zámerne skryté alebo len nedostatočne uvedené? Skúste si vyhľadať originálny zdroj.</LocalNestedItem>
              <LocalNestedItem>Má fotografia/video zmysel v jej pôvodnom kontexte? Pozrite si, aký bol pôvodný kontext.</LocalNestedItem>
              <LocalNestedItem>Bol autor presný? Má text aj iné presné informácie (mená, dátumy, miesta)?</LocalNestedItem>
            </LocalNestedList>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Je príspevok bez emócií presvedčivý?</ItemLabel>
            <ItemDesc>Príspevok má určitú emotívnosť, ale nie extrémnu. Fakty sú tu, ale sú zvýraznené vyberaním — autor si zvolil tie, ktoré podporujú jeho názor.</ItemDesc>
            <LocalNestedList>
              <LocalNestedItem>Chce ma autor informovať alebo presvedčiť?</LocalNestedItem>
              <LocalNestedItem>Dôveryhodný príspevok vám povie fakty, nechá rozhodnutie na vás. Manipulatívny príspevok vám povie „Teraz viete, čo je správne".</LocalNestedItem>
              <LocalNestedItem>Prečo sú emócie práve takéto? Sú mierne, pretože téma je objektívna? Alebo sú mierne, aby bol príspevok ťažšie rozpoznateľný ako manipulatívny?</LocalNestedItem>
            </LocalNestedList>
          </LocalListItem>
        </LocalList>
        <BodyText>Dôveryhodný príspevok bez kontextu môže byť mätúci. Ale keď autor prezentuje nepravdivé alebo čiastočne pravdivé informácie vybrané tak, aby podporili jeho tvrdenie, to je najnebezpečnejšia forma manipulácie, pretože vyzerá ako fakt. Preto neodcudzujte príspevok ihneď, ale ani mu automaticky neverte. Sami si vždy overujte informácie.</BodyText>
      </>
    )
  },
  {
    id: 'semafor_zelena',
    title: '🟢 Zelená — znaky dôveryhodného príspevku',
    content: (
      <>
        <BodyText>Ak sa tvorca pokúša informovať o faktoch, často si môžete všimnúť tieto znaky:</BodyText>
        <LocalList>
          <LocalListItem>
            <ItemLabel>Kto profituje?</ItemLabel>
            <ItemDesc>Autor sa predstavuje — viete, kto je, prípadne v ktorej inštitúcii alebo organizácii pôsobí. V takýchto prípadoch často nejde o profit, ide o predanie informácie alebo vedomostí. Autor chce, aby ste boli informovaní, nie aby ste reagovali.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Odkiaľ to pochádza?</ItemLabel>
            <ItemDesc>Autora vieme identifikovať buď ako ľudskú osobu, inštitúciu alebo organizáciu. Zdroje sú jasne označené, poskytne nám odkazy alebo citácie. Fotografie a videá majú kontext: kedy, kde, kto ich urobil. Môžete si overiť informácie.</ItemDesc>
          </LocalListItem>
          <LocalListItem>
            <ItemLabel>Je príspevok bez emócií presvedčivý?</ItemLabel>
            <ItemDesc>Fakty hovoria samé za seba. Informácie, tvrdenia, čísla a zdroje sú presvedčivé aj v pokojnom, neutrálnom tóne bez urgencií. Autor nemá potrebu dramatizácie — chce, aby ste boli informovaní, nie aby ste reagovali.</ItemDesc>
          </LocalListItem>
        </LocalList>
      </>
    )
  }
];

const PAGES = [
  {
    key: 'page1',
    title: 'Modul 1 — Konšpiračné presvedčenia',
    subtitle: 'Informačné očkovanie',
    accordions: MODULE1_ACCORDIONS,
    detectiveTipIntro: `
      <p><strong>S tvrdeniami, ktoré ste v predošlej časti mohli vidieť, sa pravdepodobne stretávate v bežnom živote každý deň.</strong></p>
      <p>Často sa vyskytujú na sociálnych sieťach v podobe rôznych príspevkov, komentárov, videí... každý môže mať inú formu. Ale všetky majú jednu vec spoločnú: <strong>chcú vás o niečom presvedčiť.</strong></p>
      <p>Konšpiračné presvedčenia hovoria o tom, že tajné skupiny manipulujú udalosti, spoločnosť alebo nám skrývajú „skutočnú pravdu". Ale prečo nám konšpiračné presvedčenia tak ľahko „padnú do siete"? <strong>Nie je to preto, že sme hlúpi</strong> — naše mozgy sú navrhnuté hľadať vzory a zmysel, ale niekedy hľadajú vzory a zmysel aj tam, kde neexistujú.</p>
      <p>Poďme sa spolu pozrieť na to, prečo nám konšpiračné presvedčenia tak ľahko padnú do siete, ako ich identifikovať a ako sa voči nim brániť. <strong>Predtým ako si pozriete odpovede, skúste každú otázku zodpovedať pre seba v myšlienkach. Ste pripravený? Poďme na to!</strong></p>
    `,
    detectiveTipOutro: `
      <p>🎉 <strong>Výborne! Máte za sebou prvú časť tréningu pre začínajúceho detektíva.</strong></p>
      <p>Pokračujeme ďalej!</p>
    `
  },
  {
    key: 'page2',
    title: 'Modul 2 — Inštitúcie EÚ',
    subtitle: 'Budovanie dôvery',
    accordions: MODULE2_ACCORDIONS,
    detectiveTipIntro: `
      <p><strong>Prvú časť máte za sebou, nezabudnite si dať krátku prestávku a potom môžeme pokračovať.</strong></p>
      <p>V prvej časti sme sa zaoberali konšpiračnými presvedčeniami. Teraz sa poďme spolu pozrieť na <strong>inštitúcie EÚ</strong> — čo robia, ako fungujú a čo nám prinášajú.</p>
      <p>Európska únia ovplyvňuje váš každodenný život viac, než si možno uvedomujete. Preto je dôležité vedieť čo robia, ako fungujú ich procesy, čo nám prinášajú a prečo ich môžeme považovať za dôveryhodné. <strong>Oddýchnutý? Poďme na to!</strong></p>
    `,
    detectiveTipOutro: `
      <p>🎉 <strong>Výborne! Máte za sebou druhú časť tréningu pre začínajúceho detektíva.</strong></p>
      <p>Ako ste mohli vidieť, inštitúcie EÚ si zakladajú na kompetentnosti, integrite a starostlivosti o občanov. EÚ nie je dokonalá, ale je postavená na princípoch transparentnosti, demokratickej kontroly a ochrany práv.</p>
      <p>Teraz sa môžete ešte pozrieť na bonus alebo prejsť k záveru tréningu začínajúceho detektíva.</p>
    `
  },
  {
    key: 'page3',
    title: 'Modul 3 — Príspevkový semafor',
    subtitle: 'Bonus',
    accordions: MODULE3_ACCORDIONS,
    detectiveTipIntro: `
      <p><strong>V tomto bonuse sa vrátime kúsok späť.</strong></p>
      <p>V prvej časti sme sa zaoberali konšpiračnými presvedčeniami. Ako som už spomínal, často sa vyskytujú na sociálnych sieťach vo forme rôznych príspevkov, komentárov, videí...</p>
      <p>Naše mozgy sú prirodzene navrhnuté hľadať vzory. To naším predkom zachraňovalo život — tmavé mraky znamenali búrku, pohyb v kríkoch znamenal predátora. Ale náš mozog sa stal tak dobrým v hľadaní vzorov, že ich niekedy vidí aj tam, kde neexistujú. <strong>Obzvlášť na sociálnych sieťach, kde algoritmy ponúkajú obsah navrhnutý tak, aby nás udržal čo najdlhšie online.</strong></p>
      <p>Ukážem vám jednoduchý nástroj — <strong>Príspevkový semafor</strong> — ktorý vám pomôže vidieť sociálne siete úplne inak. Poďme na to!</p>
    `,
    detectiveTipOutro: `
      <p>🎉 <strong>Výborne, zvládli ste to! Tréning máte za sebou.</strong></p>
      <p>Teraz prejdeme v ďalšej časti znovu ku tvrdeniam. Keď ich budeš čítať, skús využiť poznatky, ktoré si nadobudol.</p>
      <p>Hlavne sa nezabudni spýtať seba tieto základné otázky:</p>
      <ul style="text-align: left; padding-left: 8px; list-style: none;">
        <li>🔍 Ako si prišiel/a k tomuto názoru?</li>
        <li>🔍 Čo ťa presvedčilo, že je to pravda?</li>
        <li>🔍 Máš pocit, že existujú aj iné pohľady na túto tému?</li>
        <li>🔍 Čo by ti pomohlo pochopiť veci z iného uhla pohľadu?</li>
      </ul>
    `
  }
];

const TOTAL_PAGES = PAGES.length;
const COMPONENT_ID = 'mission2_intervention_a';

// ═══════════════════════════════════════════════════════════════════════════════
// Accordion komponent
// ═══════════════════════════════════════════════════════════════════════════════

const AccordionItem = ({ item, isOpened, onToggle }) => {
  const isOpen = isOpened;
  return (
    <AccordionWrapper isOpen={isOpen}>
      <AccordionHeader isOpen={isOpen} onClick={onToggle}>
        <AccordionTitle isOpen={isOpen}>{item.title}</AccordionTitle>
        <RequiredBadge opened={isOpened}>
          {isOpened ? '✓ Prečítané' : '! Povinné'}
        </RequiredBadge>
        <AccordionIcon isOpen={isOpen}>▾</AccordionIcon>
      </AccordionHeader>
      <AccordionBody isOpen={isOpen}>
        {item.content}
      </AccordionBody>
    </AccordionWrapper>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Hlavný komponent
// ═══════════════════════════════════════════════════════════════════════════════

const Intervention1A = () => {
  const navigate = useNavigate();
  const { dataManager, userId } = useUserStats();
  const responseManager = getResponseManager(dataManager);

  const [currentPage, setCurrentPage] = useState(0);
  const [openedMap, setOpenedMap] = useState({});   // { accordionId: true }
  const startTime = React.useRef(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutroTip, setShowOutroTip] = useState(false);

  const page = PAGES[currentPage];


  // Guard
  useEffect(() => {
    (async () => {
      const prog = await dataManager.loadUserProgress(userId);
      if (!prog.mission2_unlocked && !dataManager.isAdmin(userId)) {
        navigate('/mainmenu');
      }
    })();
  }, [dataManager, userId, navigate]);

  // Autosave
  useEffect(() => {
    const autoSave = setInterval(async () => {
      const t = Math.floor((Date.now() - startTime.current) / 1000);
      await responseManager.saveAnswer(userId, COMPONENT_ID, 'time_spent_seconds', t, {
        last_autosave: new Date().toISOString(),
        current_page: currentPage
      });
    }, 5000);
    return () => clearInterval(autoSave);
  }, [userId, responseManager, startTime, currentPage]);

  const handleToggle = useCallback((id) => {
    setOpenedMap(prev => ({ ...prev, [id]: true }));
  }, []);

  const allOpenedOnCurrentPage = page.accordions.every(a => openedMap[a.id]);

  const handleNext = async () => {
    if (!allOpenedOnCurrentPage) return;

    setShowOutroTip(true);
  };

  const handleOutroClose = async () => {
    setShowOutroTip(false);

    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Posledná stránka — uložiť a pokračovať
      setIsSubmitting(true);
      try {
        const finalTime = Math.floor((Date.now() - startTime.current) / 1000);
        await responseManager.saveMultipleAnswers(
          userId,
          COMPONENT_ID,
          {
            time_spent_seconds: finalTime,
            intervention_read: true,
            intervention_type: 'trust_building',
            pages_completed: TOTAL_PAGES
          },
          {
            started_at: new Date(startTime.current).toISOString(),
            completed_at: new Date().toISOString(),
            device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
          }
        );
        navigate('/mission2/questionnaire2b');
      } catch (error) {
        console.error('❌ Error saving intervention data:', error);
        alert('Chyba pri ukladaní. Skús to znova.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isLastPage = currentPage === TOTAL_PAGES - 1;

  return (
    <Layout>
      <Container>
        <Card>
          {/* Progress */}
          <ProgressBar>
            <ProgressTrack>
              <ProgressFill pct={((currentPage + 1) / TOTAL_PAGES) * 100} />
            </ProgressTrack>
            <ProgressLabel>{currentPage + 1} / {TOTAL_PAGES}</ProgressLabel>
          </ProgressBar>

          <PageTitle>{page.title}</PageTitle>
          <PageSubtitle>{page.subtitle}</PageSubtitle>



          {/* ── Intro DetectiveTip — vnútri Card, nad accordionmi ── */}
          {!showOutroTip && (
            <DetectiveTipSmall
              key={`intro-${currentPage}`}
              tip={page.detectiveTipIntro}
              detectiveName="Inšpektor Kritan"
              autoOpen={true}
              autoOpenDelay={200}
            />
          )}

          {/* ── Accordiony — skryté keď je outro ── */}
          {!showOutroTip && (
            <>
              <ModuleTitle>
                {currentPage === 0 && '🧠 Konšpiračné presvedčenia'}
                {currentPage === 1 && '🏛️ Inštitúcie EÚ'}
                {currentPage === 2 && '🚦 Príspevkový semafor'}
              </ModuleTitle>

              {page.accordions.map(item => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpened={!!openedMap[item.id]}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}

              {!allOpenedOnCurrentPage && (
                <RequiredNote>
                  ⚠️ Pred pokračovaním rozkliknite všetky sekcie.
                </RequiredNote>
              )}

              <ButtonContainer>
                <StyledButton
                  accent
                  onClick={handleNext}
                  disabled={!allOpenedOnCurrentPage || isSubmitting}
                >
                  {isSubmitting
                    ? 'Ukladám...'
                    : isLastPage
                      ? 'Dokončiť tréning'
                      : 'Pokračovať ďalej →'}
                </StyledButton>
              </ButtonContainer>
            </>
          )}

          {/* ── Outro DetectiveTip — zobrazí sa po kliknutí, nahrádza obsah ── */}
          {showOutroTip && (
            <>
              <DetectiveTipSmall
                key={`outro-${currentPage}`}
                tip={page.detectiveTipOutro}
                detectiveName="Inšpektor Kritan"
                autoOpen={true}
                autoOpenDelay={100}
              />
              <ButtonContainer>
                <StyledButton
                  accent
                  onClick={handleOutroClose}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Ukladám...'
                    : isLastPage
                      ? '🎓 Dokončiť tréning!'
                      : 'Pokračovať ďalej →'}
                </StyledButton>
              </ButtonContainer>
            </>
          )}

        </Card>
      </Container>
    </Layout>
  );

};

export default Intervention1A;
