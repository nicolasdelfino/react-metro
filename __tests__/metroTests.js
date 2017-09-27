import React from 'react'
import Metro from '../src/index'

describe('sequence api', () => {
  const testArr = [{ name: 'dog' }, { name: 'cat' }]

  it('transforms an array to a Metro sequence', () => {
    const sequence = Metro.sequence(testArr, [])
    expect(sequence[0].content.name).toBe(testArr[0].name)
  })

  it('uses the default animation settings', () => {
    const sequence = Metro.sequence(testArr, [])

    const defaultAnimation = {
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

    expect(sequence[0].animation).toEqual(defaultAnimation)
  })

  it('accepts and overrides default animation settings', () => {
    const defaultAnimationOverrideBase = {
      out: {
        time: 0.5,
        delay: 0
      },
      in: {
        time: 1,
        delay: 0
      },
      willEnter: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, ease: 'easeInOutQuad' }
      },
      willLeave: {
        from: {
          opacity: 1,
          y: 0
        },
        to: { opacity: 0, y: 50, ease: 'easeInOutQuad' }
      }
    }

    const defaultAnimationOverride = {
      animation: { ...defaultAnimationOverrideBase }
    }

    const sequence = Metro.sequence(testArr, [], defaultAnimationOverride)
    expect(sequence[0].animation).toEqual(defaultAnimationOverrideBase)
  })

  it('overrides default animation per array item though a custom animationmMap', () => {
    const dogMap = {
      in: {
        time: 3,
        delay: 0
      },
      out: {
        time: 1.4,
        delay: 1
      },
      willEnter: {
        from: { opacity: 0, y: 120, x: 30 },
        to: { opacity: 1, y: 0, x: 0, ease: 'easeInOutElastic' }
      }
    }

    const catMap = {
      out: {
        time: 1.4,
        delay: 0
      },
      willEnter: {
        from: { opacity: 0, y: 120, x: -30 },
        to: { opacity: 1, y: 0, x: 0, ease: 'easeInOutElastic' }
      }
    }

    const animationMap = [
      {
        ...dogMap
      },
      {
        ...catMap
      }
    ]
    const sequence = Metro.sequence(testArr, animationMap)

    // dog map
    expect(sequence[0].animation.in).toEqual(dogMap.in)
    expect(sequence[0].animation.out).toEqual(dogMap.out)
    expect(sequence[0].animation.willEnter).toEqual(dogMap.willEnter)
    // cat map
    expect(sequence[1].animation.out).toEqual(catMap.out)
    expect(sequence[1].animation.willEnter).toEqual(catMap.willEnter)
  })
})
