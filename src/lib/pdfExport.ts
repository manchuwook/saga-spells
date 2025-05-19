import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Spell } from '../models/spells.zod';
import { Spellbook } from '../context/SpellbooksContext';

// Helper function to create a formatted spell table for PDF
const formatSpellsTable = (doc: jsPDF, spells: Spell[]) => {
  const tableColumns = [
    { header: 'Name', dataKey: 'spellName' },
    { header: 'Class', dataKey: 'spellClass' },
    { header: 'School', dataKey: 'school' },
    { header: 'Complexity', dataKey: 'complexity' },
    { header: 'Flare', dataKey: 'flare' },
    { header: 'Range', dataKey: 'range' },
    { header: 'Target', dataKey: 'target' },
    { header: 'Action', dataKey: 'action' },
    { header: 'Duration', dataKey: 'duration' },
  ];

  const tableRows = spells.map(spell => ({
    spellName: spell.spellName || '',
    spellClass: spell.spellClass || '',
    school: spell.school || '',
    complexity: spell.complexity || '',
    flare: spell.flare || '',
    range: spell.range || '',
    target: spell.target || '',
    action: spell.action || '',
    duration: spell.duration || '',
  }));

  autoTable(doc, {
    columns: tableColumns,
    body: tableRows,
    startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 40,
    margin: { top: 10 },
    styles: { cellPadding: 2, fontSize: 9 },
    columnStyles: { 
      0: { cellWidth: 40 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 15 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
    },
  });
};

// Function to add spell details to PDF
const addSpellDetails = (doc: jsPDF, spell: Spell) => {
  doc.addPage();
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(spell.spellName || 'Spell', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${spell.spellClass} - ${spell.school}`, 14, 30);
  
  const detailsY = 40;
  const lineHeight = 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Complexity:', 14, detailsY);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.complexity || ''), 50, detailsY);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Flare:', 14, detailsY + lineHeight);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.flare || ''), 50, detailsY + lineHeight);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Range:', 14, detailsY + lineHeight * 2);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.range || ''), 50, detailsY + lineHeight * 2);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Target:', 14, detailsY + lineHeight * 3);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.target || ''), 50, detailsY + lineHeight * 3);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Action:', 14, detailsY + lineHeight * 4);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.action || ''), 50, detailsY + lineHeight * 4);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Duration:', 14, detailsY + lineHeight * 5);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.duration || ''), 50, detailsY + lineHeight * 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Keywords:', 14, detailsY + lineHeight * 6);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.keywords || ''), 50, detailsY + lineHeight * 6);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Check:', 14, detailsY + lineHeight * 7);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.check || ''), 50, detailsY + lineHeight * 7);
  
  // Description with text wrapping
  doc.setFont('helvetica', 'bold');
  doc.text('Description:', 14, detailsY + lineHeight * 9);
  doc.setFont('helvetica', 'normal');
  
  const splitDescription = doc.splitTextToSize(String(spell.description || ''), 180);
  doc.text(splitDescription, 14, detailsY + lineHeight * 10);
  
  // Alt Description if it exists
  if (spell.altDescription && spell.altDescription !== '-' && spell.altDescription !== 'null') {
    const descriptionEndY = detailsY + lineHeight * 10 + splitDescription.length * 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Alternative Description:', 14, descriptionEndY + lineHeight);
    doc.setFont('helvetica', 'normal');
    
    const splitAltDescription = doc.splitTextToSize(String(spell.altDescription), 180);
    doc.text(splitAltDescription, 14, descriptionEndY + lineHeight * 2);
  }
};

// Export all filtered spells to PDF
export const exportSpellsToPDF = (spells: Spell[]) => {
  if (!spells.length) return;
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SAGA Spells', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total: ${spells.length} spells`, 14, 30);
  
  // Summary table
  formatSpellsTable(doc, spells);
  
  // Detailed spell descriptions on separate pages
  spells.forEach((spell, index) => {
    addSpellDetails(doc, spell);
    
    // Add page number at the bottom of each detail page
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${index + 2} of ${spells.length + 1}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    
    // Add spell name as header
    doc.text('SAGA Spells', 14, 10);
  });
  
  // Save the PDF
  doc.save('saga-spells.pdf');
};

// Add page header and footer
// Helper function for adding headers and footers to PDF pages (currently unused but kept for future use)
// @ts-ignore - This function is not currently used but kept for future use
const addHeaderAndFooter = (doc: jsPDF, pageInfo: { pageNumber: number, pageCount: number }, title: string) => {
  // Header
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(title, 14, 10);
  
  // Footer with page numbers
  doc.setFontSize(8);
  doc.text(`Page ${pageInfo.pageNumber} of ${pageInfo.pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
  
  // Current date
  const today = new Date();
  const dateStr = today.toLocaleDateString();
  doc.text(dateStr, 14, doc.internal.pageSize.height - 10);
};

// Add a cover page for the spellbook
const addSpellbookCoverPage = (doc: jsPDF, spellbook: Spellbook) => {
  // Center point
  const pageWidth = doc.internal.pageSize.width;
  
  // Title
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  const titleWidth = doc.getTextWidth(spellbook.name);
  doc.text(spellbook.name, (pageWidth - titleWidth) / 2, 80);
  
  // Subtitle - Character
  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  const characterText = `Character: ${spellbook.character}`;
  const characterWidth = doc.getTextWidth(characterText);
  doc.text(characterText, (pageWidth - characterWidth) / 2, 100);
  
  // Description
  if (spellbook.description) {
    doc.setFontSize(12);
    const splitDescription = doc.splitTextToSize(spellbook.description, 160);
    doc.text(splitDescription, (pageWidth - 160) / 2, 120);
  }
  
  // Spell count
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const spellCountText = `Contains ${spellbook.spells.length} spells`;
  const spellCountWidth = doc.getTextWidth(spellCountText);
  doc.text(spellCountText, (pageWidth - spellCountWidth) / 2, 160);
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const dateText = `Generated on ${new Date().toLocaleDateString()}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, (pageWidth - dateWidth) / 2, 180);
};

// Create a table of contents for the spellbook
const addTableOfContents = (doc: jsPDF, spells: Spell[]) => {
  doc.addPage();
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Create TOC entries
  let yPos = 40;
  const lineHeight = 7;
  
  spells.forEach((spell, index) => {
    // Add a new page if needed
    if (yPos > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPos = 20;
    }
    
    const pageNum = index + 3; // Cover page + TOC + index
    doc.text(spell.spellName, 14, yPos);
    
    // Add dots between name and page number
    const nameWidth = doc.getTextWidth(spell.spellName);
    const pageNumWidth = doc.getTextWidth(String(pageNum));
    const dotsWidth = doc.internal.pageSize.width - 20 - nameWidth - pageNumWidth;
    
    let dots = '';
    const dotWidth = doc.getTextWidth('.');
    const numDots = Math.floor(dotsWidth / dotWidth);
    for (let i = 0; i < numDots; i++) {
      dots += '.';
    }
    
    doc.text(dots, 14 + nameWidth, yPos);
    doc.text(String(pageNum), doc.internal.pageSize.width - 14 - pageNumWidth, yPos);
    
    yPos += lineHeight;
  });
  
  return doc;
};

// Export a spellbook to PDF
export const exportSpellbookToPDF = (spellbook: Spellbook) => {
  if (!spellbook) return;
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add cover page
  addSpellbookCoverPage(doc, spellbook);
  
  // Add table of contents
  addTableOfContents(doc, spellbook.spells);
  
  // Add summary page
  doc.addPage();
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Spells Summary', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total: ${spellbook.spells.length} spells`, 14, 30);
  
  // Summary table
  formatSpellsTable(doc, spellbook.spells);
  
  // Detailed spell descriptions on separate pages
  spellbook.spells.forEach(spell => {
    addSpellDetails(doc, spell);
  });
  
  // Add page numbers to all pages (except cover)
  const pageCount = doc.internal.pages.length - 1;
  
  // Loop through each page to add headers and footers
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Header
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(spellbook.name, 14, 10);
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Page ${i - 1} of ${pageCount - 1}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    
    // Current date
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    doc.text(dateStr, 14, doc.internal.pageSize.height - 10);
  }
  
  // Save the PDF
  doc.save(`${spellbook.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};
