import { NocFilesType, nocDocumentType } from '@utils/interface';
import {
  citizenNocDocumentDetail,
  nocDocumentFiles,
  updateNocDocument,
  updateNocDocumentFile,
  uploadPaymentScreenShot,
} from 'content/api-urls';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import { CheckCircleIcon } from '@heroicons/react/outline';
import CitizenFields from '@components/citizen/nocDetail/CitizenFields';
import DocAttachmentCard from '@components/citizen/nocDetail/DocAttachmentCard';
import { FetchData } from '@utils/fetcher';
import Footer from '@components/citizen/layout/Footer';
import NocStatusPill from '@components/citizen/nocDetail/NocStatusPill';
import { PaperClipIcon } from '@heroicons/react/solid';
import PaymentAttachmentCard from '@components/citizen/nocDetail/PaymentAttachmentCard';
import PaymentDetail from '@components/common/PaymentDetail';
import UploadFile from '@components/citizen/nocDetail/UploadFile';
import authStore from '@store/useAuthStore';
import pageTitleStore from '@store/selectUsersStore';
import { useRouter } from 'next/router';
import {
  dateReverseFormat,
  dateWithSlash,
  dateFormatter,
} from '@utils/helpers';

const NocDetail: React.FC<{ documentId: string }> = ({ documentId }) => {
  const router = useRouter();
  const { token } = authStore();
  const { setPageTitle } = pageTitleStore();
  const [detail, setDetail] = useState<nocDocumentType>();
  const [nocFiles, setNocFiles] = useState<NocFilesType[]>();

  const getNocDocumentDetail = async () => {
    const data = await FetchData(token, citizenNocDocumentDetail + documentId);
    setDetail(data);
  };

  const getNocDocumentFiles = async () => {
    const data = await FetchData(token, nocDocumentFiles + documentId);
    setNocFiles(data);
  };

  useEffect(() => {
    if (!router.isReady) return;
    setPageTitle('Noc Document Detail');
    getNocDocumentDetail();
    getNocDocumentFiles();
  }, [router.isReady]);

  return (
    <div className="p-4">
      <Toaster />
      <div className="p-2 mx-auto my-4 overflow-hidden bg-white shadow rounded-2xl">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              You applied for{' '}
              <span className="font-bold text-blue-700">
                {detail?.travel_type == 'Connecting' ? (
                  'Connecting Travel '
                ) : detail?.travel_type == 'Direct' ? (
                  'Direct Travel '
                ) : (
                  <></>
                )}
                {/* <span className="text-base leading-6 text-gray-700 font-base">
                  (Applied on {detail?.created_at})
                </span> */}
              </span>
            </h3>

            <p className="py-2 text-sm text-gray-600">
              Applied on:{' '}
              <span className="font-semibold text-gray-800">
                {detail?.created_at}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {/* Refactored to component */}
            {detail?.verified_status && (
              <NocStatusPill verified_status={detail?.verified_status} />
            )}
            <DownloadNOCButton {...detail} />
          </div>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
          {/* <FileViewer docs={docs} /> */}
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
            <CitizenFields data={detail?.profile.full_name} title="Full Name" />
            <CitizenFields data={detail?.profile.email} title="Email address" />
            <CitizenFields
              data={dateReverseFormat(detail?.profile.dob)}
              title="Date of birth"
            />
            <CitizenFields
              title="Application for"
              data={detail?.travel_purpose_value}
            />
            <CitizenFields title="Qualification" data="Graduate" />
            <CitizenFields data={detail?.district} title="District" />
            <CitizenFields data={detail?.province} title="Province" />
            <CitizenFields data={detail?.travel_from} title="Travel From" />
            <CitizenFields
              data={detail?.travel_country}
              title="Travel Country"
            />
            <CitizenFields
              data={dateWithSlash(detail?.travel_date)}
              title="Travel Date"
            />
            {detail?.return_date && (
              <CitizenFields
                data={dateWithSlash(detail?.return_date)}
                title="Return Date"
              />
            )}
            {detail?.travel_via != '' ? (
              <CitizenFields data={detail?.travel_via} title="Travel Via" />
            ) : (
              <></>
            )}
            <CitizenFields
              data={detail?.travel_purpose_value}
              title="Travel Purpose"
            />
            <CitizenFields
              data={detail?.passport_number.toString()}
              title="Passport Number"
            />

            <CitizenFields
              data={detail?.check_living_in_india ? 'Yes' : 'No'}
              title="Living in India"
            />

            <div className="sm:col-span-3">
              <dt className="text-lg font-semibold text-gray-900">
                Attachments
              </dt>
              <p className="py-2 text-xs text-gray-600 md:text-sm">
                Your uploaded and rejected files will be shown here and you can
                update your submitted files when there is any verification
                error.
              </p>
              <dd className="mt-1 text-sm text-gray-900">
                <ul role="list">
                  {nocFiles?.map((file) => (
                    <DocAttachmentCard
                      key={'attachment' + file.id}
                      {...file}
                      getNocDocumentFiles={getNocDocumentFiles}
                    />
                  ))}

                  {detail?.upload_payment_screen_shot && (
                    <PaymentAttachmentCard
                      {...detail}
                      getNocDocumentDetail={getNocDocumentDetail}
                    />
                  )}
                </ul>
              </dd>
            </div>
          </dl>
          <div className="p-4 px-6 space-y-1 text-sm text-gray-800 bg-white rounded-xl">
            <PaymentDetail />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export const DownloadNOCButton = ({ ...detail }) => {
  const router = useRouter();
  const { token } = authStore();

  return detail?.verified_status == '3' ? (
    <button
      onClick={() => {
        router.push(
          {
            pathname: '/citizen/generate-noc',
            query: {
              nocId: detail?.id,
              token: token,
            },
          },
          '/citizen/generate-noc'
        );
      }}
      type="button"
      disabled={detail?.verified_status == '3' ? false : true}
      className="inline-flex items-center justify-center px-3 py-2 space-x-1 text-xs font-medium text-center text-white transition duration-150 bg-blue-600 rounded-md shadow-sm hover:text-white hover:bg-blue-700 focus:outline-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:bg-gray-300 disabled:text-gray-50 disabled:cursor-not-allowed"
    >
      Download
    </button>
  ) : (
    <></>
  );
};
export default NocDetail;
export async function getServerSideProps(context: any) {
  const { nocId } = context.params;
  const documentId = nocId;
  return { props: { documentId } };
}
