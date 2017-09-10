import React from "react";
import { LipstickHoc } from "./LipstickHoc";

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

// createLipstickSequence
// enhances an array of data to an array of LipstickComponents containing
// a presentational component and its data.
// ____________________________________________________________________
// index: index in array
// sequence: full animation (array)
// props from wrapped component
// clickHandler
// sequenceEndCallback: executes when entire sequence finishes
export const createLipstickSequence = (
  componentsArray,
  renderChildren,
  animationsMap
) => {
  const sequence = componentsArray.map((component, i) => {
    const settings = {
      ...defaultSettings,
      animation: { ...defaultSettings.animation, ...animationsMap[i] }
    };
    return {
      props: {
        ...settings,
        renderChildren,
        content: component
      }
    };
  });

  return sequence;
};

// LipstickWrapper
// generates a component with data
export const LipstickWrapper = (data, Component) =>
  class LipstickWrapper extends React.Component {
    render() {
      return <Component content={data} />;
    }
  };

// LipstickAnimation
// HOC, uses greensock TweenMax for animation
export const LipstickAnimation = LipstickHoc(
  class extends React.Component {
    render() {
      return (
        <div onClick={() => this.props.clickHandler(this.props.index)}>
          {this.props.renderChildren ? (
            this.props.children
          ) : (
            <div>{<this.props.content />}</div>
          )}
        </div>
      );
    }
  }
);
