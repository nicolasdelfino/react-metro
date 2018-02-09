/*
* React Metro - MetroAnimations
* Preconfigured animations 
*/

/*
* Metro.delayedVertical
*/
const delayedVerticalPreset = (
  type,
  focusIndex,
  totalItems,
  defaultItemTime,
  delayTime
) => {
  const map = []

  const delayedVerticalWillEnter = {
    willEnter: {
      from: {
        opacity: 0,
        y: 50
      },
      to: {
        opacity: 1,
        y: 0
      }
    }
  }

  const delayedVerticalWillLeave = {
    willLeave: {
      from: {
        opacity: 1,
        y: 0
      },
      to: {
        opacity: 0,
        y: 50
      }
    }
  }

  for (let i = 0; i < totalItems; i++) {
    map.push({
      in: {
        time: defaultItemTime,
        delay: i * delayTime
      },
      out: {
        time: defaultItemTime,
        delay: i * delayTime
      },
      ...delayedVerticalWillLeave,
      ...delayedVerticalWillEnter
    })
  }

  if (focusIndex) {
    // set focusIndex item to first in animation
    map.splice(focusIndex, 0, {
      in: {
        time: defaultItemTime,
        delay: 0
      },
      out: {
        time: defaultItemTime,
        delay: 0
      },
      ...delayedVerticalWillLeave,
      ...delayedVerticalWillEnter
    })
  }

  return map
}

/*
* Metro.domino, requires a focusIndex
*/
const dominoPreset = (type, focus, totalItems, defaultItemTime, delayTime) => {
  const focusIndex = focus || 0
  const map = []
  let end = 0
  let post = 1
  // domino: focusIndex marks the start of the animation, then goes full circle
  const dominoWillLeave = {
    willLeave: {
      from: {
        opacity: 1,
        skewX: '0deg',
        y: 0
      },
      to: {
        opacity: 0,
        skewX: '-10deg',
        y: 20
      }
    }
  }

  const dominoWillEnter = {
    willEnter: {
      from: {
        opacity: 0,
        skewX: '-10deg',
        y: 20
      },
      to: {
        opacity: 1,
        skewX: '0deg',
        y: 0
      }
    }
  }

  if (type === 'multi') {
    let back = focusIndex
    for (let i = focusIndex; i > 0; i--) {
      map.push({
        in: {
          time: defaultItemTime * 2,
          delay: delayTime * back * 2
        },
        out: {
          time: defaultItemTime * 2,
          delay: delayTime * back * 2
        },
        ...dominoWillLeave,
        ...dominoWillEnter
      })
      back -= 1
    }
    for (let i = focusIndex + 1; i < totalItems; i++) {
      map.push({
        in: {
          time: defaultItemTime * 2,
          delay: delayTime * end * 2
        },
        out: {
          time: defaultItemTime * 2,
          delay: delayTime * end * 2
        },
        ...dominoWillLeave,
        ...dominoWillEnter
      })
      end += 1
    }
  }
  else if (type === 'backwards') {
    let back = focusIndex
    for (let i = focusIndex; i > 0; i--) {
      map.push({
        in: {
          time: defaultItemTime,
          delay: delayTime * back
        },
        out: {
          time: defaultItemTime,
          delay: delayTime * back
        },
        ...dominoWillLeave,
        ...dominoWillEnter
      })
      back -= 1
    }

    let end = totalItems - 1
    for (let i = totalItems; i > focusIndex; i--) {
      map.push({
        in: {
          time: defaultItemTime,
          delay: delayTime * end
        },
        out: {
          time: defaultItemTime,
          delay: delayTime * end
        },
        ...dominoWillLeave,
        ...dominoWillEnter
      })
      end -= 1
    }
  }
  else {
    for (let i = 0; i < totalItems; i++) {
      if (i < focusIndex) {
        const d = (totalItems - focusIndex) * delayTime
        // eslint-disable-next-line
        const inDelay = i * delayTime + d
        map.push({
          in: {
            time: defaultItemTime,
            delay: inDelay
          },
          out: {
            time: defaultItemTime,
            delay: inDelay
          },
          ...dominoWillLeave,
          ...dominoWillEnter
        })
      }
      else if (i > focusIndex) {
        map.push({
          in: {
            time: defaultItemTime,
            delay: delayTime * post
          },
          out: {
            time: defaultItemTime,
            delay: delayTime * post
          },
          ...dominoWillLeave,
          ...dominoWillEnter
        })
        post += 1
      }
    }
  }

  // set focusIndex item to first in animation
  map.splice(focusIndex, 0, {
    in: {
      time: defaultItemTime,
      delay: 0
    },
    out: {
      time: defaultItemTime,
      delay: 0
    },
    ...dominoWillLeave,
    ...dominoWillEnter
  })

  return map
}

const animations = {
  domino: dominoPreset,
  delayedVertical: delayedVerticalPreset
}

export default animations
