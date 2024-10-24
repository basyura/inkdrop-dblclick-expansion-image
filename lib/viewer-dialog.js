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
    this.imgRef = React.createRef();
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

    if (inkdrop.isEditorActive()) {
      this.attatchEvents();
    } else {
      inkdrop.onEditorLoad(() => this.attatchEvents());
    }
  }
  /*
   *
   */
  componentWillUnmount() {
    const layout = document.querySelector(".editor-layout");
    layout.removeEventListener("dblclick", this.openViewer);
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
            } catch {}
          }}
        >
          <img
            ref={this.imgRef}
            src={img == null ? "" : img.src}
            style={style}
            onClick={this.handleClick.bind(this)}
            tabIndex={0}
            onKeyDown={this.handleKeyDown.bind(this)}
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
  attatchEvents = () => {
    const layout = document.querySelector(".editor-layout");
    layout.addEventListener("dblclick", this.openViewer);
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
      setTimeout(() => {
        // img 要素にフォーカスを設定
        if (this.imgRef.current) {
          this.imgRef.current.focus();
        }
        // 性能の低い端末用
        setTimeout(() => {
          if (this.imgRef.current) {
            this.imgRef.current.focus();
          }
        }, 300);
      }, 100);
    } else {
      dialog.dismissDialog();
    }
  };
  /*
   *
   */
  closeViewer = () => {
    const { dialog } = this.refs;
    dialog.dismissDialog();
    setTimeout(() => {
      inkdrop.commands.dispatch(document.body, "editor:focus");
    }, 500);
  };
  /*
   *
   */
  handleClick = (_) => this.closeViewer();
  /*
   *
   */
  handleKeyDown = (ev) => {
    ev.preventDefault();
    this.closeViewer();
  };
}
