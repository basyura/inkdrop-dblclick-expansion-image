"use babel";

import * as React from "react";

export default class ViewerDialog extends React.Component {
  /*
   *
   */
  constructor(props) {
    super(props);
    this.state = { img: null };
  }
  /*
   *
   */
  componentWillMount() {
    inkdrop.onEditorLoad((e) => this.attatchEvents(e));
  }
  /*
   *
   */
  componentWillUnmount() {
    const preview = document.querySelector(".mde-preview");
    preview.removeEventListener("dblclick", this.openViewer);

    const editor = document.querySelector(".editor");
    editor.removeEventListener("dblclick", this.openViewer);
  }
  /*
   *
   */
  render() {
    const size = inkdrop.window.getSize();
    const img = this.state.img;

    if (img == null) {
      return <></>;
    }

    let per = size[0] / img.width;
    // how to calculate 100 ?
    while (size[1] < (img.height + 100) * per) {
      per -= 0.1;
    }
    let style = { width: img.width * per };
    const { MessageDialog } = inkdrop.components.classes;
    return (
      <MessageDialog
        ref="dialog"
        className="dblclick-expansion-image"
        onDismiss={() => {
          this.setState({ img: null });
          setTimeout(() => {
            inkdrop.commands.dispatch(document.body, "editor:focus");
          }, 500);
        }}
      >
        <img
          src={img == null ? "" : img.src}
          style={style}
          onClick={this.handleClick.bind(this)}
        />
      </MessageDialog>
    );
  }
  /*
   *
   */
  attatchEvents = (_) => {
    const preview = document.querySelector(".mde-preview");
    preview.addEventListener("dblclick", this.openViewer);

    const editor = document.querySelector(".editor");
    editor.addEventListener("dblclick", this.openViewer);
  };
  /*
   *
   */
  openViewer = (e) => {
    const src = e.srcElement;
    if (src.tagName != "IMG") {
      return;
    }

    this.setState({ img: src });

    const { dialog } = this.refs;
    if (!dialog.isShown) {
      dialog.showDialog();
    } else {
      dialog.dismissDialog();
    }
  };
  /*
   *
   */
  handleClick = (_) => {
    const { dialog } = this.refs;
    if (dialog != null) {
      dialog.dismissDialog();
    }
  };
}
