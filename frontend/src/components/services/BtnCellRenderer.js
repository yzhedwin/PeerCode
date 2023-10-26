import React from "react";

export class BtnCellRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.btnClickedEditHandler = this.btnClickedEditHandler.bind(this);
    this.btnClickedDeleteHandler = this.btnClickedDeleteHandler.bind(this);
  }
  btnClickedEditHandler() {
    this.props.clicked(["e", this.props.value]);
  }
  btnClickedDeleteHandler() {
    this.props.clicked(["d", this.props.value]);
  }
  render() {
    return (
      <div>
        <button onClick={this.btnClickedEditHandler}>Edit Question</button>
        <button onClick={this.btnClickedDeleteHandler}>Delete Question</button>
      </div>
    );
  }
}
