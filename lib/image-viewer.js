"use babel";

import ImageViewerMessageDialog from "./image-viewer-message-dialog";

module.exports = {
  activate() {
    inkdrop.components.registerClass(ImageViewerMessageDialog);
    inkdrop.layouts.addComponentToLayout("modal", "ImageViewerMessageDialog");
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      "modal",
      "ImageViewerMessageDialog"
    );
    inkdrop.components.deleteClass(ImageViewerMessageDialog);
  },
};
