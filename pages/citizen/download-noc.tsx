import { BASE_URL, IMAGE_BASE_URL, verifyByQr } from '@content/api-urls';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';

import { CloudDownloadIcon } from '@heroicons/react/outline';
import { GetServerSidePropsContext } from 'next';
import HeadSection from '@components/nocCirtificate/HeadSection';
import Loading from '@components/common/Loading';
import QRCode from 'react-qr-code';
import authStore from '@store/testAuthStore';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import moment from 'moment';
import pageTitleStore from '../../store/selectUsersStore';
import useWindowDimensions from '@utils/useWindowDimensions';

export interface NOCType {
  id: string;
  full_name: string;
  travel_from: string;
  travel_country: string;
  reference_number: number;
  verified_on: string;
  letter_head: string;
  letter_body: string;
  letter_ending: string;
  signed_by: string;
  noc_documents: string;
  passport: number;
  signature: string;
  verified_by: string;
}
// type CertificateDataType = {};

const DownloadNoc: React.FC<{ certificateData: NOCType }> = ({
  certificateData,
}) => {
  const { setPageTitle } = pageTitleStore();
  const [isLoading, setIsLoading] = useState(false);
  // const [certificateData, setCertificateData] = useState<NOCType>();
  // const [qrCodeValue, setQrCodeValue] = useState(
  //   `/verify-by-qr/${certificateData.id}`
  // );
  const [qrCodeValue, setQrCodeValue] = useState(
    `${IMAGE_BASE_URL}:3000/verify-by-qr/` + certificateData.id
  );

  // for print pdf
  const { width } = useWindowDimensions();
  const [docWidth, setDocWidth] = useState(width - 64);
  const [docHeight, setDocHeight] = useState(width * 1.414 - 64);
  console.log(docWidth);

  const printRef = useRef() as RefObject<HTMLDivElement>;

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    // const element = printRef.current;
    const cirtificate = document.getElementById('cirtificate') as HTMLElement;
    const canvas = await html2canvas(cirtificate);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 297],
    });
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    setIsLoading(false);
    pdf.save('NOC.pdf');
  };

  useEffect(() => {
    setPageTitle('Download NOC');
  }, []);

  return (
    <div className="max-w-5xl mx-auto mb-10">
      <div className="flex justify-end items-center mb-4">
        {!isLoading ? (
          <button
            className="mt-6 w-auto flex justify-center px-4 py-3 gap-1 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-1 md:text-base"
            onClick={handleDownloadPdf}
          >
            Download cirtificate
            <span>
              <CloudDownloadIcon className="w-6 h-6" />
            </span>
          </button>
        ) : (
          <LoadingButton />
        )}
      </div>

      <div className="relative flex min-h-screen flex-col justify-center bg-gray-50">
        <div className="container mx-auto px-2">
          <div
            id="cirtificate"
            className="bg-white mx-auto h-full md:h-[297mm] text-center shadow-lg print:shadow-none"
          >
            <div className="bg-white mx-auto flex flex-col flex-shrink-0 p-2 pb-2 px-8 md:px-16 md:pt-6 md:pb-2 lg:px-18">
              <div className="flex justify-between items-center h-32 lg:h-64">
                <div className="p-2">
                  <img
                    src="/images/logo-only.jpg"
                    className="h-16 md:h-24 lg:h-44"
                    alt="Nepal Embassy logo"
                  />
                </div>
                <div className="p-2">
                  <img
                    src="/images/np-logo.png"
                    className="h-10 lg:h-24"
                    alt="Embassy of Nepal, New Delhi"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-1 md:mt-8">
                <div className="text-2xs md:text-lg lg:text-xl font-bold">
                  Ref. No. 079/80/GR-TUE/9980
                </div>
                <div className="text-2xs md:text-lg lg:text-xl font-bold">
                  Date:- {moment(certificateData.verified_on).format('L')}
                </div>
              </div>
              <div className="mt-14 mb-6 md:mt-24 md:mb-10">
                <h1 className="underline font-bold text-sm md:text-xl lg:text-2xl">
                  TO WHOM IT MAY CONCERN
                </h1>
              </div>
              <div className="text-xs md:text-lg lg:text-xl text-justify space-y-4 md:space-y-6">
                <p className="indent-16">
                  Based on the documents submitted at this Embassy, this is to
                  state that
                  <span className="font-bold">
                    {' '}
                    Mr. {certificateData?.full_name}
                  </span>{' '}
                  (holder of Nepali{' '}
                  <span className="font-bold">
                    Passport No. {certificateData.passport}
                  </span>
                  ) currently staying in {certificateData.travel_from} is
                  intending to travel to the {certificateData.travel_country}{' '}
                  using airport in {certificateData.travel_from} shortly.
                </p>
                <p className="indent-16">
                  Any needful cooperation extended to him during his journey
                  from India to the
                  <span className="font-bold">
                    {' '}
                    {certificateData?.travel_country}{' '}
                  </span>
                  as per the existing rules and regulation, would be highly
                  appreciated.
                </p>
              </div>
              <div className="flex text-xs md:text-lg lg:text-xl justify-between items-start mt-14">
                <div className="">
                  {/* <img
                    src="https://www.freepnglogos.com/uploads/qr-code-png/qr-code-file-bangla-mobile-code-0.png"
                    alt="QR code"
                    className="h-32 lg:h-40"
                  /> */}
                  <QRCode value={qrCodeValue} size={150} className="w-full" />
                  <span className="text-xs text-gray-500">
                    {' '}
                    Scan this QR code to verify{' '}
                  </span>
                </div>
                <div className="text-center flex flex-col justify-start items-center px-10 space-y-2">
                  <img
                    src={`${IMAGE_BASE_URL}/media/${certificateData.signature}`}
                    alt="signature"
                    className="h-14 lg:h-32"
                  />
                  <div>
                    <p className="font-bold">({certificateData.verified_by})</p>
                    <p>Third Secretary</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="lg:text-sm md:text-xs text-3xs flex flex-col mx-4 pb-2 border-t-4 mt-32 pt-2 border-red-600 justify-end items-center font-medium tracking-tighter">
              <p>
                Barakhamba Road, New Delhi-110001, India, Tel.: +91-11-23476200
                / +91-11-23327361, Hotline : +91-8929601925
              </p>
              <p>Website : in.npalembassy.gov.np</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingButton = () => {
  return (
    <button
      type="button"
      className="w-auto my-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <Loading />
      Loading
    </button>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { token, nocId } = context.query;
  if (!nocId) {
    return {
      redirect: {
        permanent: false,
        destination: '/citizen/get-noc',
      },
    };
  }
  let certificateData;
  const url = `${BASE_URL}getNoObjectionCertificate/${nocId}`;
  try {
    const response = await axios(url, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
    certificateData = response.data;
    console.log(response.data);
  } catch (e: any) {
    throw new Error(e);
  }

  return { props: { certificateData } };
}

export default DownloadNoc;
