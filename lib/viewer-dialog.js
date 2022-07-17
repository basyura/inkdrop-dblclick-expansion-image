"use babel";

import { CompositeDisposable } from "event-kit";
import React from "react";

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
      const winW = size[0];
      const winH = size[1];
      // set img size
      if (img.width < img.height) {
        let width = img.width * (winH / img.height);
        style = { width, height: winH };
      } else {
        let height = img.height * (winW / img.width);
        style = { width: winW, height };
      }
      // check over size
      if (style.width > winW) {
      } else if (style.height > winH) {
        const per = winH / style.height;
        style.width = style.width * per;
        style.height = style.height * per;
      }

      style.marginTop = (winH - style.height) / 2;
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
