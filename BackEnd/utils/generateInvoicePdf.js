import PDFDocument from "pdfkit";
import axios from "axios";

/* ─────────────────────────────────────────────
   COLOUR PALETTE
───────────────────────────────────────────── */
const C = {
  navy: "#1B2A4A",
  gold: "#C9A84C",
  white: "#FFFFFF",
  offWhite: "#F7F8FA",
  border: "#D0D5DD",
  text: "#1A1A2E",
  muted: "#6B7280",
  red: "#C0392B",
  green: "#1A7F4B",
  rowAlt: "#F0F2F5",
};

/* ─────────────────────────────────────────────
   PAGE CONSTANTS
───────────────────────────────────────────── */
const W = 595.28; // A4 width  pt
const H = 841.89; // A4 height pt
const ML = 36; // left margin
const MR = 36; // right margin
const CW = W - ML - MR; // content width ≈ 523 pt

/* ─────────────────────────────────────────────
   FORMATTERS
───────────────────────────────────────────── */
const fmt = (n) =>
  `₹${Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ─────────────────────────────────────────────
   DRAWING HELPERS
   All helpers save/restore graphics state so
   they never bleed font/color into each other.
───────────────────────────────────────────── */
const fillRect = (doc, x, y, w, h, color) =>
  doc.save().rect(x, y, w, h).fill(color).restore();

const strokeBox = (doc, x, y, w, h, color = C.border, lw = 0.6) =>
  doc
    .save()
    .rect(x, y, w, h)
    .lineWidth(lw)
    .strokeColor(color)
    .stroke()
    .restore();

const hRule = (doc, y, color = C.border, x = ML, w = CW, lw = 0.5) =>
  doc
    .save()
    .moveTo(x, y)
    .lineTo(x + w, y)
    .lineWidth(lw)
    .strokeColor(color)
    .stroke()
    .restore();

const vLine = (doc, x, y1, y2, color = C.border, lw = 0.5) =>
  doc
    .save()
    .moveTo(x, y1)
    .lineTo(x, y2)
    .lineWidth(lw)
    .strokeColor(color)
    .stroke()
    .restore();

/**
 * Render text inside a clipped cell.
 * Caller must set font / fontSize / fillColor before calling.
 * opts.pl  = left padding  (default 4)
 * opts.pr  = right padding (default 4)
 */
const cell = (doc, text, x, y, w, align = "left", opts = {}) => {
  const pl = opts.pl ?? 4;
  const pr = opts.pr ?? 4;
  doc
    .save()
    .rect(x, y, w, 500)
    .clip()
    .text(String(text ?? ""), x + pl, y, {
      width: w - pl - pr,
      align,
      lineGap: 1,
      ...opts,
    })
    .restore();
};

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
export const generateInvoicePDFBuffer = async (invoice) => {
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({ margin: 0, size: "A4" });
    const buffers = [];
    doc.on("data", (b) => buffers.push(b));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    /* ── image loader ── */
    const loadImage = async (url) => {
      try {
        const res = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 10000,
        });
        return Buffer.from(res.data, "binary");
      } catch {
        return null;
      }
    };

    const [logo, qr] = await Promise.all([
      loadImage(
        "https://res.cloudinary.com/dn8rh6hng/image/upload/v1775517576/BS_Logo_New_vosslv.png",
      ),
      loadImage(
        "https://res.cloudinary.com/dn8rh6hng/image/upload/v1775519648/qr-code-21364_sj0e2l.png",
      ),
    ]);

    /* ══════════════════════════════════════════
       1 — HEADER BAND
    ══════════════════════════════════════════ */
    const HDR_H = 96;
    fillRect(doc, 0, 0, W, HDR_H, C.navy);
    fillRect(doc, 0, HDR_H - 3, W, 3, C.gold); // gold accent stripe

    // Logo — vertically centred in usable header area
    const LOGO_SZ = 64;
    const LOGO_Y = Math.round((HDR_H - 3 - LOGO_SZ) / 2);
    if (logo) doc.image(logo, ML, LOGO_Y, { fit: [LOGO_SZ, LOGO_SZ] });

    // Company text — right of logo
    const TX = ML + LOGO_SZ + 14;
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("BENGOL SPICES PRIVATE LIMITED", TX, 16, { characterSpacing: 0.2 });
    doc
      .fillColor("#A8BBCC")
      .font("Helvetica")
      .fontSize(8)
      .text("23/23, Kalipur Kacha Road, Sodpur, Nagvilla, Haridevpur", TX, 34)
      .text("Kolkata – 700082, West Bengal", TX, 45)
      .text(
        "Email: support@bengolspices.com   |   Phone: +91 9831431018",
        TX,
        56,
      );

    // GSTIN badge — top-right
    const GX = W - MR - 148;
    doc
      .fillColor("#A8BBCC")
      .font("Helvetica")
      .fontSize(7.5)
      .text("GSTIN:", GX, 16);
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text(invoice.gstin ?? "29AABCB1234A1Z5", GX + 34, 16);

    /* ══════════════════════════════════════════
       2 — TITLE ROW
    ══════════════════════════════════════════ */
    const TITLE_Y = HDR_H;
    const TITLE_H = 30;
    fillRect(doc, 0, TITLE_Y, W, TITLE_H, C.offWhite);
    hRule(doc, TITLE_Y + TITLE_H, C.border, 0, W, 0.6);

    doc
      .fillColor(C.navy)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("TAX INVOICE", 0, TITLE_Y + 9, {
        align: "center",
        width: W,
        characterSpacing: 3,
      });

    doc
      .fillColor(C.muted)
      .font("Helvetica")
      .fontSize(7)
      .text("ORIGINAL FOR RECIPIENT", W - MR - 118, TITLE_Y + 11);

    /* ══════════════════════════════════════════
       3 — META STRIP  (3 equal columns)
    ══════════════════════════════════════════ */
    const META_Y = TITLE_Y + TITLE_H;
    const META_H = 44;
    const META_CW = CW / 3;

    strokeBox(doc, ML, META_Y, CW, META_H);

    [
      { label: "INVOICE #", value: invoice.invoiceNumber },
      { label: "INVOICE DATE", value: fmtDate(invoice.invoiceDate) },
      { label: "DUE DATE", value: fmtDate(invoice.dueDate) },
    ].forEach((col, i) => {
      const cx = ML + i * META_CW;
      if (i > 0) vLine(doc, cx, META_Y, META_Y + META_H);

      doc
        .fillColor(C.muted)
        .font("Helvetica")
        .fontSize(7)
        .text(col.label, cx + 8, META_Y + 7, { width: META_CW - 16 });
      doc
        .fillColor(C.text)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(col.value, cx + 8, META_Y + 18, { width: META_CW - 16 });
    });

    const META_BTM = META_Y + META_H;

    /* ══════════════════════════════════════════
       4 — BILL TO  |  ORDER DETAILS  (50/50)
    ══════════════════════════════════════════ */
    const PARTY_Y = META_BTM + 10;
    const PARTY_H = 80;
    const HALF = CW / 2;
    const PHDR = 18; // navy label row height

    // Bill To
    fillRect(doc, ML, PARTY_Y, HALF, PHDR, C.navy);
    strokeBox(doc, ML, PARTY_Y, HALF, PARTY_H);
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("BILL TO", ML + 8, PARTY_Y + 5);
    doc
      .fillColor(C.text)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(invoice.buyer.name, ML + 8, PARTY_Y + PHDR + 6, {
        width: HALF - 16,
      });
    doc
      .fillColor(C.muted)
      .font("Helvetica")
      .fontSize(8)
      .text(invoice.buyer.address ?? "", ML + 8, PARTY_Y + PHDR + 20, {
        width: HALF - 16,
      })
      .text(`Phone: ${invoice.buyer.phone}`, ML + 8, PARTY_Y + PHDR + 50, {
        width: HALF - 16,
      });

    // Order Details
    const OX = ML + HALF;
    fillRect(doc, OX, PARTY_Y, HALF, PHDR, C.navy);
    strokeBox(doc, OX, PARTY_Y, HALF, PARTY_H);
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("ORDER DETAILS", OX + 8, PARTY_Y + 5);

    [
      ["ORDER ID", invoice.orderId],
      ["PLACE OF SUPPLY", invoice.placeOfSupply ?? "West Bengal"],
    ].forEach(([lbl, val], i) => {
      const ry = PARTY_Y + PHDR + 6 + i * 24;
      doc
        .fillColor(C.muted)
        .font("Helvetica")
        .fontSize(7)
        .text(lbl, OX + 8, ry, { width: HALF - 16 });
      doc
        .fillColor(C.text)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(val, OX + 8, ry + 11, { width: HALF - 16 });
    });

    const PARTY_BTM = PARTY_Y + PARTY_H;

    /* ══════════════════════════════════════════
       5 — ITEMS TABLE
    ══════════════════════════════════════════ */
    const TBL_Y = PARTY_BTM + 10;
    const THR_H = 24; // table header row height
    const ROW_H = 26; // item row height

    /*
      Columns — HSN/SAC removed. Widths must sum to CW (≈523.28)
      #(24) | Item(175) | Qty(38) | Rate/Item(80) | Taxable(80) | GST(62) | Amount(64.28)
      24 + 175 + 38 + 80 + 80 + 62 + 64.28 = 523.28 ✓

      Right-aligned numeric cols: pr=8 so ₹ never clips against the column border.
    */
    const COLS = [
      { key: "num", label: "#", w: 24, align: "center" },
      { key: "item", label: "Item / Description", w: 175, align: "left" },
      { key: "qty", label: "Qty", w: 38, align: "center" },
      { key: "rate", label: "Rate/Item", w: 80, align: "right" },
      { key: "taxable", label: "Taxable", w: 80, align: "right" },
      { key: "gst", label: "GST", w: 62, align: "right" },
      { key: "amount", label: "Amount", w: 64.28, align: "right" },
    ];
    // Compute absolute x positions
    let cx = ML;
    COLS.forEach((c) => {
      c.x = cx;
      cx += c.w;
    });

    // Header row background
    fillRect(doc, ML, TBL_Y, CW, THR_H, C.navy);

    // Header labels — right-aligned cols get pl=6,pr=8 for consistent inset
    COLS.forEach((c) => {
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(7.5);
      const isRight = c.align === "right";
      cell(doc, c.label, c.x, TBL_Y + 8, c.w, c.align, {
        pl: isRight ? 4 : 6,
        pr: isRight ? 8 : 3,
      });
    });

    // Header column dividers
    COLS.slice(1).forEach((c) =>
      vLine(doc, c.x, TBL_Y, TBL_Y + THR_H, "#2E4A72", 0.5),
    );

    // Item rows
    let gy = TBL_Y + THR_H;
    let taxableTot = 0;
    let gstTot = 0;

    invoice.items.forEach((item, idx) => {
      const base = item.totalAmount - item.gstAmount;
      const gstPct = item.gstRate ? `(${item.gstRate}%)` : "";
      taxableTot += base;
      gstTot += item.gstAmount;

      // Alternating row fill
      if (idx % 2 === 1) fillRect(doc, ML, gy, CW, ROW_H, C.rowAlt);

      hRule(doc, gy, C.border, ML, CW); // top border of row

      const ROW_DATA = [
        { key: "num", val: String(idx + 1), bold: false },
        { key: "item", val: item.name, bold: false },
        { key: "qty", val: String(item.quantity), bold: false },
        { key: "rate", val: fmt(item.unitPrice), bold: false },
        { key: "taxable", val: fmt(base), bold: false },
        {
          key: "gst",
          val: gstPct
            ? `${fmt(item.gstAmount)}\n${gstPct}`
            : fmt(item.gstAmount),
          bold: false,
        },
        { key: "amount", val: fmt(item.totalAmount), bold: true },
      ];

      ROW_DATA.forEach(({ key, val, bold }) => {
        const col = COLS.find((c) => c.key === key);
        const twoLine = key === "gst" && gstPct;
        const ty = gy + (twoLine ? 4 : 8);
        const isRight = col.align === "right";
        doc
          .fillColor(C.text)
          .font(bold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(8.5);
        // pl=6 left-pad, pr=8 right-pad for numeric cols — keeps ₹ fully visible
        cell(doc, val, col.x, ty, col.w, col.align, {
          pl: isRight ? 4 : 6,
          pr: isRight ? 8 : 3,
        });
      });

      // Column dividers in row
      COLS.slice(1).forEach((c) => vLine(doc, c.x, gy, gy + ROW_H));

      gy += ROW_H;
    });

    hRule(doc, gy, C.navy, ML, CW, 0.8); // bold bottom border
    strokeBox(doc, ML, TBL_Y, CW, gy - TBL_Y); // outer box

    /* ══════════════════════════════════════════
       6 — SUMMARY BLOCK  (right side)
    ══════════════════════════════════════════ */
    const SUM_TOP = gy + 10;
    const SUM_W = 222;
    const SUM_X = ML + CW - SUM_W; // right-flush with table
    const SUM_LW = SUM_W * 0.56; // label column width
    const SUM_VW = SUM_W - SUM_LW; // value column width
    const SRH = 22;

    const grandTotal = invoice.totalAmount;
    const paid = invoice.paidAmount ?? 0;
    const due = grandTotal - paid;

    const SUMMARY_ROWS = [
      {
        label: "Taxable Amount",
        val: fmt(taxableTot),
        dark: false,
        bold: false,
      },
      { label: "IGST / GST", val: fmt(gstTot), dark: false, bold: false },
      { label: "Grand Total", val: fmt(grandTotal), dark: true, bold: true },
      {
        label: "Amount Paid",
        val: fmt(paid),
        dark: false,
        bold: false,
        vc: C.green,
      },
      {
        label: "Amount Due",
        val: fmt(due),
        dark: false,
        bold: true,
        vc: due > 0 ? C.red : C.green,
      },
    ];

    let sy = SUM_TOP;
    SUMMARY_ROWS.forEach((row) => {
      if (row.dark) fillRect(doc, SUM_X, sy, SUM_W, SRH, C.navy);

      // Label
      doc
        .fillColor(row.dark ? C.white : C.muted)
        .font("Helvetica")
        .fontSize(8.5)
        .text(row.label, SUM_X + 8, sy + 6, { width: SUM_LW - 10 });

      // Value — right-aligned in value column
      doc
        .fillColor(row.vc ?? (row.dark ? C.white : C.text))
        .font(row.bold ? "Helvetica-Bold" : "Helvetica")
        .fontSize(row.bold ? 9.5 : 8.5)
        .text(row.val, SUM_X + SUM_LW, sy + (row.bold ? 5 : 6), {
          width: SUM_VW - 8,
          align: "right",
        });

      hRule(doc, sy + SRH, row.dark ? "#2E4A72" : C.border, SUM_X, SUM_W, 0.5);
      sy += SRH;
    });

    strokeBox(doc, SUM_X, SUM_TOP, SUM_W, sy - SUM_TOP);
    vLine(doc, SUM_X + SUM_LW, SUM_TOP, sy); // label/value divider

    // Amount in words — fills space left of summary
    doc
      .fillColor(C.muted)
      .font("Helvetica-Oblique")
      .fontSize(7.5)
      .text(
        `Total (in words): INR ${numberToWords(Math.round(grandTotal))} Only.`,
        ML,
        SUM_TOP + 6,
        { width: SUM_X - ML - 10, lineGap: 2 },
      );

    /* ══════════════════════════════════════════
       7 — BANK  |  QR  |  SIGNATURE  (3 cols)
    ══════════════════════════════════════════ */
    const BOT_Y = sy + 18;
    const BOT_H = 100;
    const COL3W = CW / 3; // ≈ 174.4 pt
    const BHDR = 18; // navy label row height

    const BK_X = ML;
    const QR_X2 = ML + COL3W;
    const SG_X = ML + COL3W * 2;

    /* Bank Details */
    fillRect(doc, BK_X, BOT_Y, COL3W, BHDR, C.navy);
    strokeBox(doc, BK_X, BOT_Y, COL3W, BOT_H);
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("BANK DETAILS", BK_X + 8, BOT_Y + 5);

    [
      ["Bank", "YES BANK"],
      ["A/C #", invoice.bankAccount ?? "1234567890"],
      ["IFSC", invoice.ifsc ?? "YESB0000123"],
      ["Branch", invoice.branch ?? "Kolkata"],
    ].forEach(([lbl, val], i) => {
      const by = BOT_Y + BHDR + 8 + i * 18;
      doc
        .fillColor(C.muted)
        .font("Helvetica")
        .fontSize(7.5)
        .text(lbl, BK_X + 8, by, { width: 34 });
      doc
        .fillColor(C.text)
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text(val, BK_X + 48, by, { width: COL3W - 56 });
    });

    /* QR Code */
    fillRect(doc, QR_X2, BOT_Y, COL3W, BHDR, C.navy);
    strokeBox(doc, QR_X2, BOT_Y, COL3W, BOT_H);
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("PAY USING UPI", QR_X2 + 8, BOT_Y + 5);

    if (qr) {
      const QR_SZ = 66;
      const qrCX = QR_X2 + (COL3W - QR_SZ) / 2;
      const qrCY = BOT_Y + BHDR + (BOT_H - BHDR - QR_SZ - 14) / 2;
      doc.image(qr, qrCX, qrCY, { width: QR_SZ, height: QR_SZ });
      doc
        .fillColor(C.muted)
        .font("Helvetica")
        .fontSize(7)
        .text("Scan to Pay", QR_X2, qrCY + QR_SZ + 4, {
          width: COL3W,
          align: "center",
        });
    }

    /* Signature */
    fillRect(doc, SG_X, BOT_Y, COL3W, BHDR, C.navy);
    strokeBox(doc, SG_X, BOT_Y, COL3W, BOT_H);
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text("FOR BENGOL SPICES PVT LTD", SG_X + 6, BOT_Y + 5, {
        width: COL3W - 12,
      });

    // Watermark stamp text
    doc
      .save()
      .fillColor("#C8D4E3")
      .font("Helvetica-Bold")
      .fontSize(18)
      .opacity(0.15)
      .text("AUTHORISED", SG_X + 4, BOT_Y + BHDR + 18, {
        width: COL3W - 8,
        align: "center",
      })
      .restore();

    doc
      .fillColor(C.muted)
      .font("Helvetica")
      .fontSize(8)
      .text("Authorized Signatory", SG_X, BOT_Y + BOT_H - 16, {
        width: COL3W,
        align: "center",
      });

    /* ══════════════════════════════════════════
       8 — TERMS & CONDITIONS
    ══════════════════════════════════════════ */
    const TERMS_Y = BOT_Y + BOT_H + 10;
    const TERMS_H = 50;

    fillRect(doc, ML, TERMS_Y, CW, TERMS_H, C.offWhite);
    strokeBox(doc, ML, TERMS_Y, CW, TERMS_H, C.border, 0.6);
    hRule(doc, TERMS_Y + 18, C.border, ML, CW, 0.5);

    doc
      .fillColor(C.navy)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("TERMS & CONDITIONS", ML + 8, TERMS_Y + 5);

    doc
      .fillColor(C.muted)
      .font("Helvetica")
      .fontSize(7.5)
      .text(
        "1. Goods once sold will not be taken back or exchanged.   " +
          "2. Payment due within the specified period; late payments attract 18% p.a. interest.   " +
          "3. Subject to local jurisdiction. This is a computer-generated invoice.",
        ML + 8,
        TERMS_Y + 24,
        { width: CW - 16, lineGap: 1.5 },
      );

    /* ══════════════════════════════════════════
       9 — FOOTER BAND
    ══════════════════════════════════════════ */
    const FOOTER_Y = H - 30;
    fillRect(doc, 0, FOOTER_Y, W, 30, C.navy);

    doc
      .fillColor("#8AA0BC")
      .font("Helvetica")
      .fontSize(7.5)
      .text(
        "Bengol Spices Pvt Ltd  •  support@bengolspices.com  •  +91 9831431018",
        0,
        FOOTER_Y + 6,
        { align: "center", width: W },
      )
      .text("Thank you for your business!", 0, FOOTER_Y + 17, {
        align: "center",
        width: W,
      });

    doc
      .fillColor("#8AA0BC")
      .font("Helvetica")
      .fontSize(7)
      .text("Page 1 / 1", W - MR - 38, FOOTER_Y + 11);

    doc.end();
  });
};

/* ─────────────────────────────────────────────
   UTILITY — Indian number-to-words
───────────────────────────────────────────── */
function numberToWords(n) {
  if (!n || n === 0) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const below1000 = (x) => {
    if (x < 20) return ones[x];
    if (x < 100)
      return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
    return (
      ones[Math.floor(x / 100)] +
      " Hundred" +
      (x % 100 ? " " + below1000(x % 100) : "")
    );
  };

  let res = "";
  if (n >= 10000000) {
    res += below1000(Math.floor(n / 10000000)) + " Crore ";
    n %= 10000000;
  }
  if (n >= 100000) {
    res += below1000(Math.floor(n / 100000)) + " Lakh ";
    n %= 100000;
  }
  if (n >= 1000) {
    res += below1000(Math.floor(n / 1000)) + " Thousand ";
    n %= 1000;
  }
  if (n > 0) {
    res += below1000(n);
  }
  return res.trim();
}
