import { Component } from "react";

class Toggle extends Component {
  state = { on: true };

  onToggle = () => {
    this.setState(
      ({ on }) => ({ on: !on }),
      () => {
        if (this.props.onToggle) {
          this.props.onToggle(this.state.on);
        }
      }
    );
  };

  render() {
    return this.props.children({
      on: this.state.on,
      onToggle: this.onToggle
    });
  }
}

export default Toggle;
