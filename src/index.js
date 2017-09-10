import React from "react";
import { render } from "react-dom";
import TransitionGroupPlus from "react-transition-group-plus";
import DemoComponent from "./DemoComponent";
import { Twemoji } from "react-emoji-render";
import {
  LipstickWrapper,
  LipstickAnimation,
  createLipstickSequence
} from "./Lipstick";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      mountComplete: false,
      unmountComplete: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      show: !this.state.show,
      mountComplete: false,
      unmountComplete: false
    });
  }

  mountSequenceComplete() {
    console.log("mountSequenceComplete");
    this.setState({ mountComplete: true, unmountComplete: false });
  }

  unmountSequenceComplete() {
    console.log("unmountSequenceComplete");
    this.setState({ mountComplete: false, unmountComplete: true });
  }

  componentClickCallback(index) {
    console.log("component clicked: ", index);
  }

  renderButtons() {
    return (
      <div>
        <div
          className="buttonStyle"
          style={{
            background: this.state.show === true ? "red" : "black"
          }}
          onClick={() => this.toggle()}
        >
          {this.state.show === true ? "unmount components" : "-> MOUNT!!!!"}
        </div>
      </div>
    );
  }

  renderAnimatedComponents() {
    // toggle mount / unmount of components
    if (!this.state.show) {
      return;
    }

    // override default animations settings in a Tweeny sequence
    // see greensock tweenmax for reference
    const animationsMap = [
      {
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
          to: { opacity: 1, y: 0, x: 0, ease: "easeInOutElastic" }
        }
      },
      {
        in: {
          time: 3,
          delay: 0
        }
      },
      {
        out: {
          time: 1.4,
          delay: 0
        },
        willEnter: {
          from: { opacity: 0, y: 120, x: -30 },
          to: { opacity: 1, y: 0, x: 0, ease: "easeInOutElastic" }
        }
      }
    ];

    // enhances an array of data to an array of LipstickComponents containing
    // a presentational component and its data.
    // renderChildren: replaces the component (DemoComponent) with child data
    // e.g: <LipstickAnimation> new content here </LipstickAnimation>
    const renderChildren = false;
    const sequence = createLipstickSequence(
      [
        { name: "monkey", emoji: "🐵" },
        { name: "dog", emoji: "🐶" },
        { name: "cow", emoji: "🐮" }
      ].map(data => LipstickWrapper(data, DemoComponent)),
      renderChildren,
      animationsMap
    );

    return sequence.map((wrappedComponent, index) => {
      // index: index in array
      // sequence: full animation (array)
      // props from wrapped component
      // clickHandler
      // sequenceEndCallback: executes when entire sequence finishes

      const props = {
        index,
        sequence: sequence,
        ...wrappedComponent.props,
        clickHandler: this.componentClickCallback.bind(this),
        mountSequenceComplete: this.mountSequenceComplete.bind(this),
        unmountSequenceComplete: this.unmountSequenceComplete.bind(this)
      };

      return <LipstickAnimation key={index} {...props} />;
    });
  }

  getText() {
    if (this.state.unmountComplete === true) {
      return "(unmount sequence complete)";
    } else if (this.state.mountComplete === true) {
      return "(mount sequence complete)";
    }
    return "...";
  }

  render() {
    return (
      <div className="wrapper">
        <Twemoji text={"React Lipstick 💄"} style={{ fontSize: 40 }} />
        <h3>
          <p>{"Demo -> status = " + this.getText()}</p>
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          {this.renderButtons()}
          <TransitionGroupPlus>
            {this.renderAnimatedComponents()}
          </TransitionGroupPlus>
        </div>
        <hr />
        <p>
          <p className="cool">
            React Lipstick is a tiny configurable wrapper for animating dom
            elements as they mount or unmount
          </p>
          * Optional hooks for binding methods to sequence end and start.<br />
          * Comes with a simple fade animation but everything can be overriden
          by providing a custom animaionsMap<br />
        </p>

        <p className="code">
          import{" "}
          {"{ LipstickWrapper, LipstickAnimation, createLipstickSequence }"}
          <br /> from 'react-lipstick'
        </p>
        <h3>Basic usage, creating a sequence:</h3>
        <p className="code">
          const sequence = createLipstickSequence(array)<br />.map(data =>
          LipstickWrapper(data, component))
        </p>
        <p className="codeExplain">
          the array data {'["car","bike"]'} will get passed as props to your
          component
        </p>
        <h3>& rendering it:</h3>
        <p className="code">
          {"<transitionGroupPlus>"}
          <br />
          {"{ this.state.show && "} sequence.map((wrappedComponent, index) =>
          <br />
          {"<"}LipstickAnimation key={"{i}"} props={"{...props}"} {"/> }"}
          <br />
          {"</transitionGroupPlus>"}
        </p>
      </div>
    );
  }
}

render(<Page />, document.getElementById("root"));
