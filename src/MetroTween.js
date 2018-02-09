/*
* React Metro - MetroTween
* Animates DOM elements by temporarily injecting inline styles
*/
class MetroTween {
  /*
  * Valid keys and their handlers
  */
  static keyMap = {
    x: value => `translateX(${value}px)`,
    y: value => `translateY(${value}px)`,
    skewX: value => `skewX(${value})`,
    skewY: value => `skewY(${value})`,
    scaleX: value => `scaleX(${value})`,
    scaleY: value => `scaleY(${value})`,
    rotation: value => `rotate(${value}deg)`,
    scale: value => `scale(${value})`,
    opacity: null
  }

  /*
  * Easing equations
  */
  static easeEquationMap = {
    easeInSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
    easeOutSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
    easeInOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
    easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    easeInQuart: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
    easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
    easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
    easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
    easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
    easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
    easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }

  /*
  * Transform agents
  */
  static transformAgents = [
    'webkitTransform',
    'MozTransform',
    'msTransform',
    'OTransform',
    'transform'
  ]

  /*
  * Transition agents
  */
  static transitionAgents = [
    '-webkit-transition',
    '-moz-transition',
    '-o-transition',
    'transition'
  ]

  /*
  * Types
  */
  static typeDefs = {
    UNDEFINED: 'undefined',
    STRING: 'string',
    NUMBER: 'number',
    OBJECT: 'object',
    DELAY: 'delay',
    EASE: 'ease',
    DEFAULT_EASE: 'linear',
    DEFAULT_TWEEN_PROP: 'all',
    DEFAULT_TIME_UNIT: 'ms'
  }

  /*
  * MetroTween.fromTo
  * arguments:
  * element: DOM element
  * duration: Seconds / milliseconds
  * fromProps: Object, list of properties to animate from
  * toProps: Object, list of properties to animate to
  */
  static fromTo(element, duration, fromProps, toProps) {
    return new Promise((resolve, reject) => {
      /* 
      * Validate args 
      * element, duration, fromProps, toProps
      */
      if (
        !element ||
        typeof fromProps !== MetroTween.typeDefs.OBJECT ||
        typeof toProps !== MetroTween.typeDefs.OBJECT
      ) {
        reject('incorrect args')
      }
      if (typeof window === MetroTween.typeDefs.UNDEFINED) {
        reject('no window')
      }
      if (Object.values(fromProps).length === 0) {
        reject('incorrect fromProps args')
      }
      if (Object.values(toProps).length === 0) {
        reject('incorrect toProps args')
      }
      if (typeof duration !== MetroTween.typeDefs.NUMBER || !duration) {
        reject('incorrect duration arg')
      }

      /* 
      * Loop through fromProps / toProps, push tween properties and assign a handler.
      */
      const {
        easingEquationFrom,
        easingEquationTo
      } = MetroTween.getEasingFromProps(fromProps, toProps)

      let delay = 0
      const hasProp = Object.prototype.hasOwnProperty
      const fromKeyPairs = []
      const toKeyPairs = []

      Object.entries(fromProps).forEach(prop => {
        const key = prop[0]
        const value = prop[1]

        /* ignore ease when constructing [from] pairs */
        if (
          key === MetroTween.typeDefs.EASE &&
          typeof value === MetroTween.typeDefs.STRING
        ) {
          return
        }

        if (!hasProp.call(MetroTween.keyMap, key)) {
          // eslint-disable-next-line
          console.log(
            'invalid from key:',
            key,
            'handler:',
            MetroTween.keyMap[key].value
          )
          return
        }
        fromKeyPairs.push({
          key,
          value,
          handler: MetroTween.keyMap[key]
        })
      })

      Object.entries(toProps).forEach(prop => {
        const key = prop[0]
        const value = prop[1]

        /* ignore ease when constructing [to] pairs */
        if (
          key === MetroTween.typeDefs.EASE &&
          typeof value === MetroTween.typeDefs.STRING
        ) {
          return
        }

        if (
          key === MetroTween.typeDefs.DELAY &&
          typeof value === MetroTween.typeDefs.NUMBER
        ) {
          delay = value
        }
        else if (
          typeof value === MetroTween.typeDefs.NUMBER ||
          typeof value === MetroTween.typeDefs.STRING
        ) {
          if (!hasProp.call(MetroTween.keyMap, key)) {
            console.log('invalid to key:', key) // eslint-disable-line
            return
          }

          toKeyPairs.push({
            key,
            value,
            handler: MetroTween.keyMap[key]
          })
        }
      })

      /* 
      * Construct animation object
      */
      const animation = {
        from: fromKeyPairs,
        to: toKeyPairs
      }

      /* 
      * Animate
      * Apply from properties to element
      * Stall during the set animation delay 
      * Set the transition of the element based on its property and duration
      * Stall during the animation duration before resolving
      * Reset the element
      */

      const transitionTime = duration * 1000
      const delayTime = delay * 1000

      MetroTween.applyAnimation(element, transitionTime, easingEquationFrom)
      animation.from.forEach(prop => {
        MetroTween.applyStyles(element, prop)
      })

      window.requestAnimationFrame(() => {
        setTimeout(() => {
          MetroTween.applyAnimation(element, transitionTime, easingEquationTo)
          animation.to.forEach(prop => {
            MetroTween.applyStyles(element, prop)
          })

          setTimeout(() => {
            MetroTween.resetStyles(element)
            resolve()
          }, transitionTime)
        }, delayTime)
      })
    })
  }

  /*
  * Easing
  */
  static getEasingFromProps = (fromProps, toProps) => {
    const hasProp = Object.prototype.hasOwnProperty
    const props = [
      {
        p: fromProps,
        equation: MetroTween.typeDefs.DEFAULT_EASE
      },
      {
        p: toProps,
        equation: MetroTween.typeDefs.DEFAULT_EASE
      }
    ]

    props.forEach(list => {
      if (
        hasProp.call(list.p, MetroTween.typeDefs.EASE) &&
        hasProp.call(MetroTween.easeEquationMap, list.p.ease)
      ) {
        list.equation = MetroTween.easeEquationMap[list.p.ease]
      }
    })

    return {
      easingEquationFrom: props[0].equation,
      easingEquationTo: props[1].equation
    }
  }

  /*
  * Apply animation
  */
  static applyAnimation = (element, transitionTime, ease) => {
    MetroTween.transitionAgents.forEach(
      agent =>
        (element.style[agent] = `${
          MetroTween.typeDefs.DEFAULT_TWEEN_PROP
        } ${transitionTime}${MetroTween.typeDefs.DEFAULT_TIME_UNIT} ${ease}`)
    )
  }

  /* 
  * Apply styles 
  */
  static applyStyles = (element, prop) => {
    element.style[prop.key] = prop.value
    if (prop.handler) {
      MetroTween.transformAgents.forEach(
        agent => (element.style[agent] = prop.handler(prop.value))
      )
    }
    else {
      element.style[prop.key] = prop.value
    }
  }

  /* 
  * Reset styles 
  */
  static resetStyles = element => {
    element.style.transition = ''
    MetroTween.transformAgents.forEach(agent => (element.style[agent] = ''))
  }
}

export default MetroTween
