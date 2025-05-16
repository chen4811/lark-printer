import html2pdf from "html2pdf.js";

export function registerButtons(editor, getPrintSettings) {
  editor.ui.registry.addButton("newprint", {
    icon: "print",
    tooltip: "打印",
    context: "mode:readonly", // **仅在 readonly 模式显示**
    onAction: () => {
      // 执行打印命令
      editor.execCommand("mcePrint");
    },
  });

  editor.ui.registry.addButton("exportPDF", {
    icon: "export-pdf",
    context: "mode:readonly",
    onAction() {
      if (this.isEdited) {
        this.showNotification(editor, "请先套用模板才能导出 PDF！", "warning");
        return;
      }

      const pdfName = prompt("请输入想要导出 PDF 文件名", "sample.pdf");

      const content = editor.getContent();
      const printSettings = getPrintSettings();

      html2pdf()
        .from(content)
        .set({
          margin: [
            printSettings.marginTop,
            printSettings.marginRight,
            printSettings.marginBottom,
            printSettings.marginLeft,
          ],
          filename: pdfName,
          html2canvas: { scale: 2 },
          jsPDF: {
            orientation: printSettings.orientation,
            unit: "mm",
            format: "a4",
          },
        })
        .save()
        .then(() => {
          this.showNotification(editor, "PDF 导出成功！", "success");
        });
    },
  });
}
