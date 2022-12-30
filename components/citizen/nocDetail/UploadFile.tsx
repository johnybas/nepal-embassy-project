import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useRef, useState } from 'react';
import { Update, UpdateHandler } from '@utils/fetcher';

import authStore from '@store/useAuthStore';
import { toast } from 'react-hot-toast';

export interface UploadFileProps {
  url: string;
  getContent: () => void;
  uploadFor: string;
  label: string;
}
const UploadFile: React.FC<UploadFileProps> = ({
  url,
  getContent,
  uploadFor,
  label,
}) => {
  const { token } = authStore();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();

  const cancelButtonRef = useRef(null);

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formData = new FormData();

    if (uploadFor == 'Document') {
      formData.append('payment_screen_shot', file as Blob);
    } else if (uploadFor == 'File') {
      formData.append('document_file', file as Blob);
      formData.append('verification_status', '1');
    }

    const response = await UpdateHandler(token, url, formData);
    // console.log(response.response.data.message);
    if (response.data.status == 'success') {
      response.data.message
        ? toast.success(response.data.message)
        : toast.error('File uploaded successfully');
      getContent();
      setOpen(false);
    } else {
      response.data.message
        ? toast.error(response.data.message)
        : toast.error('Cannot upload file');
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className=" bg-indigo-500 font-medium hover:bg-indigo-600 text-white px-3 py-2 rounded-md"
      >
        Upload
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <form
                    action=""
                    onSubmit={(e) => {
                      uploadFile(e);
                    }}
                  >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left">
                          <div className="mt-2">
                            <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 border rounded-md">
                              <dt className="text-sm font-medium text-gray-500">
                                {label}
                              </dt>
                              <div className="flex">
                                <input
                                  required
                                  className="form-control"
                                  type="file"
                                  id="file"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    if (e.target.files != null) {
                                      setFile(e.target.files[0]);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
export default UploadFile;
