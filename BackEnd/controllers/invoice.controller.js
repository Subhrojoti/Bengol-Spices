import Invoice from "../models/Invoice.js";

export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const invoice = await Invoice.findOne({ orderId });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`,
    );

    return res.redirect(invoice.pdfUrl);
  } catch (error) {
    res.status(500).json({ message: "Download failed" });
  }
};
