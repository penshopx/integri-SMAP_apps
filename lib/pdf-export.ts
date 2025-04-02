// lib/pdf-export.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Document } from '@/types/document';
import { Assessment } from '@/types/assessment';
import { Audit } from '@/types/audit';

export function exportDocumentToPdf(document: Document) {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('IntegriGuide - Dokumen SMAP', 105, 15, { align: 'center' });
  
  // Add document info
  doc.setFontSize(14);
  doc.text(`${document.title}`, 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Tipe: ${document.type}`, 20, 45);
  doc.text(`Status: ${document.status}`, 20, 52);
  doc.text(`Versi: ${document.currentVersion}`, 20, 59);
  doc.text(`Terakhir diperbarui: ${new Date(document.lastUpdated).toLocaleDateString('id-ID')}`, 20, 66);
  
  // Add content
  doc.setFontSize(12);
  doc.text('Konten Dokumen:', 20, 80);
  
  const splitContent = doc.splitTextToSize(document.content, 170);
  doc.text(splitContent, 20, 90);
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Halaman ${i} dari ${pageCount} - Dicetak pada ${new Date().toLocaleString('id-ID')}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`${document.title.replace(/\s+/g, '_')}.pdf`);
}

export function exportAssessmentToPdf(assessment: Assessment) {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('IntegriGuide - Laporan Assessment', 105, 15, { align: 'center' });
  
  // Add assessment info
  doc.setFontSize(14);
  doc.text(`Assessment: ${assessment.title}`, 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Tanggal: ${new Date(assessment.date).toLocaleDateString('id-ID')}`, 20, 45);
  doc.text(`Dilakukan oleh: ${assessment.conductedBy}`, 20, 52);
  doc.text(`Skor Kepatuhan: ${assessment.complianceScore}%`, 20, 59);
  
  // Add results table
  doc.setFontSize(12);
  doc.text('Hasil per Klausul:', 20, 75);
  
  // @ts-ignore
  doc.autoTable({
    startY: 80,
    head: [['Klausul', 'Skor', 'Keterangan']],
    body: assessment.results.map(result => [
      result.clause,
      `${result.score}%`,
      result.notes || '-'
    ]),
  });
  
  // Add findings
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Temuan dan Rekomendasi:', 20, finalY);
  
  // @ts-ignore
  doc.autoTable({
    startY: finalY + 5,
    head: [['Temuan', 'Prioritas', 'Rekomendasi']],
    body: assessment.findings.map(finding => [
      finding.description,
      finding.priority,
      finding.recommendation || '-'
    ]),
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Halaman ${i} dari ${pageCount} - Dicetak pada ${new Date().toLocaleString('id-ID')}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`Assessment_${assessment.title.replace(/\s+/g, '_')}.pdf`);
}