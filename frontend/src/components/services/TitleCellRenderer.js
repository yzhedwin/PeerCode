import React from "react";

export class TitleCellRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.btnClickedHandler = this.btnClickedHandler.bind(this);
  }
  btnClickedHandler() {
    this.props.clicked(this.props.value.slug);
  }
  render() {
    return (
      <div className="title-div" onClick={this.btnClickedHandler}>
        {this.props.value.title}
      </div>
    );
  }
}
