import { PDFDocument, StandardFonts } from 'pdf-lib';
import rentalPdfUrl from '../resources/RENTAL CONTRACT.pdf';

export async function fillContractPdf({ dates, selectedItems, getQty, name, business, address, phone, contactInfo, perDayTotal }) {
  const pdfTemplateBytes = await fetch(rentalPdfUrl).then((res) => res.arrayBuffer());
  const renterDisplayName = business || name;

  const urls = [];

  for (const date of dates) {
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    const form = pdfDoc.getForm();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const setField = (fieldName, value) => {
      if (!value) return;
      try {
        const field = form.getTextField(fieldName);
        field.setText(value);
        field.updateAppearances(font);
      } catch {}
    };

    // Renter info
    setField('renter_name', renterDisplayName);
    setField('renter_print_name', name);
    setField('renter_address', address);
    setField('renter_phone', phone);
    setField('renter_contact_info', contactInfo);

    // Owner
    setField('owner_print_name', 'Donovan Jenkins');

    // Equipment names and values
    selectedItems.forEach((item, idx) => {
      const qty = getQty(item.id);
      const label = qty > 1 ? `(${qty}) ${item.name}` : item.name;
      setField(`equipment_name_${idx + 1}`, label);
      setField(`equipment_value_${idx + 1}`, `$${item.value * qty}`);
    });

    // Contract date and lease start
    const mm = date.format('MM');
    const dd = date.format('DD');
    const yyyy = date.format('YYYY');

    setField('contract_month', mm);
    setField('contract_day', dd);
    setField('contract_year', yyyy);

    setField('lease_start_month', mm);
    setField('lease_start_day', dd);
    setField('lease_start_year', yyyy);

    // Lease end = start + 1 day
    const endDate = date.add(1, 'day');
    setField('lease_end_month', endDate.format('MM'));
    setField('lease_end_day', endDate.format('DD'));
    setField('lease_end_year', endDate.format('YYYY'));

    // Payment total
    setField('payment_amount', String(perDayTotal));

    const filledBytes = await pdfDoc.save();
    const blob = new Blob([filledBytes], { type: 'application/pdf' });
    urls.push(URL.createObjectURL(blob));
  }

  return urls;
}
