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
    const img = this.state.img;
    let style = {};
    if (img != null) {
      if (img.height > img.width) {
        style = { height: "100%" };
      } else {
        style = { width: "100%" };
      }
    }

    const { MessageDialog } = inkdrop.components.classes;
    return (
      <MessageDialog
        ref="dialog"
        title="ImageViewer"
        className="image-viewer"
        onDismiss={() => {
          setTimeout(() => {
            inkdrop.commands.dispatch(document.body, "editor:focus");
          }, 500);
        }}
      >
        <img src={img == null ? "" : img.src} style={style} />
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
}
