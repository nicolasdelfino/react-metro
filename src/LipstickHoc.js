import React from "react";
import { TweenMax } from "gsap";

export const LipstickHoc = Component => {
  return class LipstickContainer extends React.Component {
    // longest animation in sequence
    getLongestAnimationInSequence(io) {
      return Math.max.apply(
        Math,
        this.props.sequence.map(obj => {
          return obj.props.animation[io].time + obj.props.animation[io].delay;
        })
      );
    }

    isThisTheLongestAnimation(animation, io) {
      const highestDuration = this.getLongestAnimationInSequence(io);
      const duration = animation[io].time + animation[io].delay;
      return duration >= highestDuration;
    }

    applySequenceEndIfLastInSequence(animationIndex, sequence, io) {
      const highestDuration = this.getLongestAnimationInSequence(io);
      let isLastInSequence = true;
      sequence.forEach((animationInSequence, i) => {
        const duration =
          animationInSequence.props.animation[io].time +
          animationInSequence.props.animation[io].delay;
        if (duration === highestDuration) {
          if (i > animationIndex) {
            isLastInSequence = false;
          }
        }
      });
      return isLastInSequence;
    }

    // on will enter
    componentWillEnter(callback) {
      const el = this.container;
      TweenMax.fromTo(
        el,
        this.props.animation.in.time,
        this.props.animation.willEnter.from,
        {
          ...this.props.animation.willEnter.to,
          onComplete: () => {
            if (
              this.isThisTheLongestAnimation(this.props.animation, "in") &&
              this.applySequenceEndIfLastInSequence(
                this.props.index,
                this.props.sequence,
                "in"
              )
            ) {
              this.props.mountSequenceComplete();
            }
            callback();
          }
        }
      );
    }

    // on will leave
    componentWillLeave(callback) {
      const el = this.container;
      const fullSequenceDuration = this.getLongestAnimationInSequence("out");

      const leftOver =
        fullSequenceDuration -
        (this.props.animation.out.time + this.props.animation.out.delay);

      TweenMax.fromTo(
        el,
        this.props.animation.out.time,
        this.props.animation.willLeave.from,
        {
          ...this.props.animation.willLeave.to,
          delay: this.props.animation.out.delay,
          onComplete: () => {
            setTimeout(() => {
              if (
                this.isThisTheLongestAnimation(this.props.animation, "out") &&
                this.applySequenceEndIfLastInSequence(
                  this.props.index,
                  this.props.sequence,
                  "out"
                )
              ) {
                this.props.unmountSequenceComplete();
              }
              callback();
            }, leftOver * 1000);
          }
        }
      );
    }

    render() {
      return (
        <div ref={c => (this.container = c)}>
          <Component {...this.props} />
        </div>
      );
    }
  };
};
