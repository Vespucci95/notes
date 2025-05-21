import * as React from 'react'
import { motion, SpringOptions, useScroll, useSpring, useTransform } from 'framer-motion';
import { Animated } from '@/components/animated';
import { HeadingInfo } from '@/__generated__/gatsby-types';

type Props = {
  toc: HeadingInfo[];
  minStrokeWidth?: number; // 최소 선 길이
  maxStrokeWidth?: number; // 최대 선 길이
  strokeHeight?: number;
  backgroundColor?: string;
  progressColor?: string;
  className?: string;
  gap?: number;
}

const springOptions: SpringOptions = {
  stiffness: 80,
  damping: 45,
  mass: 1.5,
  velocity: 0.2,
  bounce: 0
};

const ScrollProgress = (
  {
    toc,
    minStrokeWidth = 35,
    maxStrokeWidth = 50,
    strokeHeight = 4
  }: Props) => {
  const { scrollYProgress } = useScroll();

  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const progressPerSection = 1 / toc.length;
  const contentLengthList = toc.map(a => a.contentLength);
  const [minLength, maxLength] = [Math.max, Math.min].map(f => f(...contentLengthList))

  const percentageSpring = useSpring(percentage, springOptions)
  const scrollYSpring = useSpring(scrollYProgress, springOptions)

  const calcProgressWidth = (value: number, minLength: number, maxLength: number) => {
    // 현재 값을 0 기준으로 정규화
    const min = value - minLength;
    // 콘텐츠 길이의 전체 범위
    const max = maxLength - minLength;
    // 선 굵기의 전체 범위
    const strokeWidthRange = maxStrokeWidth - minStrokeWidth;
    // 비율 계산 (0~1 사이의 값)
    const ratio = min / max;
    // 비율에 따른 실제 변화량
    const widthChange = ratio * strokeWidthRange;
    // 최종 선 굵기 계산
    const normalizedValue = maxStrokeWidth - widthChange;
    return Math.round(normalizedValue);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      gap: '8px'
    }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
          gap: '8px'
        }}
      >
        {
          toc.map((section, index) => (
            <Animated.ProgressBar
              key={`${section.id}-${index}`}
              width={calcProgressWidth(section.contentLength, minLength, maxLength)}
              height={strokeHeight}
              percentage={useTransform(
                scrollYSpring,
                [index * progressPerSection, (index + 1) * progressPerSection],
                [0, 100]
              )}
            />
          ))
        }
      </div>
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Animated.ProgressCircle value={percentageSpring} />
        <div className="no-drag" style={{ display: 'flex', fontSize: '0.8rem', width: '36px', fontWeight: 'bold', color: '#FFF' }}>
          <Animated.Number value={percentageSpring} />%
        </div>
      </motion.div>
    </div>
  )
}

export default ScrollProgress