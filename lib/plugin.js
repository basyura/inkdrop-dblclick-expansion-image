"use babel";

import ViewerDialog from "./viewer-dialog";

module.exports = {
  activate() {
    inkdrop.components.registerClass(ViewerDialog);
    inkdrop.layouts.addComponentToLayout("modal", "ViewerDialog");
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout("modal", "ViewerDialog");
    inkdrop.components.deleteClass(ViewerDialog);
  },
};
