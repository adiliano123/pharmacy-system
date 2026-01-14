import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateReceipt = (sale) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(44, 62, 80);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("PHARMACY RECEIPT", 105, 20, { align: "center" });
  
  // Business Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("City Central Pharmacy & Wellness", 15, 45);
  doc.text(`Transaction ID: #PH-00${sale.id}`, 15, 52);
  doc.text(`Date: ${new Date(sale.sale_date).toLocaleString()}`, 15, 59);

  // Table
  doc.autoTable({
    startY: 70,
    head: [['Medicine Name', 'Batch', 'Qty', 'Unit Price', 'Total']],
    body: [
      [
        sale.name, 
        sale.batch_number, 
        sale.quantity_sold, 
        `${(sale.total_revenue / sale.quantity_sold).toFixed(2)}`, 
        `${parseFloat(sale.total_revenue).toFixed(2)}`
      ]
    ],
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] }
  });

  // Footer
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: ${parseFloat(sale.total_revenue).toFixed(2)}`, 140, finalY + 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your visit. Get well soon!", 105, finalY + 40, { align: "center" });
  
  doc.save(`Receipt_${sale.id}.pdf`);
};
