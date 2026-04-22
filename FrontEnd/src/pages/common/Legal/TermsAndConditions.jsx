import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-10">
        <div className="max-w-4xl mx-auto text-gray-700 text-sm leading-7 space-y-6">
          <h1 className="text-lg font-semibold text-gray-900">
            TERMS & CONDITIONS
          </h1>

          <p className="font-medium">Bengol Spices Private Limited</p>

          {/* SECTION 1 */}
          <div>
            <h2 className="font-semibold text-gray-900 text-base">
              1. Payment Terms
            </h2>
            <p>
              All invoices are payable within 7 (seven) days from the date of
              invoice.
            </p>
          </div>

          {/* SECTION 2 */}
          <div>
            <h2 className="font-semibold text-gray-900 text-base">
              2. Reminder Policy
            </h2>
            <p>
              In case of non-payment within the due period, a reminder via email
              or phone call will be issued on the 8th day. An additional grace
              period of 2 (two) days (up to the 10th day) will be provided to
              clear outstanding dues.
            </p>
          </div>

          {/* SECTION 3 */}
          <div>
            <h2 className="font-semibold text-gray-900 text-base">
              3. Late Payment Charges
            </h2>
            <p>
              A late fee of 0.05% per day will be levied on the outstanding
              amount from the 11th day onwards until full payment is received.
            </p>
            <p>
              Failure to settle dues, including applicable penalties, may lead
              to legal action for recovery.
            </p>
          </div>

          {/* SECTION 4 */}
          <div>
            <h2 className="font-semibold text-gray-900 text-base">
              4. Return Policy
            </h2>
            <p>
              Returns will be accepted only at the time of delivery, and
              strictly in cases where goods are found damaged, defective, or
              torn due to company fault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
