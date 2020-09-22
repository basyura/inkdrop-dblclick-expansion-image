"use babel";

import { CompositeDisposable } from "event-kit";
import * as React from "react";

export default class ViewerDialog extends React.Component {
  subscriptions = new CompositeDisposable();
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
    this.subscriptions.add(
      inkdrop.commands.add(document.body, {
        "dblclick-expansion-image:open": this.open,
      })
    );
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
    this.subscriptions.dispose();
  }
  /*
   *
   */
  render() {
    const { MessageDialog } = inkdrop.components.classes;
    const img = this.state.img;
    let style = {};
    if (img != null) {
      const size = inkdrop.window.getSize();
      let per = size[0] / img.width;
      // how to calculate 100 ?
      while (size[1] < (img.height + 100) * per) {
        per -= 0.1;
      }
      style = { width: img.width * per };
    }

    return (
      <div onClick={this.handleClick.bind(this)}>
        <MessageDialog
          ref="dialog"
          className="dblclick-expansion-image"
          onDismiss={() => {
            try {
              this.setState({ img: null });
              setTimeout(() => {
                inkdrop.commands.dispatch(document.body, "editor:focus");
              }, 500);
            } catch {}
          }}
        >
          <img
            src={img == null ? "" : img.src}
            style={style}
            onClick={this.handleClick.bind(this)}
          />
        </MessageDialog>
      </div>
    );
  }
  /*
   *
   */
  open = (ev) => {
    let img = document.createElement("img");
    img.src = ev.detail.url;
    // replace event
    this.openViewer({ tagName: "IMG", srcElement: img });
  };
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
      this.isShown = true;
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
