/*
* React Metro - MetroHOC
* Enhances a wrapped component 
*/
import React from 'react'
import MetroTween from './MetroTween'

const MetroHoc = Component =>
  class MetroContainer extends React.Component {
    static defaultProps = {
      wrapperType: 'div'
    }

    // longest animation in sequence
    getLongestAnimationInSequence(io) {
      return Math.max(
        ...this.props.sequence.map(
          obj => obj.animation[io].time + obj.animation[io].delay
        )
      )
    }

    isThisTheLongestAnimation(animation, io) {
      const highestDuration = this.getLongestAnimationInSequence(io)
      const duration = animation[io].time + animation[io].delay
      return duration >= highestDuration
    }

    applySequenceEndIfLastInSequence(animationIndex, sequence, io) {
      const highestDuration = this.getLongestAnimationInSequence(io)
      let isLastInSequence = true
      sequence.forEach((animationInSequence, i) => {
        const duration =
          animationInSequence.animation[io].time +
          animationInSequence.animation[io].delay
        if (duration === highestDuration) {
          if (i > animationIndex) {
            isLastInSequence = false
          }
        }
      })
      return isLastInSequence
    }

    // on will enter
    componentWillEnter(callback) {
      const el = this.container

      this.props.sequence[this.props.itemIndex].animating = true
      MetroTween.fromTo(
        el,
        this.props.animation.in.time,
        this.props.animation.willEnter.from,
        {
          ...this.props.animation.willEnter.to,
          delay: this.props.animation.in.delay
        }
      ).then(() => {
        if (
          this.isThisTheLongestAnimation(this.props.animation, 'in') &&
          this.applySequenceEndIfLastInSequence(
            this.props.index,
            this.props.sequence,
            'in'
          )
        ) {
          this.props.onMount && this.props.onMount()
        }
        this.props.sequence[this.props.itemIndex].animating = false
        callback()
      })
    }

    componentWillLeave(callback) {
      const el = this.container
      const fullSequenceDuration = this.getLongestAnimationInSequence('out')

      const leftOver =
        fullSequenceDuration -
        (this.props.animation.out.time + this.props.animation.out.delay)

      this.props.sequence[this.props.itemIndex].animating = true
      MetroTween.fromTo(
        el,
        this.props.animation.out.time,
        this.props.animation.willLeave.from,
        {
          ...this.props.animation.willLeave.to,
          delay: this.props.animation.out.delay
        }
      ).then(() => {
        setTimeout(() => {
          if (
            this.isThisTheLongestAnimation(this.props.animation, 'out') &&
            this.applySequenceEndIfLastInSequence(
              this.props.index,
              this.props.sequence,
              'out'
            )
          ) {
            this.props.onUnmount && this.props.onUnmount()
          }
          this.props.sequence[this.props.itemIndex].animating = false
          callback()
        }, leftOver * 1000)
      })
    }

    /* eslint-disable */
    render() {
      return (
        <this.props.wrapperType ref={c => (this.container = c)}>
          <Component {...this.props} />
        </this.props.wrapperType>
      )
    }
  }

export default MetroHoc
