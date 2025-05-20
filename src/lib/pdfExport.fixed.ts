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
    startY: 40,
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
const addSpellDetails = (doc: jsPDF, spell: Spell, isSecondSpell = false) => {
  if (!isSecondSpell) {
    doc.addPage();
    
    // Add a vertical separator line in the middle of the page
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(doc.internal.pageSize.width / 2, 5, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5);
  }
  
  // Calculate all positioning parameters
  const pageWidth = doc.internal.pageSize.width;
  const halfWidth = pageWidth / 2;
  const margin = 5;
  const padding = 9;
  
  // Coordinates for the left or right side of the page
  const leftX = margin;
  const rightX = halfWidth + margin;
  const contentWidth = halfWidth - (margin * 2);
  
  // Select the appropriate side based on isSecondSpell
  const borderX = isSecondSpell ? rightX : leftX;
  const contentX = isSecondSpell ? rightX + padding : leftX + padding;
  const labelX = contentX;
  const valueX = contentX + 36; // Fixed distance between label and value
  
  // Add a fancy border to the spell area
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.rect(borderX, margin, contentWidth, doc.internal.pageSize.height - (margin * 2));
  
  // Title with background
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(spell.spellName || 'Spell', contentX, 20);
  
  // Underline
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(contentX, 22, borderX + contentWidth - padding, 22);
  
  // Class and school
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${spell.spellClass} - ${spell.school}`, contentX, 30);
  
  // Details section
  const detailsY = 40;
  const lineHeight = 6;
  const boxX = borderX + margin;
  const boxWidth = contentWidth - (margin * 2);
  
  // Add details background box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(250, 250, 250);
  doc.setLineWidth(0.3);
  doc.roundedRect(boxX, 35, boxWidth, lineHeight * 8.5, 3, 3, 'FD');
  
  // Draw all the spell attributes
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Complexity:', labelX, detailsY);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.complexity || ''), valueX, detailsY);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Flare:', labelX, detailsY + lineHeight);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.flare || ''), valueX, detailsY + lineHeight);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Range:', labelX, detailsY + lineHeight * 2);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.range || ''), valueX, detailsY + lineHeight * 2);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Target:', labelX, detailsY + lineHeight * 3);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.target || ''), valueX, detailsY + lineHeight * 3);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Action:', labelX, detailsY + lineHeight * 4);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.action || ''), valueX, detailsY + lineHeight * 4);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Duration:', labelX, detailsY + lineHeight * 5);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.duration || ''), valueX, detailsY + lineHeight * 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Keywords:', labelX, detailsY + lineHeight * 6);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.keywords || ''), valueX, detailsY + lineHeight * 6);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Check:', labelX, detailsY + lineHeight * 7);
  doc.setFont('helvetica', 'normal');
  doc.text(String(spell.check || ''), valueX, detailsY + lineHeight * 7);
  
  // Description section
  doc.setFont('helvetica', 'bold');
  doc.text('Description:', labelX, detailsY + lineHeight * 9);
  doc.setFont('helvetica', 'normal');
  
  // Add a light background to the description
  const maxDescWidth = boxWidth - (margin * 2);
  const splitDescription = doc.splitTextToSize(String(spell.description || ''), maxDescWidth);
  const descriptionHeight = splitDescription.length * 5;
  
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(boxX, detailsY + lineHeight * 9.5, boxWidth, descriptionHeight + 5, 2, 2, 'FD');
  
  doc.text(splitDescription, labelX, detailsY + lineHeight * 10);
  
  // Alt Description if it exists
  if (spell.altDescription && spell.altDescription !== '-' && spell.altDescription !== 'null') {
    const descriptionEndY = detailsY + lineHeight * 10 + descriptionHeight;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Alternative Description:', labelX, descriptionEndY + lineHeight);
    doc.setFont('helvetica', 'normal');
    
    const splitAltDescription = doc.splitTextToSize(String(spell.altDescription), maxDescWidth);
    const altDescriptionHeight = splitAltDescription.length * 5;
    
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(boxX, descriptionEndY + lineHeight * 1.5, boxWidth, altDescriptionHeight + 5, 2, 2, 'FD');
    
    doc.text(splitAltDescription, labelX, descriptionEndY + lineHeight * 2);
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
  
  // Add a header with title
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(0, 30, doc.internal.pageSize.width, 30);
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('SAGA Spells', 14, 20);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total: ${spells.length} spells`, 14, 40);
  
  // Add the current date
  const today = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${today}`, doc.internal.pageSize.width - 60, 40);
  
  // Summary table
  formatSpellsTable(doc, spells);
  
  // Create table of contents
  doc.addPage();
  
  // Add TOC header
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(0, 30, doc.internal.pageSize.width, 30);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Table of Contents', 14, 20);
  
  // Content
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Create TOC entries
  let yPos = 40;
  const lineHeight = 7;
  
  // Add header row
  doc.setFont('helvetica', 'bold');
  doc.text('Spell Name', 14, yPos);
  doc.text('Class', 100, yPos);
  doc.text('School', 140, yPos);
  doc.text('Page', doc.internal.pageSize.width - 25, yPos);
  
  // Add a line under headers
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);
  
  // Reset to normal text
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight * 2;
  
  // Create alternating row colors
  let isAlternateRow = false;
  
  spells.forEach((spell, index) => {
    // Add a new page if needed
    if (yPos > doc.internal.pageSize.height - 20) {
      doc.addPage();
      
      // Add continuation header
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(0, 30, doc.internal.pageSize.width, 30);
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Table of Contents (continued)', 14, 20);
      
      // Reset position and styling
      yPos = 40;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      // Add header row
      doc.setFont('helvetica', 'bold');
      doc.text('Spell Name', 14, yPos);
      doc.text('Class', 100, yPos);
      doc.text('School', 140, yPos);
      doc.text('Page', doc.internal.pageSize.width - 25, yPos);
      
      // Add a line under headers
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);
      
      // Reset to normal text
      doc.setFont('helvetica', 'normal');
      yPos += lineHeight * 2;
      isAlternateRow = false;
    }
    
    // Add alternating row background
    if (isAlternateRow) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, yPos - 5, doc.internal.pageSize.width - 28, lineHeight, 'F');
    }
    isAlternateRow = !isAlternateRow;
    
    // Calculate the page number based on two spells per page
    const pageNum = Math.floor(index / 2) + 3; // Summary page + TOC + index, with 2 spells per page
    
    // Spell name with dots
    doc.text(spell.spellName, 14, yPos);
    
    // Spell class and school
    doc.text(spell.spellClass, 100, yPos);
    doc.text(spell.school, 140, yPos);
    
    // Page number
    doc.text(String(pageNum), doc.internal.pageSize.width - 25, yPos);
    
    yPos += lineHeight;
  });
  
  // Detailed spell descriptions - two spells per page
  for (let i = 0; i < spells.length; i += 2) {
    if (i + 1 < spells.length) {
      // Add two spells per page when possible
      addSpellDetails(doc, spells[i], false);
      addSpellDetails(doc, spells[i+1], true);
    } else {
      // Add single spell if we have an odd number
      addSpellDetails(doc, spells[i], false);
    }
  }
  
  // Add page numbers to all pages
  const pageCount = doc.internal.pages.length;
  
  // Loop through each page to add headers and footers
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Header
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('SAGA Spells', 14, 10);
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    
    // Current date in footer
    doc.text(today, 14, doc.internal.pageSize.height - 10);
  }
  
  // Save the PDF
  doc.save('saga-spells.pdf');
};

// Add a cover page for the spellbook
const addSpellbookCoverPage = (doc: jsPDF, spellbook: Spellbook) => {
  // Center point
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add a decorative border
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.7);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40);
  
  // Add inner border
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.rect(25, 25, pageWidth - 50, pageHeight - 50);
  
  // Add a header line
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(1);
  doc.line(30, 45, pageWidth - 30, 45);
  
  // Add a footer line
  doc.line(30, pageHeight - 45, pageWidth - 30, pageHeight - 45);
  
  // Title
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  const titleWidth = doc.getTextWidth(spellbook.name);
  doc.text(spellbook.name, (pageWidth - titleWidth) / 2, 80);
  
  // Subtitle - Character
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  const characterText = `Character: ${spellbook.character}`;
  const characterWidth = doc.getTextWidth(characterText);
  doc.text(characterText, (pageWidth - characterWidth) / 2, 100);
  
  // Description with fancy box
  if (spellbook.description) {
    // Calculate description box size
    doc.setFontSize(12);
    const splitDescription = doc.splitTextToSize(spellbook.description, 160);
    const descriptionHeight = splitDescription.length * 5 + 10;
    
    // Draw description box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(
      (pageWidth - 170) / 2, 
      110, 
      170, 
      descriptionHeight, 
      3, 
      3, 
      'FD'
    );
    
    // Add description text
    doc.text(splitDescription, (pageWidth - 160) / 2, 120);
  }
  
  // Spell count
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const spellCountText = `Contains ${spellbook.spells.length} spells`;
  const spellCountWidth = doc.getTextWidth(spellCountText);
  
  // Draw a badge for spell count
  const badgeWidth = spellCountWidth + 20;
  const badgeHeight = 10;
  const badgeX = (pageWidth - badgeWidth) / 2;
  const badgeY = 160;
  
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(180, 180, 180);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 5, 5, 'FD');
  
  doc.text(spellCountText, (pageWidth - spellCountWidth) / 2, badgeY + 7);
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  const dateText = `Generated on ${new Date().toLocaleDateString()}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, (pageWidth - dateWidth) / 2, pageHeight - 30);
};

// Create a table of contents for the spellbook
const addTableOfContents = (doc: jsPDF, spells: Spell[]) => {
  doc.addPage();
  
  // Add a header with title
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(0, 30, doc.internal.pageSize.width, 30);
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Table of Contents', 14, 20);
  
  // Content
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Create TOC entries
  let yPos = 40;
  const lineHeight = 7;
  
  // Add header row
  doc.setFont('helvetica', 'bold');
  doc.text('Spell Name', 14, yPos);
  doc.text('Class', 100, yPos);
  doc.text('School', 140, yPos);
  doc.text('Page', doc.internal.pageSize.width - 25, yPos);
  
  // Add a line under headers
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);
  
  // Reset to normal text
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight * 2;
  
  // Create alternating row colors
  let isAlternateRow = false;
  
  spells.forEach((spell, index) => {
    // Add a new page if needed
    if (yPos > doc.internal.pageSize.height - 20) {
      doc.addPage();
      
      // Add continuation header
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(0, 30, doc.internal.pageSize.width, 30);
      
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Table of Contents (continued)', 14, 20);
      
      // Reset position and styling
      yPos = 40;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      // Add header row
      doc.setFont('helvetica', 'bold');
      doc.text('Spell Name', 14, yPos);
      doc.text('Class', 100, yPos);
      doc.text('School', 140, yPos);
      doc.text('Page', doc.internal.pageSize.width - 25, yPos);
      
      // Add a line under headers
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);
      
      // Reset to normal text
      doc.setFont('helvetica', 'normal');
      yPos += lineHeight * 2;
      isAlternateRow = false;
    }
    
    // Add alternating row background
    if (isAlternateRow) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, yPos - 5, doc.internal.pageSize.width - 28, lineHeight, 'F');
    }
    isAlternateRow = !isAlternateRow;
    
    // Calculate the page number based on two spells per page
    const pageNum = Math.floor(index / 2) + 3; // Cover page + TOC + index, with 2 spells per page
    
    // Spell name with dots
    doc.text(spell.spellName, 14, yPos);
    
    // Spell class and school
    doc.text(spell.spellClass, 100, yPos);
    doc.text(spell.school, 140, yPos);
    
    // Page number
    doc.text(String(pageNum), doc.internal.pageSize.width - 25, yPos);
    
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
  
  // Add a header with title
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(0, 30, doc.internal.pageSize.width, 30);
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Spells Summary', 14, 20);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total: ${spellbook.spells.length} spells`, 14, 40);
  
  // Summary table
  formatSpellsTable(doc, spellbook.spells);
  
  // Detailed spell descriptions - two spells per page
  for (let i = 0; i < spellbook.spells.length; i += 2) {
    if (i + 1 < spellbook.spells.length) {
      // Add two spells per page when possible
      addSpellDetails(doc, spellbook.spells[i], false);
      addSpellDetails(doc, spellbook.spells[i+1], true);
    } else {
      // Add single spell if we have an odd number
      addSpellDetails(doc, spellbook.spells[i], false);
    }
  }
  
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
    doc.text(`Page ${i - 1} of ${pageCount - 1}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    
    // Current date
    const today = new Date().toLocaleDateString();
    doc.text(today, 14, doc.internal.pageSize.height - 10);
  }
  
  // Save the PDF
  const filename = `${spellbook.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
  
  return filename;
};
