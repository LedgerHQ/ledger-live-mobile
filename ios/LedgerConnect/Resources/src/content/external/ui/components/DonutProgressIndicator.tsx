import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

interface DonutProgressIndicatorProps {
  timeInMS: number;
}

const Container = styled.div`
  display: grid;
  height: 132px;
  text-align: center;
  place-items: center;
`;

const Indicator = styled.div`
  height: 66px;
  width: 66px;
  position: relative;
  transform: scale(2);
  margin: auto;
`;

const InnerCircle = styled.div`
  position: absolute;
  z-index: 6;
  top: 50%;
  left: 50%;
  height: 52.8px;
  width: 52.8px;
  margin: -26.4px 0 0 -26.4px;
  background: #00000d;
  border-radius: 100%;
`;

const ProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  font-size: 24px;
  font-weight: 500;
  color: #ffffff;
`;

const Circle = styled.div``;

const Bar = styled.div<{ right?: boolean }>`
  position: absolute;
  height: 100%;
  width: 100%;
  background: #191340;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  clip: rect(0px, 66px, 66px, 33px);

  ${(props) =>
    props.right &&
    css`
      transform: rotate(180deg);
      z-index: 3;
    `}
`;

const left = keyframes`
  100% {
    /* 95% */
    transform: rotate(162deg);
  }
`;

const right = keyframes`
  100% {
    transform: rotate(180deg);
  }
`;

const Progress = styled.div<{ right?: boolean; timeInMS: number }>`
  position: absolute;
  height: 100%;
  width: 100%;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  clip: rect(0px, 33px, 66px, 0px);
  background: #7d70eb;

  ${(props) => {
    const halfTimeInSeconds = props.timeInMS / 1000 / 2;
    const timeFor95PercentInSeconds = (props.timeInMS / 1000) * 0.95 - halfTimeInSeconds;
    return props.right
      ? css`
          animation: ${left} ${timeFor95PercentInSeconds}s linear both;
          animation-delay: ${halfTimeInSeconds}s;
        `
      : css`
          z-index: 1;
          animation: ${right} ${halfTimeInSeconds}s linear both;
        `;
  }}
`;

export function DonutProgressIndicator({ timeInMS }: DonutProgressIndicatorProps): JSX.Element {
  const [progressCount, setProgressCount] = useState(0);

  useEffect(() => {
    let counter = 0;
    const intervalID = setInterval(() => {
      if (counter === 95) {
        clearInterval();
      } else {
        counter += 1;
        setProgressCount(counter);
      }
    }, timeInMS / 100);
    return () => clearInterval(intervalID);
  }, [timeInMS]);

  return (
    <Container>
      <Indicator>
        <InnerCircle />
        <ProgressLabel>{progressCount}%</ProgressLabel>
        <Circle>
          <Bar right>
            <Progress timeInMS={timeInMS} right />
          </Bar>
          <Bar>
            <Progress timeInMS={timeInMS} />
          </Bar>
        </Circle>
      </Indicator>
    </Container>
  );
}
