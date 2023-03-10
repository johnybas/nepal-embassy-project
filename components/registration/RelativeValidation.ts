import * as yup from 'yup';

import moment from 'moment';

// interface for form
export interface RegisterFormTypes {
  email: string;
  full_name: string;
  // last_name: string;
  gender: string;
  dob: string;
  contact_number: string;
  fathers_name: string;
  mothers_name: string;
  // qualification: string;
  profession: string;
  // password: string;
  // confirm_password: string;
  relationship: string;
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const PHONENUMBER_REGEX = /^[0-9\- ]{10}$/;

function parseDateString(value: any, originalValue: any) {
  const parsedDate = moment(originalValue).format('DD/MM/yyyy');
  return parsedDate;
}

// validation
export const RelativeValidationSchema = yup.object().shape({
  // Email
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

  // First Name
  full_name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter a valid name')
    .min(2, 'Enter a valid name')
    .max(40, 'Name is too long')
    .required('Name is required'),

  // Last Name
  // last_name: yup
  //   .string()
  //   .min(3, 'Enter a valid last name')
  //   .max(32, 'Enter a valid last name')
  //   .required('Last Name is required'),

  // Father's Name
  fathers_name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter a valid name')
    .min(3, 'Enter a valid name')
    .max(32, 'Enter a valid name')
    .required("Father's Name is required"),

  // Father's Name
  mothers_name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter a valid name')
    .min(3, 'Enter a valid name')
    .max(32, 'Enter a valid name')
    .required("Mother's Name is required"),

  // Contact number validate
  contact_number: yup
    .string()
    .matches(PHONENUMBER_REGEX, {
      message: 'Phone number is not valid',
      excludeEmptyString: true,
    })
    // .min(10, 'Phone number should be of 10 digits')
    .nullable()
    .max(9999999999, "Phone number can't be more than 10 digits"),

  // DOB validation
  dob: yup.string().required().transform(parseDateString),

  // qualification validation
  // qualification: yup
  //   .string()
  //   .min(3, 'Enter valid qualification')
  //   .max(32, 'Too long')
  //   .required('Qualification is required'),

  // qualification validation
  profession: yup
    .string()
    .min(3, 'Enter valid profession')
    .max(32, 'Too long')
    .required('Profession is required'),

  relationship: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter a valid name')
    .min(3, 'Enter a valid name')
    .max(32, 'Enter a valid name')
    .required("Mother's Name is required"),
});
