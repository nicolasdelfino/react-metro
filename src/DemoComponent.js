import React from "react";
import { Twemoji } from "react-emoji-render";

const styles = {
  width: 300,
  height: 100,
  background: "dodgerBlue",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: 10,
  fontSize: 10,
  color: "white"
};

// receives data as 'content'
class DemoComponent extends React.Component {
  render() {
    return (
      <div style={{ ...styles }}>
        {this.props.content.name}
        <Twemoji text={this.props.content.emoji} style={{ fontSize: 50 }} />
      </div>
    );
  }
}

export default DemoComponent;
