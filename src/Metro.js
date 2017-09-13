import React from "react";
import { MetroHoc } from "./MetroHoc";

const defaultSettings = {
  renderChildren: false,
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
      to: { opacity: 1, ease: "easeInOut" }
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
};

// metroSequence
// enhances an array of data to a Metro sequence with animation data
// ____________________________________________________________________
// index: index in array
// sequence: full animation (array)
// props from wrapped component
// clickHandler
// sequenceEndCallback: executes when entire sequence finishes
const metroSequence = (dataArray, animationsMap) => {
  const sequence = dataArray.map((data, i) => {
    const settings = {
      ...defaultSettings,
      animation: { ...defaultSettings.animation, ...animationsMap[i] }
    };
    return {
      props: {
        ...settings,
        content: data
      }
    };
  });

  return sequence;
};

// metroAnimation
// HOC, uses greensock TweenMax for animation
const metroAnimation = MetroHoc(
  class extends React.Component {
    render() {
      return (
        <div onClick={() => this.props.clickHandler(this.props.index)}>
          {this.props.children}
        </div>
      );
    }
  }
);

export const Metro = {
  sequence: metroSequence,
  animation: metroAnimation
};
