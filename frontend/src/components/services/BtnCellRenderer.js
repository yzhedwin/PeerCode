import React from "react";
import { Button } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";

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
        <button className="action-btn" onClick={this.btnClickedEditHandler}>
          <Pencil size={25}></Pencil>
        </button>
        <button className="action-btn" onClick={this.btnClickedDeleteHandler}>
          <Trash size={25}></Trash>
        </button>
      </div>
    );
  }
}
