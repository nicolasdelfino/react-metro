import React from "react";
import { render } from "react-dom";
import TransitionGroupPlus from "react-transition-group-plus";
import DemoComponent from "./DemoComponent";
import { Twemoji } from "react-emoji-render";
import { Metro } from "./Metro";

// override default animations settings in a Tweeny sequence
// see greensock tweenmax for reference
// helper functions to create maps coming soon
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

  //////////////////////////////////// METRO START ////////////////////////////////////

  renderMetroComponents() {
    // toggle mount / unmount of components
    if (!this.state.show) {
      return;
    }

    const data = [
      { name: "monkey", emoji: "🐵" },
      { name: "dog", emoji: "🐶" },
      { name: "cow", emoji: "🐮" }
    ];

    const sequence = Metro.sequence(data, animationsMap);

    return sequence.map((data, index) => {
      const props = {
        index,
        sequence,
        ...data.props,
        wrapperType: "div",
        clickHandler: this.componentClickCallback.bind(this),
        mountSequenceComplete: this.mountSequenceComplete.bind(this),
        unmountSequenceComplete: this.unmountSequenceComplete.bind(this)
      };

      return (
        <Metro.animation key={index} {...props}>
          <DemoComponent content={data.props.content} />
        </Metro.animation>
      );
    });
  }

  //////////////////////////////////// METRO END ////////////////////////////////////

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
        <Twemoji text={"React Metro 🚇"} style={{ fontSize: 40 }} />
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
            {this.renderMetroComponents()}
          </TransitionGroupPlus>
        </div>
        <hr />
        <p>
          <p className="cool">
            React Metro is a tiny configurable wrapper for animating dom
            elements as they mount or unmount
          </p>
          * Optional hooks for binding methods to sequence end and start.<br />
          * Comes with a simple fade animation but everything can be overriden
          by providing a custom animaionsMap<br />
        </p>

        <p className="code">import {"{ Metro }"} from './Metro'</p>
        <h3>Create a sequence:</h3>
        <p className="code">
          const sequence = Metro.sequence(someArray, animationsMap)
        </p>
        <h3>Map it</h3>
        <p className="code">
          --> in method renderMetroComponents:
          <br />
          <br />
          sequence.map((data, index) => {"{"}
          <br />
          <br />
          {"/* Setup Metro props */"}
          <br />
          const props={"{"}
          <br />
          index<br />
          sequence<br />
          ...data.props<br />
          wrapperType: 'div' {"<- div, ul whatever..."}
          <br />
          clickHandler: this.yourClickMethod.bind(this)<br />
          mountSequenceComplete: this.yourMountComplete.bind(this) <br />
          unmountSequenceComplete: this.yourUnmountComplete.bind(this)<br />
          {"}"}
          <br />
          <br />
          {"return ("}
          <br />
          {"<"}Metro.animation key={"{i}"} props={"{...props}"} {"/> }"}
          <br />
          {"-----> <"}YourComponent content={"{data.props.content}/>"}
          <br />
          {"<"}Metro.animation {"/>)})"}
          <br />
        </p>

        <h3>& render it:</h3>
        <p className="code">
          {'<TransitionGroupPlus> <- pass in component="li/div/ul..."'}
          <br />
          {"{ this.renderMetroComponents() } "}
          <br />
          {"</TransitionGroupPlus>"}
        </p>
      </div>
    );
  }
}

render(<Page />, document.getElementById("root"));
