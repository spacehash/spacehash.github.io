import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import pdfUrl from '../resources/RENTAL CONTRACT.pdf';

const RentalContractForm = () => {
  const today = new Date();
  const formatDate = (date) => ({
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
    year: String(date.getFullYear())
  });

  const todayFormatted = formatDate(today);

  const [formData, setFormData] = useState({
    // Contract date
    contract_month: todayFormatted.month,
    contract_day: todayFormatted.day,
    contract_year: todayFormatted.year,

    // Renter information
    renter_name: '',
    renter_address: '',
    renter_phone: '',
    renter_contact_info: '',

    // Equipment (5 rows)
    equipment_name_1: '',
    equipment_value_1: '',
    equipment_name_2: '',
    equipment_value_2: '',
    equipment_name_3: '',
    equipment_value_3: '',
    equipment_name_4: '',
    equipment_value_4: '',
    equipment_name_5: '',
    equipment_value_5: '',

    // Lease period
    lease_start_month: '',
    lease_start_day: '',
    lease_start_year: '',
    lease_end_month: '',
    lease_end_day: '',
    lease_end_year: '',

    // Payment
    payment_amount: '',

    // Security deposit
    deposit_not_required: true,
    deposit_required: false,
    deposit_amount: '',

    // Agreement
    renter_initials: '',
    additional_terms: '',

    // Owner signature
    owner_sign_month: '',
    owner_sign_day: '',
    owner_sign_year: '',
    owner_print_name: 'Donovan Jenkins',

    // Renter signature
    renter_sign_month: todayFormatted.month,
    renter_sign_day: todayFormatted.day,
    renter_sign_year: todayFormatted.year,
    renter_print_name: ''
  });

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const previewRef = useRef(null);

  // Clean up blob URL on unmount or when a new one is created
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'deposit_not_required' || name === 'deposit_required') {
      setFormData(prev => ({
        ...prev,
        deposit_not_required: name === 'deposit_not_required',
        deposit_required: name === 'deposit_required',
        deposit_amount: name === 'deposit_not_required' ? '' : prev.deposit_amount
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePreviewPDF = async () => {
    setPdfError(null);

    try {
      // Revoke previous blob URL if any
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }

      const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Get all field names from the PDF for matching
      const fields = form.getFields();
      const fieldNames = new Set(fields.map(f => f.getName()));

      // Fill text fields
      for (const [key, value] of Object.entries(formData)) {
        if (key === 'deposit_not_required' || key === 'deposit_required') {
          continue; // Handle checkboxes separately
        }
        if (fieldNames.has(key) && typeof value === 'string') {
          try {
            const field = form.getTextField(key);
            field.setText(value);
          } catch {
            // Field might not be a text field, skip
          }
        }
      }

      // Handle checkboxes
      for (const cbName of ['deposit_not_required', 'deposit_required']) {
        if (fieldNames.has(cbName)) {
          try {
            const cb = form.getCheckBox(cbName);
            if (formData[cbName]) {
              cb.check();
            } else {
              cb.uncheck();
            }
          } catch {
            // Not a checkbox field, skip
          }
        }
      }

      const filledPdfBytes = await pdfDoc.save();
      const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);

      // Scroll to preview after a tick
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Failed to fill PDF:', err);
      setPdfError('Failed to generate PDF preview. Check the console for details.');
    }
  };

  const handleClosePreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setPdfPreviewUrl(null);
    setPdfError(null);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionClass = "bg-white rounded-lg shadow-md p-6 mb-6";
  const dateInputClass = "w-16 px-2 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500";
  const yearInputClass = "w-20 px-2 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SPACE HASH</h1>
          <h2 className="text-xl text-gray-600">Equipment Rental Agreement Form</h2>
        </div>

        {/* Contract Date */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contract Date</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Date:</span>
            <input type="text" name="contract_month" value={formData.contract_month} onChange={handleChange} className={dateInputClass} placeholder="MM" maxLength={2} />
            <span>/</span>
            <input type="text" name="contract_day" value={formData.contract_day} onChange={handleChange} className={dateInputClass} placeholder="DD" maxLength={2} />
            <span>/</span>
            <input type="text" name="contract_year" value={formData.contract_year} onChange={handleChange} className={yearInputClass} placeholder="YYYY" maxLength={4} />
          </div>
        </div>

        {/* Renter Information */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Renter Information</h3>
          <div className="grid gap-4">
            <div>
              <label className={labelClass}>Renter (or Business) Name</label>
              <input type="text" name="renter_name" value={formData.renter_name} onChange={handleChange} className={inputClass} placeholder="Full name or business name" />
            </div>
            <div>
              <label className={labelClass}>Mailing Address</label>
              <input type="text" name="renter_address" value={formData.renter_address} onChange={handleChange} className={inputClass} placeholder="Street address, City, State ZIP" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="text" name="renter_phone" value={formData.renter_phone} onChange={handleChange} className={inputClass} placeholder="(505) 555-1234" />
              </div>
              <div>
                <label className={labelClass}>Additional Contact Info</label>
                <input type="text" name="renter_contact_info" value={formData.renter_contact_info} onChange={handleChange} className={inputClass} placeholder="Email or alternate phone" />
              </div>
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Equipment and Total Approximate Value</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left w-32">Value</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        name={`equipment_name_${i}`}
                        value={formData[`equipment_name_${i}`]}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        placeholder={`Equipment item ${i}`}
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        name={`equipment_value_${i}`}
                        value={formData[`equipment_value_${i}`]}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        placeholder="$0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lease Period */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Lease Period</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Begins on:</span>
              <input type="text" name="lease_start_month" value={formData.lease_start_month} onChange={handleChange} className={dateInputClass} placeholder="MM" maxLength={2} />
              <span>/</span>
              <input type="text" name="lease_start_day" value={formData.lease_start_day} onChange={handleChange} className={dateInputClass} placeholder="DD" maxLength={2} />
              <span>/</span>
              <input type="text" name="lease_start_year" value={formData.lease_start_year} onChange={handleChange} className={yearInputClass} placeholder="YYYY" maxLength={4} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Continues until:</span>
              <input type="text" name="lease_end_month" value={formData.lease_end_month} onChange={handleChange} className={dateInputClass} placeholder="MM" maxLength={2} />
              <span>/</span>
              <input type="text" name="lease_end_day" value={formData.lease_end_day} onChange={handleChange} className={dateInputClass} placeholder="DD" maxLength={2} />
              <span>/</span>
              <input type="text" name="lease_end_year" value={formData.lease_end_year} onChange={handleChange} className={yearInputClass} placeholder="YYYY" maxLength={4} />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Lease Payment</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">1-Time Payment (estimate): $</span>
            <input type="text" name="payment_amount" value={formData.payment_amount} onChange={handleChange} className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
          </div>
        </div>

        {/* Security Deposit */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Security Deposit</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="deposit_not_required"
                checked={formData.deposit_not_required}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700"><strong>Not Required.</strong> There is no Security Deposit required under this Agreement.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="deposit_required"
                checked={formData.deposit_required}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-700"><strong>Required.</strong> Amount: $</span>
                <input
                  type="text"
                  name="deposit_amount"
                  value={formData.deposit_amount}
                  onChange={handleChange}
                  disabled={!formData.deposit_required}
                  className={`w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!formData.deposit_required ? 'bg-gray-100' : ''}`}
                  placeholder="0.00"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Agreement Section */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Agreement</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Renter Initials:</span>
              <input type="text" name="renter_initials" value={formData.renter_initials} onChange={handleChange} className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="XX" maxLength={4} />
            </div>
            <div>
              <label className={labelClass}>Additional Terms, Conditions, or Comments</label>
              <textarea
                name="additional_terms"
                value={formData.additional_terms}
                onChange={handleChange}
                rows={5}
                className={inputClass}
                placeholder="Enter any additional terms, event details, special instructions, etc."
              />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Signatures</h3>

          {/* Owner */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-medium text-gray-700 mb-3">Owner</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Print Name</label>
                <input type="text" name="owner_print_name" value={formData.owner_print_name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <div className="flex items-center gap-2">
                  <input type="text" name="owner_sign_month" value={formData.owner_sign_month} onChange={handleChange} className={dateInputClass} placeholder="MM" maxLength={2} />
                  <span>/</span>
                  <input type="text" name="owner_sign_day" value={formData.owner_sign_day} onChange={handleChange} className={dateInputClass} placeholder="DD" maxLength={2} />
                  <span>/</span>
                  <input type="text" name="owner_sign_year" value={formData.owner_sign_year} onChange={handleChange} className={yearInputClass} placeholder="YYYY" maxLength={4} />
                </div>
              </div>
            </div>
          </div>

          {/* Renter */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Renter</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Print Name</label>
                <input type="text" name="renter_print_name" value={formData.renter_print_name} onChange={handleChange} className={inputClass} placeholder="Full legal name" />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <div className="flex items-center gap-2">
                  <input type="text" name="renter_sign_month" value={formData.renter_sign_month} onChange={handleChange} className={dateInputClass} placeholder="MM" maxLength={2} />
                  <span>/</span>
                  <input type="text" name="renter_sign_day" value={formData.renter_sign_day} onChange={handleChange} className={dateInputClass} placeholder="DD" maxLength={2} />
                  <span>/</span>
                  <input type="text" name="renter_sign_year" value={formData.renter_sign_year} onChange={handleChange} className={yearInputClass} placeholder="YYYY" maxLength={4} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview PDF Button */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handlePreviewPDF}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Preview PDF
          </button>
          {pdfPreviewUrl && (
            <button
              onClick={handleClosePreview}
              className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
            >
              Close Preview
            </button>
          )}
        </div>

        {/* Error message */}
        {pdfError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {pdfError}
          </div>
        )}

        {/* PDF Preview */}
        {pdfPreviewUrl && (
          <div ref={previewRef} className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">PDF Preview</h3>
            <iframe
              src={pdfPreviewUrl}
              title="Rental Contract Preview"
              style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalContractForm;
