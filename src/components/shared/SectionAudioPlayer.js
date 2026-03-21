// src/components/shared/SectionAudioPlayer.js

import React, { useState, useRef, useEffect } from 'react';
import styled                                  from 'styled-components';

// ── Styled Components ─────────────────────────────────────────────────────────

const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 14px 0;
  background: ${p => p.theme.ACCENT_COLOR}11;
  border: 1px solid ${p => p.$played ? p.theme.ACCENT_COLOR + '88' : p.theme.ACCENT_COLOR + '33'};
  border-radius: 12px;
  padding: 10px 16px;
  transition: border-color 0.3s ease;
`;

const PlayButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${p => p.$playing ? p.theme.ACCENT_COLOR : p.theme.ACCENT_COLOR + 'cc'};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.1s ease;

  &:hover  { background: ${p => p.theme.ACCENT_COLOR}; transform: scale(1.08); }
  &:active { transform: scale(0.95); }
  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
`;

const TrackLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.theme.ACCENT_COLOR};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlayedBadge = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  background: ${p => p.theme.ACCENT_COLOR}22;
  border-radius: 4px;
  padding: 1px 7px;
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    ${p => p.theme.ACCENT_COLOR} ${p => p.$pct}%,
    ${p => p.theme.BORDER_COLOR} ${p => p.$pct}%
  );
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${p => p.theme.ACCENT_COLOR};
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${p => p.theme.ACCENT_COLOR};
    cursor: pointer;
    border: none;
  }
`;

const TimeLabel = styled.span`
  font-size: 13px;
  color: ${p => p.theme.SECONDARY_TEXT_COLOR};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const SpeedButton = styled.button`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.ACCENT_COLOR};
  background: ${p => p.theme.ACCENT_COLOR}18;
  border: 1px solid ${p => p.theme.ACCENT_COLOR}44;
  border-radius: 4px;
  padding: 2px 7px;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
  &:hover { background: ${p => p.theme.ACCENT_COLOR}30; }
`;

const ErrorText = styled.span`
  font-size: 15px;
  color: #ef4444;
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatTime = (s) => {
  if (isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const SPEEDS         = [1, 1.25, 1.5, 2];
const LISTEN_THRESHOLD = 0.8;
const LISTEN_MIN_SEC   = 5;

// ── Komponent ─────────────────────────────────────────────────────────────────

/**
 * SectionAudioPlayer
 *
 * Props:
 *   src       {string}  URL / cesta k audio súboru
 *   label     {string}  Popis nahrávky
 *   audioId   {string}  Jedinečné ID nahrávky, napr. "p1_s1_audio"
 *   played    {boolean} Či respondent už nahrávku počúval (zo záznamu)
 *   onPlayed  {func}    Callback(audioId) — zavolá sa raz keď splní prah počúvania
 *   onPlay    {func}    Callback pri každom spustení (optional)
 */
const SectionAudioPlayer = ({
  src,
  label     = 'Prehrať nahrávku',
  audioId,
  played    = false,
  onPlayed,
  onPlay,
}) => {
  const audioRef       = useRef(null);
  const playedFiredRef = useRef(played);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration,  setDuration]  = useState(0);
  const [current,   setCurrent]   = useState(0);
  const [speedIdx,  setSpeedIdx]  = useState(0);
  const [error,     setError]     = useState(false);
  const [loading,   setLoading]   = useState(false);

  // Sync ak parent zmení `played`
  useEffect(() => {
    playedFiredRef.current = played;
  }, [played]);

  // Reset pri zmene src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrent(0);
    setDuration(0);
    setError(false);
    setLoading(false);
  }, [src]);

  // Cleanup
  useEffect(() => () => audioRef.current?.pause(), []);

  const checkThreshold = (currentTime, dur) => {
    if (playedFiredRef.current) return;
    if (!dur || dur <= 0) return;
    if ((currentTime / dur) >= LISTEN_THRESHOLD || currentTime >= LISTEN_MIN_SEC) {
      playedFiredRef.current = true;
      onPlayed?.(audioId);
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setLoading(true);
      audio.play()
        .then(() => { setIsPlaying(true); setLoading(false); onPlay?.(); })
        .catch(() => { setError(true); setLoading(false); });
    }
  };

  const handleTimeUpdate    = () => {
    const t = audioRef.current?.currentTime ?? 0;
    setCurrent(t);
    checkThreshold(t, duration);
  };

  const handleLoadedMetadata = () => setDuration(audioRef.current?.duration ?? 0);

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrent(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
    if (!playedFiredRef.current) {
      playedFiredRef.current = true;
      onPlayed?.(audioId);
    }
  };

  const handleError = () => { setError(true); setIsPlaying(false); setLoading(false); };

  const handleSeek  = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrent(val);
  };

  const handleSpeedCycle = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <PlayerWrapper $played={played}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      <PlayButton
        type="button"
        $playing={isPlaying ? 1 : 0}
        onClick={handlePlayPause}
        disabled={loading || error}
        title={isPlaying ? 'Pozastaviť' : label}
        aria-label={isPlaying ? 'Pozastaviť' : label}
      >
        {loading ? '…' : isPlaying ? '⏸' : '▶'}
      </PlayButton>

      <TrackInfo>
        <TrackLabel>
          {error
            ? <ErrorText>Súbor sa nedá načítať</ErrorText>
            : <>{label}{played && <PlayedBadge>✓ Vypočuté</PlayedBadge>}</>
          }
        </TrackLabel>

        {!error && (
          <TimeRow>
            <ProgressSlider
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              $pct={pct}
              onChange={handleSeek}
              aria-label="Pozícia prehrávania"
            />
            <TimeLabel>{formatTime(current)} / {formatTime(duration)}</TimeLabel>
            <SpeedButton type="button" onClick={handleSpeedCycle} title="Zmeniť rýchlosť">
              {SPEEDS[speedIdx]}×
            </SpeedButton>
          </TimeRow>
        )}
      </TrackInfo>
    </PlayerWrapper>
  );
};

export default SectionAudioPlayer;
