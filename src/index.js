// REACT METRO - Nicolas Delfino
// www.github.com/nicolasdelfino

import React from 'react'
import MetroHoc from './MetroHoc'

const defaultAnimation = {
  animation: {
    out: {
      time: 0.4,
      delay: 0
    },
    in: {
      time: 0.4,
      delay: 0
    },
    willEnter: {
      from: { opacity: 0 },
      to: { opacity: 1, ease: 'easeInOut' }
    },
    willLeave: {
      from: {
        opacity: 1
      },
      to: {
        opacity: 0
      }
    }
  }
}

// metroSequence
// enhances an array of data to a Metro sequence with animation data
const metroSequence = (
  dataArray,
  animationMap,
  defaultAnimationOverride = null
) => {
  const baseAnimation = defaultAnimationOverride || defaultAnimation
  const sequence = dataArray.map((data, i) => {
    const settings = {
      ...baseAnimation,
      animation: { ...baseAnimation.animation, ...animationMap[i] }
    }
    return {
      props: {
        ...settings,
        content: data
      }
    }
  })

  return sequence.map(data => ({
    ...data,
    sequence
  }))
}

// metroAnimation
// HOC, uses greensock TweenMax for animation
const metroAnimation = MetroHoc(
  () => ({ content, index, children, clickHandler }) => (
    // eslint-disable-next-line
    <div role='presentation' onClick={() => clickHandler(content, index)}>{children}</div>
  )
)

const Metro = {
  sequence: metroSequence,
  animation: metroAnimation
}

export default Metro
