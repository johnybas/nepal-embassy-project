import React, { Dispatch } from 'react';

const WorkerWtoGats: React.FC<{
  setGatsOfferLetter: Dispatch<File>;
  setPurposeApplication: Dispatch<File>;
}> = ({ setGatsOfferLetter, setPurposeApplication }) => {
  return (
    <>
      <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-700">
          GATS mentioned category skilled based working offer letter{' '}
          <span className="text-red-500">*</span>
        </dt>
        <div className="flex">
          <input
            required
            className="form-control"
            type="file"
            accept="application/msword, text/plain, application/pdf, .doc, .docx, .txt, application/docx, image/*"
            id="gats-offer-letter"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files != null) {
                setGatsOfferLetter(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>
      <div className="px-4 py-5 rounded bg-gray-50 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-700">
          NOC application of purpose <span className="text-red-500">*</span>
        </dt>
        <div className="flex">
          <input
            required
            className="form-control"
            type="file"
            accept="application/msword, text/plain, application/pdf, .doc, .docx, .txt, application/docx, image/*"
            id="purpose-application"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files != null) {
                setPurposeApplication(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default WorkerWtoGats;
