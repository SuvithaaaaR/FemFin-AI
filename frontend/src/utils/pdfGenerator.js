import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const primaryPink = [236, 72, 153];
const primaryPurple = [168, 85, 247];

const drawHeader = (doc, title, index, total) => {
  doc.setFillColor(...primaryPink);
  doc.rect(0, 0, 210, 18, "F");
  doc.setFillColor(...primaryPurple);
  doc.rect(0, 18, 210, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, 14, 12);
  doc.setFontSize(10);
  doc.text(`Slide ${index}/${total}`, 178, 12);
  doc.setTextColor(70, 70, 70);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "Investor-grade narrative for women entrepreneur funding readiness",
    14,
    28,
  );
};

const drawFooter = (doc, companyName) => {
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${companyName} | Investor Pitch Deck`, 14, 290);
  doc.text("Generated via FemFin AI", 160, 290);
};

const drawBody = (doc, points) => {
  doc.setFillColor(252, 243, 250);
  doc.roundedRect(12, 34, 186, 18, 2, 2, "F");
  doc.setDrawColor(...primaryPurple);
  doc.setLineWidth(0.3);
  doc.line(12, 52, 198, 52);

  doc.setTextColor(90, 40, 120);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Executive takeaway", 16, 41);

  doc.setTextColor(35, 35, 35);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const summary = doc.splitTextToSize(points[0] || "", 176);
  doc.text(summary, 16, 47);

  doc.setTextColor(35, 35, 35);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let y = 60;
  points.slice(1).forEach((point) => {
    const wrapped = doc.splitTextToSize(`- ${point}`, 180);
    doc.text(wrapped, 14, y);
    y += wrapped.length * 6 + 2;
  });
};

export const generatePitchDeckPdf = ({
  companyName,
  slides,
  financialTable,
  fileName,
  preview = false,
}) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  slides.forEach((slide, idx) => {
    if (idx > 0) {
      doc.addPage();
    }

    drawHeader(doc, slide.title, idx + 1, slides.length);
    drawBody(doc, slide.points || []);

    if (slide.title === "Financials" && financialTable?.length) {
      autoTable(doc, {
        startY: 95,
        head: [["Year", "Projected Revenue"]],
        body: financialTable,
        styles: {
          font: "helvetica",
          fontSize: 11,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: primaryPurple,
        },
      });
    }

    drawFooter(doc, companyName);
  });

  if (preview) {
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    return;
  }

  doc.save(fileName || `${companyName}-Pitch-Deck.pdf`);
};
