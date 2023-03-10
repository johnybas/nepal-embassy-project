import 'react-datepicker/dist/react-datepicker.css';

import AirportInput, {
  AirportTypes,
  airports,
} from '@components/travel/AirportInput';
import React, { useEffect, useState } from 'react';
import {
  TravelPurposes,
  nepalDistricts,
  provinces,
} from 'content/drop-down-items';
import toast, { Toaster } from 'react-hot-toast';

import { CheckTravelPurpose } from '@utils/applyNocByEmp';
import CommonFiles from '@components/citizen/applyForNoc/CommonFiles';
import { Countries } from 'content/drop-down-items';
import { FetchData } from '@utils/fetcher';
import GulfAirportSelect from '@components/travel/GulfAiportSelect';
import { GulfCountriesProps } from '@components/travel/airports-gulfs';
import GulfSelect from '@components/travel/GulfSelect';
import LivingInIndia from '@components/travel/LivingInIndia';
import LivingInIndiaFiles from '@components/citizen/applyForNoc/LivingInIndia';
import Loading from '@components/common/Loading';
import ProfileDetail from '@components/citizen/applyForNoc/ProfileDetail';
import RespectiveFiles from '@components/citizen/applyForNoc/RespectiveFiles';
import TravelVia from '@components/travel/TravelVia';
import { UserDetailProps } from 'pages/citizen/profile';
import authStore from '@store/adminAuthStore';
import { getUserProfileByEmp } from '@content/api-urls';
import pageTitleStore from '@store/selectUsersStore';

const NocRegistration: React.FC<{ profileId: string }> = ({ profileId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = authStore();

  const [travelFrom, setTravelFrom] = useState('');
  const [travelVia, setTravelVia] = useState<string>('');

  const [destination, setDestination] = useState<string>('');
  const [travelCountry, setTravelCountry] = useState('');

  const [travelDate, setTravelDate] = useState('');
  const [district, setDistrict] = useState('Humla');
  const [province, setProvince] = useState(provinces[0].value);
  const [returnDate, setReturnDate] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [travelPurpose, setTravelPurpose] = useState('1');

  const [selectedGulf, setSelectedGulf] = useState<GulfCountriesProps>();
  const [travelType, setTravelType] = useState('Direct');

  const [profile, setProfile] = useState<UserDetailProps | undefined>();

  //All travel purpose
  const [visa, setVisa] = useState<File>();
  const [passport, setPassport] = useState<File>();
  const [airTicket, setAirTicket] = useState<File>();

  // General tourist
  const [hotelBooking, setHotelBooking] = useState<File>();
  const [flightBooking, setFlightBooking] = useState<File>();
  const [nagarita, setNagarita] = useState<File>();
  const [writeUp, setWriteUp] = useState<File>();

  const [rentalAgreement, setRentalAgreement] = useState<File>();
  const [residenceProof, setResidenceProof] = useState<File>();

  const [offerLetter, setOfferLetter] = useState<File>();

  const [landlordWriteup, setLandlordWriteup] = useState<File>();

  const [departure, setDeparture] = useState<File>();
  const [arrivalDocument, setArrivalDocument] = useState<File>();
  const [livingInIndia, setLivingInIndia] = useState(false);

  const [familyRelationDocument, setfamilyRelationDocument] = useState<File>();
  const [RelativePassport, setRelativePassport] = useState<File>();
  const [relativeNagarita, setRelativeNagarita] = useState<File>();
  const [sponsorshipLetter, setSponsorshipLetter] = useState<File>();

  const [clearanceDocument, setClearanceDocument] = useState<File>();

  const [ministryLetter, setMinistryLetter] = useState<File>();
  const [invitationLetter, setInvitationLetter] = useState<File>();

  const [gatsOfferLetter, setGatsOfferLetter] = useState<File>();
  const [purposeApplication, setPurposeApplication] = useState<File>();

  const [eduOfferLetter, setEduOfferLetter] = useState<File>();
  const [marksheet, setMarksheet] = useState<File>();
  const [transferCertificate, setTransferCertificate] = useState<File>();
  const [bankProof, setBankProof] = useState<File>();

  function setLoading() {
    setIsLoading(false);
  }

  useEffect(() => {
    if (travelType == 'Direct') {
      console.log('Direct ', selectedGulf?.country!);
      setTravelCountry(selectedGulf?.country!);
      setTravelVia('');
    } else {
      setTravelCountry(destination);
      setTravelVia(selectedGulf?.country!);
    }
  }, [selectedGulf, travelType, destination]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const returnValue = await CheckTravelPurpose({
      profileId,
      travelFrom,
      travelCountry,
      travelVia,
      travelType,
      travelDate,
      district,
      province,
      returnDate,
      passportNumber,
      travelPurpose,
      livingInIndia,
      bankProof,
      visa,
      passport,
      airTicket,
      hotelBooking,
      flightBooking,
      nagarita,
      writeUp,
      rentalAgreement,
      residenceProof,
      offerLetter,
      landlordWriteup,
      departure,
      arrivalDocument,
      familyRelationDocument,
      RelativePassport,
      relativeNagarita,
      sponsorshipLetter,
      clearanceDocument,
      ministryLetter,
      invitationLetter,
      gatsOfferLetter,
      purposeApplication,
      eduOfferLetter,
      marksheet,
      transferCertificate,
      setLoading,
      token,
    });

    if (returnValue == 1) {
      toast.success('Applied Successful!');
      setIsLoading(false);
    } else {
      toast.error('Cannot applied!');
      setIsLoading(false);
    }
  };
  const { setPageTitle } = pageTitleStore();

  useEffect(() => {
    setPageTitle('Apply for NOC');
  }, []);

  const [selectedAirport, setSelectedAirport] = useState<AirportTypes>(
    airports[54]
  );

  type DistrictProps = {
    id: string;
    title: string;
    stateno: string;
  };
  const [copyDisctricts, setCopyDisctricts] = useState<DistrictProps[]>();

  useEffect(() => {
    const from = selectedAirport.city_name;
    setTravelFrom(from);
  }, [selectedAirport]);

  useEffect(() => {
    const getProfile = async () => {
      const returnValue = await FetchData(
        token,
        getUserProfileByEmp + profileId
      );
      setProfile(returnValue);
    };
    getProfile();
  }, []);

  useEffect(() => {
    const selectedProvinceId = provinces.find((p) => p.value == province);
    const copy = nepalDistricts.filter(
      (item) => item.stateno == selectedProvinceId?.pid.toString()
    );
    setCopyDisctricts(copy);
  }, [province]);

  return (
    <div className="relative bg-white">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-full bg-gray-50" />
      </div>
      <div className="relative max-w-full mx-auto lg:grid lg:grid-cols-6">
        <div className="px-4 py-16 bg-white sm:px-6 lg:col-span-4 lg:py-4 lg:px-8 xl:pl-12 ">
          <div className="max-w-lg mx-auto border rounded lg:max-w-none border-gray-200/50">
            <form
              method="POST"
              className=""
              onSubmit={(event) => handleSubmit(event)}
            >
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 space-y-6 bg-white sm:px-10 sm:py-3">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold tracking-tight text-blue-700 sm:text-2xl">
                      Apply for NOC
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 underline">
                      NOC will be provided after your application is verified
                    </p>
                  </div>

                  <Toaster />

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                      <AirportInput
                        selectedAirport={selectedAirport}
                        setSelectedAirport={setSelectedAirport}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                      <label
                        htmlFor="passport_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Passport Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        onChange={(e) => setPassportNumber(e.target.value)}
                        type="number"
                        minLength={6}
                        maxLength={7}
                        name="passport_number"
                        id="passport_number"
                        autoComplete="passport_number"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                      <TravelVia
                        setTravelType={setTravelType}
                        travelType={travelType}
                      />
                    </div>

                    <div
                      className={`col-span-6 sm:col-span-6 lg:col-span-3 ${
                        travelType == 'Direct' ? 'invisible' : 'visible'
                      }`}
                    >
                      <label
                        htmlFor="travel_country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Travel Destination
                      </label>
                      <select
                        id="travel_country"
                        required
                        name="travel_country"
                        autoComplete="travel_country"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => {
                          setDestination(e.target.value);
                        }}
                      >
                        {Countries.map((country, index) => (
                          <option key={index}>
                            {country.name + ' ' + '(' + country.code + ')'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                      <label
                        // htmlFor="travel-via"
                        className="block text-sm font-medium "
                      >
                        <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                          {travelType == 'Direct'
                            ? 'Travel Destination'
                            : 'TRAVEL VIA (Country)'}
                        </span>
                      </label>

                      <GulfSelect setSelectedGulf={setSelectedGulf} />
                    </div>
                    <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                      {selectedGulf && (
                        <>
                          <label
                            htmlFor="travel_country"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Airport
                          </label>
                          <GulfAirportSelect selectedCountry={selectedGulf} />
                        </>
                      )}
                    </div>

                    {travelType == 'Direct' && (
                      <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                        <dl>
                          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Bank Statement proof(proof of 6 Lakhs in Bank)
                            </dt>
                            <div className="flex">
                              <input
                                required
                                className="form-control"
                                type="file"
                                id="bank-proof"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.files != null) {
                                    setBankProof(e.target.files[0]);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </dl>
                      </div>
                    )}

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="travel-date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Travel Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setTravelDate(e.target.value);
                        }}
                        type="date"
                        name="travel-date"
                        id="travel-date"
                        autoComplete="travel-date"
                        placeholder="DD/MM/YYYY"
                        // pattern="Month dd, yyyy"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="province"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Province <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="province"
                        required
                        name="province"
                        autoComplete="province"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => {
                          setProvince(e.target.value);
                        }}
                      >
                        {provinces.map((item, index) => (
                          <option key={'Province-' + index} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="district"
                        className="block text-sm font-medium text-gray-700"
                      >
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="district"
                        required
                        name="district"
                        autoComplete="district"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => {
                          setDistrict(e.target.value);
                        }}
                      >
                        {copyDisctricts &&
                          copyDisctricts.map((item, index) => (
                            <option
                              key={'Nepal-district-' + index}
                              value={item.title}
                            >
                              {item.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="travel_purpose"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Return Date
                      </label>
                      <input
                        onChange={(e) => setReturnDate(e.target.value)}
                        type="date"
                        name="return_date"
                        id="return_date"
                        autoComplete="return_date"
                        placeholder="DD/MM/YYYY"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                      <LivingInIndia
                        livingInIndia={livingInIndia}
                        setLivingInIndia={setLivingInIndia}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                      {livingInIndia && (
                        <LivingInIndiaFiles
                          setRentalAgreement={setRentalAgreement}
                          setResidenceProof={setResidenceProof}
                        />
                      )}
                    </div>
                    <div className="col-span-6 sm:col-span-6 lg:col-span-4">
                      <label
                        htmlFor="travel-purpose"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Travel Purpose <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="travel-purpose"
                        required
                        name="travel-purpose"
                        autoComplete="travel-purpose"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => {
                          setTravelPurpose(e.target.value);
                        }}
                      >
                        {TravelPurposes.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="">
                    <dl>
                      <CommonFiles
                        setVisa={setVisa}
                        setPassport={setPassport}
                        setAirTicket={setAirTicket}
                      />
                      <RespectiveFiles
                        travelPurpose={travelPurpose}
                        setFlightBooking={setFlightBooking}
                        setNagarita={setNagarita}
                        setWriteUp={setWriteUp}
                        setRentalAgreement={setRentalAgreement}
                        setOfferLetter={setOfferLetter}
                        setLandlordWriteup={setLandlordWriteup}
                        setDeparture={setDeparture}
                        setArrivalDocument={setArrivalDocument}
                        setfamilyRelationDocument={setfamilyRelationDocument}
                        setRelativePassport={setRelativePassport}
                        setRelativeNagarita={setRelativeNagarita}
                        setSponsorshipLetter={setSponsorshipLetter}
                        setClearanceDocument={setClearanceDocument}
                        setMinistryLetter={setMinistryLetter}
                        setInvitationLetter={setInvitationLetter}
                        setGatsOfferLetter={setGatsOfferLetter}
                        setPurposeApplication={setPurposeApplication}
                        setEduOfferLetter={setEduOfferLetter}
                        setMarksheet={setMarksheet}
                        setTransferCertificate={setTransferCertificate}
                      />
                    </dl>
                  </div>
                </div>
                <div className="flex justify-center px-4 py-3 text-right bg-white sm:px-16">
                  {!isLoading ? (
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply NOC
                    </button>
                  ) : (
                    <LoadingButton />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <ProfileDetail profile={profile} />
      </div>
    </div>
  );
};

const LoadingButton = () => {
  return (
    <button
      type="button"
      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <Loading />
      Loading
    </button>
  );
};
export default NocRegistration;

export async function getServerSideProps(context: any) {
  const { profileId } = context.params;
  // const documentId = uid;
  return { props: { profileId } };
}
