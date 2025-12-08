import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logomark from '@/assets/logo/logomark.svg';


// Color palette
const COLOR_BLUE = '#084579'; // main blue
const toRgb = (hex: string) => {
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  return [r, g, b];
};

const mandatoryBreakdown = {
  limpieza: { name: 'Limpieza', price: 300.0, description: 'Antes y después del alquiler' },
  seguridad: { name: 'Seguridad', price: 200.0, description: 'Durante el evento' },
  serviciosBaño: { name: 'Servicios de baño', price: 150.0, description: 'Limpieza durante, más papel, jabón, etc.' },
  garantia: { name: 'Garantía', price: 1000.0, description: 'Reembolsable si no hay daños' },
};

export async function generateReservationPdf(options: {
  reservationDetails: any,
  paymentMethod?: any,
  selectedFurniture?: Record<string, number>,
  furnitureList?: any[],
  approvalCode?: string,
  includePaymentDetails?: boolean,
}) {
  const { reservationDetails, paymentMethod, selectedFurniture = {}, furnitureList = [], approvalCode, includePaymentDetails = true } = options;

  // Load logo and convert to PNG data URL
  let logoDataUrl: string | null = null;
  try {
    const resp = await fetch(logomark);
    const svgText = await resp.text();
    const svg64 = btoa(unescape(encodeURIComponent(svgText)));
    const imageSrc = `data:image/svg+xml;base64,${svg64}`;
    const img = new Image();
    img.src = imageSrc;
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    const canvas = document.createElement('canvas');
    canvas.width = img.width || 100;
    canvas.height = img.height || 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      logoDataUrl = canvas.toDataURL('image/png');
    }
  } catch (e) {
    // ignore
    // console.warn('Logo load failed', e);
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 40;

  // Header background
  const [r, g, b] = toRgb(COLOR_BLUE);
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Logo and title (smaller logo)
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', margin, 18, 36, 36);
  }
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Constancia de Reserva', margin + (logoDataUrl ? 56 : 0), 38);
  doc.setFontSize(10);
  doc.text('Lumina Eventos', margin + (logoDataUrl ? 56 : 0), 56);

  // Increase starting Y so reservation/client data and tables start lower on the page
  y = 120;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);

  // Left column: reservation/customer details
  const leftX = margin;
  const rightX = pageWidth / 2 + 10;
  const lineHeight = 16;
  const writeLabelValue = (xLabel: number, xValue: number, label: string, value: string) => {
    // label in blue, value in black
    const [br, bg, bb] = toRgb(COLOR_BLUE);
    doc.setTextColor(br, bg, bb);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, xLabel, y);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    // wrap value if long
    const split = doc.splitTextToSize(value, pageWidth - xValue - margin);
    doc.text(split, xValue, y);
    y += lineHeight * (Array.isArray(split) ? split.length : 1);
  };
  writeLabelValue(leftX, leftX + 110, 'Cliente', reservationDetails.fullName || '-');
  writeLabelValue(leftX, leftX + 110, 'Email', reservationDetails.email || '-');

  writeLabelValue(leftX, leftX + 110, 'Sede', reservationDetails.venueName || '-');
  writeLabelValue(leftX, leftX + 110, 'Tipo de evento', reservationDetails.eventType || '-');
  writeLabelValue(leftX, leftX + 110, 'Ubicación', `${reservationDetails.district || '-'}, ${reservationDetails.address || '-'}`);
  writeLabelValue(leftX, leftX + 110, 'Fecha', reservationDetails.date || '-');
  writeLabelValue(leftX, leftX + 110, 'Horario', `${reservationDetails.initTime || '-'} - ${reservationDetails.endTime || '-'}`);
  writeLabelValue(leftX, leftX + 110, 'Duración (hrs)', `${reservationDetails.totalHours || '-'}`);
  writeLabelValue(leftX, leftX + 110, 'Total invitados', `${reservationDetails.guestCount ?? '-'}`);


  // Right column: payment summary (amounts aligned right)
  let xAmountLabel = rightX;
  let xAmountValue = pageWidth - margin;
  const writeAmountLine = (label: string, amount: string, bold = false) => {
    if (bold) doc.setFont('helvetica', 'bold'); else doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(label, xAmountLabel, y);
    doc.text(amount, xAmountValue, y, { align: 'right' } as any);
    y += lineHeight;
  };

  // Compute furniture subtotals excluding mandatory DB item
  const mandatoryFurniture = furnitureList?.find(f => f.furnitureName?.toLowerCase().includes('servicios obligatorios'));
  let furnitureSubtotal = 0;
  let additionalServicesSubtotal = 0;
  let mandatorySubtotalAmount = 0;
  const furnitureRows: Array<Array<string | number>> = [];

  Object.entries(selectedFurniture || {}).forEach(([fidStr, qty]) => {
    const fid = parseInt(fidStr, 10);
    const meta = furnitureList?.find(f => f.furnitureId === fid);
    const name = meta?.furnitureName || `ID ${fid}`;
    const unit = meta?.unitPrice ?? 0;
    const subtotal = unit * qty;

    if (mandatoryFurniture && fid === mandatoryFurniture.furnitureId) {
      mandatorySubtotalAmount += subtotal;
    } else {
      furnitureSubtotal += subtotal;
      furnitureRows.push([name, qty, `S/ ${unit.toFixed(2)}`, `S/ ${subtotal.toFixed(2)}`]);
    }
  });

  additionalServicesSubtotal = furnitureSubtotal;

  y += 12;
  doc.setFontSize(11);
  doc.setTextColor(0,0,0);
  // Title in bold
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de reserva', leftX, y);
  doc.setFont('helvetica', 'normal');
  y += 8;

  // Print furniture table with blue header
  if (furnitureRows.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(toRgb(COLOR_BLUE)[0], toRgb(COLOR_BLUE)[1], toRgb(COLOR_BLUE)[2]);
    doc.text('1. Mobiliarios / Servicios adicionales', leftX, y+12);

    const rgb = toRgb(COLOR_BLUE) as [number, number, number];
    autoTable(doc, {
      startY: y+= 20,
      head: [['Item', 'Cantidad', 'Precio unit.', 'Subtotal']],
      body: furnitureRows,
      styles: { fontSize: 9, cellPadding: 4, textColor: [0, 0, 0] },
      headStyles: { fillColor: rgb, textColor: [255, 255, 255] },
      columnStyles: {
        2: { halign: 'right' as any },
        3: { halign: 'right' as any },
      },
      theme: 'grid',
      margin: { left: leftX, right: margin },
    });
    y = (doc as any).lastAutoTable?.finalY || y + furnitureRows.length * 14 + 20;
    y += 6;
  }

    y += 10;
  writeAmountLine('Subtotal mobiliarios y servicios', `S/ ${(additionalServicesSubtotal).toFixed(2)}`);

  doc.setFontSize(11);
  doc.setTextColor(toRgb(COLOR_BLUE)[0], toRgb(COLOR_BLUE)[1], toRgb(COLOR_BLUE)[2]);
  doc.text('2. Servicios obligatorios', leftX, y+20);
  y += 8;
  const mandatoryRows: Array<Array<string | number>> = [];
  Object.values(mandatoryBreakdown).forEach((svc: any) => {
    mandatoryRows.push([svc.name, 1, `S/ ${svc.price.toFixed(2)}`, `S/ ${svc.price.toFixed(2)}`]);
  });
  if (mandatoryRows.length > 0) {
    const rgb = toRgb(COLOR_BLUE) as [number, number, number];
    autoTable(doc, {
      startY: y+= 20,
      head: [['Servicio', 'Cantidad', 'Precio unit.', 'Subtotal']],
      body: mandatoryRows,
      styles: { fontSize: 9, cellPadding: 4, textColor: [0, 0, 0] },
      headStyles: { fillColor: rgb, textColor: [255, 255, 255] },
      columnStyles: { 2: { halign: 'right' as any }, 3: { halign: 'right' as any } },
      theme: 'grid',
      margin: { left: leftX, right: margin },
    });
    y = (doc as any).lastAutoTable?.finalY || y + mandatoryRows.length * 14 + 20;
    y += 12;
  }
  y += 2;
  writeAmountLine('Subtotal servicios obligatorios', `S/ ${(mandatorySubtotalAmount).toFixed(2)}`);
// una linea de separacion

  y += 12;
  const venueSubtotal = Number(reservationDetails.venueSubtotal ?? 0);
  writeAmountLine('Subtotal alquiler', `S/ ${venueSubtotal.toFixed(2)}`);
  writeAmountLine('Monto sin IGV', `S/ ${(venueSubtotal + additionalServicesSubtotal + mandatorySubtotalAmount).toFixed(2)}`);
  const igv = reservationDetails.totalAmount - (reservationDetails.totalAmount / 1.18);
  writeAmountLine('IGV (18%)', `S/ ${igv.toFixed(2)}`);
  writeAmountLine('Total', `S/ ${reservationDetails.totalAmount.toFixed(2)}`, true);

  if (includePaymentDetails) {
    y += 6;
    doc.setFontSize(11);
    doc.setTextColor(0,0,0);
    doc.text('Detalle de pago', leftX, y);
    y += 4;
    const paymentDate = new Date().toLocaleString('es-PE');
    const payBody = [
      ['Fecha de pago', paymentDate],
      ['Medio', paymentMethod?.name || '-'],
      ['Código', approvalCode || '-'],
    ];
    autoTable(doc, {
      startY: y,
      body: payBody,
      styles: { fontSize: 9, cellPadding: 4, textColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: { 1: { halign: 'right' as any } },
      theme: 'grid',
      margin: { left: leftX, right: margin },
    });
    y = (doc as any).lastAutoTable?.finalY || y + payBody.length * 14 + 20;
  }

  y += 14;
  doc.setFontSize(9);
  const generatedAt = new Date().toLocaleString('es-PE');
  doc.text('Documento autogenerado por Lumina Eventos.', leftX, y);
  doc.text(generatedAt, pageWidth - margin, y, { align: 'right' } as any);

  const safeName = (reservationDetails.venueName || 'reserva').replace(/[^a-z0-9_-]/gi, '_');
  doc.save(`constancia_${safeName}.pdf`);
}
