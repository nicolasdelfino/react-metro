/*
* React Metro 
* www.github.com/nicolasdelfino
*/
import React from 'react'
import MetroHoc from './MetroHoc'
import MetroAnimations from './MetroAnimations'

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

/*
* metroContainer
* Single node enhancer
*/
const metroContainer = (
  component,
  defaultAnimationOverride = null,
  props = {}
) => {
  const baseAnimation = defaultAnimationOverride || defaultAnimation
  const animation = {
    ...baseAnimation
  }

  const containerData = {
    ...animation,
    key: 0,
    itemIndex: 0,
    sequence: [{ ...animation }]
  }

  return (
    <Metro.animation {...containerData} {...props}>
      {component}
    </Metro.animation>
  )
}

/*
* metroBindContainer
* Binds a conditional statement to a Metro.container
*/
const metroBindContainer = (conditional, component, anim, props = {}) =>
  conditional ? Metro.container(component, anim, props) : null

const combineAnimations = (base, animation) => {
  if (!animation) {
    return base
  }
  return {
    out: { ...base.out, ...animation.out },
    in: { ...base.in, ...animation.in },
    willEnter: {
      from: {
        ...(base.willEnter && base.willEnter.from),
        ...(animation.willEnter && animation.willEnter.from)
      },
      to: {
        ...(base.willEnter && base.willEnter.to),
        ...(animation.willEnter && animation.willEnter.to)
      }
    },
    willLeave: {
      from: {
        ...(base.willLeave && base.willLeave.from),
        ...(animation.willLeave && animation.willLeave.from)
      },
      to: {
        ...(base.willLeave && base.willLeave.to),
        ...(animation.willLeave && animation.willLeave.to)
      }
    }
  }
}

/*
* metroSequence
* Enhances an array of data to a Metro sequence with animation data
*/
const metroSequence = (
  dataArray,
  animationMap = [],
  defaultAnimationOverride = null
) => {
  const baseAnimation = {
    animation: defaultAnimationOverride
      ? combineAnimations(
        defaultAnimation.animation,
        defaultAnimationOverride.animation
      )
      : defaultAnimation.animation
  }
  const sequence = dataArray.map((data, i) => {
    const combAnim = combineAnimations(baseAnimation.animation, animationMap[i])
    const settings = {
      ...baseAnimation,
      animation: combAnim
    }
    return {
      ...settings,
      content: data
    }
  })

  return sequence.map((data, index) => ({
    key: index,
    itemIndex: index,
    ...data,
    sequence
  }))
}

/*
* metroAnimation
* HOC, uses MetroTween for animating components on enter / leave
*/
const metroAnimation = MetroHoc(
  /* eslint-disable */
  class extends React.Component {
    render() {
      return (
        <div
          onClick={() => {
            const animating = this.props.sequence.some(s => s.animating)
            if (
              this.props.onClick &&
              (!animating || this.props.enableClickDuringAnimation)
            ) {
              this.props.onClick(
                this.props.content,
                this.props.itemIndex,
                animating
              )
            }
          }}
        >
          {this.props.children}
        </div>
      )
    }
  }
)

// generateFocusAnimationMap
// focusIndex - array based (starts at 0)
// presets:
// -> domino: dominoForwards, dominoBackwards, dominoMulti
// -> delayedVertical
const generateFocusAnimationMap = (
  focusIndex = null,
  cols,
  totalItems,
  animationType = 'dominoForwards',
  duration = 1
) => {
  /* eslint-disable */
  // columns / rows for more advanced types of presets
  const rows = Math.ceil(totalItems / cols)
  // default time and delay per item based on the total duration
  const defaultItemTime = duration * 0.75 / totalItems
  const delayTime = defaultItemTime + duration * 0.25 / totalItems

  const presetSettings = [focusIndex, totalItems, defaultItemTime, delayTime]

  // match animationType
  if (animationType.includes('domino')) {
    const type = animationType.split('domino')[1].toLowerCase()
    return MetroAnimations.domino(type, ...presetSettings)
  } else if (animationType.includes('delayed')) {
    const type = animationType.split('delayed')[1].toLowerCase()
    return MetroAnimations.delayedVertical(type, ...presetSettings)
  } else {
    // no map found
    return []
  }
  /* eslint-enable */
}

const Metro = {
  sequence: metroSequence,
  animation: metroAnimation,
  container: metroContainer,
  bindContainer: metroBindContainer,
  generateFocusMap: generateFocusAnimationMap
}

export default Metro
