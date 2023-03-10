import { BsCheckCircleFill, BsCircle } from 'react-icons/bs';
import React, { useEffect } from 'react';

import { RadioGroup } from '@headlessui/react';
import { classNames } from '@utils/helpers';

const LivingInIndia = ({
  livingInIndia,
  setLivingInIndia,
}: {
  livingInIndia: boolean;
  setLivingInIndia: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const RadioOption = ({ value, label }: { value: boolean; label: string }) => (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <div
          className={classNames(
            'px-2 py-2 rounded-md flex cursor-pointer items-center space-x-2',
            checked ? 'bg-gray-100 duration-200' : ''
          )}
        >
          {checked ? (
            <BsCheckCircleFill className="w-4 h-4 text-blue-500" />
          ) : (
            <BsCircle className="w-4 h-4 text-blue-400" />
          )}
          <span>{label}</span>
        </div>
      )}
    </RadioGroup.Option>
  );
  return (
    <RadioGroup value={livingInIndia} onChange={setLivingInIndia}>
      <RadioGroup.Label className="block mb-2 text-sm font-medium text-gray-700">
        Living In India <span className="text-red-500">*</span>
      </RadioGroup.Label>
      <div className="flex">
        <RadioOption value={true} label="Yes" />
        <RadioOption value={false} label="No" />
      </div>
      
    </RadioGroup>
  );
};

export default LivingInIndia;
