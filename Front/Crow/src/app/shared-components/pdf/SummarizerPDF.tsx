import { format } from "date-fns-jalali/esm"
import jsPDF from "jspdf"
import 'app/pages/OCR/constants/IRANSansXFaNum-Regular-normal'

export const SummarizerPDF = (summarizedText: string) => {

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'px',
  })
  doc.setFont("IRANSansXFaNum-Regular");
  doc.setFontSize(14)
  doc.setLineHeightFactor(4);

  var pageSize = doc.internal.pageSize;
  var pageWidth = pageSize.width ?? pageSize.getWidth();
  var pageHeight = pageSize.height ?? pageSize.getHeight();

  const wrapedText = doc.splitTextToSize(summarizedText, pageWidth )
  doc.text(wrapedText, pageWidth - 15, 30, { align: "right",isOutputRtl: true });

  //add footer
  var img = new Image()
  doc.setFontSize(9)
  img.src = "assets/images/logos/ai-logo.png"
  doc.addImage(img, "png", 5, pageHeight - 28, 25, 25);
  doc.text(`AFAGH-AI copyright`, 35, pageHeight - 14)

  doc.save(`summarized-text-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
