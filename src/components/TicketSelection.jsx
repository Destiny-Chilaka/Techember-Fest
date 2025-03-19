import React, { useState, useEffect, useRef } from "react";
import ProgressHeader from "./ProgressHeader";
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import barCode from '../assets/images/barcode.png';
import domtoimage from 'dom-to-image';

const TicketSelection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // State for Step 1: Ticket Selection
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [numberOfTickets, setNumberOfTickets] = useState("0");

  // State for Step 2: Attendee Details
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoDataUrl, setProfilePhotoDataUrl] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  // State for validation and error messages
  const [errorMessageOne, setErrorMessageOne] = useState(""); // Step 1: Ticket type error
  const [errorMessageTickets, setErrorMessageTickets] = useState(""); // Step 1: Number of tickets error
  const [errorMessageStep2, setErrorMessageStep2] = useState(""); // Step 2: General error
  const [emailError, setEmailError] = useState(""); // Step 2: Email @ symbol error

  // State for tracking which fields have errors
  const [errorFields, setErrorFields] = useState({
    profilePhoto: false,
    name: false,
    email: false,
    specialRequest: false,
  });

  // Ref for the ticket content 
  const ticketRef = useRef(null);

  // Ticket type options
  const ticketTypes = [
    { name: "Regular Access", price: "Free", available: "10/70" },
    { name: "VIP Access", price: "$150", available: "50/100" },
    { name: "VVIP Access", price: "$300", available: "5/20" },
  ];

  // Load initial state from localStorage on component mount
  useEffect(() => {
    const savedTicketType = localStorage.getItem("selectedTicketType");
    const savedNumberOfTickets = localStorage.getItem("numberOfTickets");
    const savedName = localStorage.getItem("name");
    const savedEmail = localStorage.getItem("email");
    const savedSpecialRequest = localStorage.getItem("specialRequest");

    if (savedTicketType) setSelectedTicketType(savedTicketType);
    if (savedNumberOfTickets) setNumberOfTickets(savedNumberOfTickets);
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedSpecialRequest) setSpecialRequest(savedSpecialRequest);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedTicketType", selectedTicketType);
    localStorage.setItem("numberOfTickets", numberOfTickets);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("specialRequest", specialRequest);
  }, [selectedTicketType, numberOfTickets, name, email, specialRequest]);

  // Handle file upload and convert to data URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorFields((prev) => ({ ...prev, profilePhoto: false }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorFields((prev) => ({ ...prev, profilePhoto: false }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle navigation and validation
  const handleNext = () => {
    if (currentStep === 1) {
      let hasError = false;
      if (!numberOfTickets || numberOfTickets === "0") {
        setErrorMessageTickets("Please select number of tickets.");
        hasError = true;
      } else {
        setErrorMessageTickets("");
      }
      if (!selectedTicketType) {
        setErrorMessageOne("Please select a ticket type");
        hasError = true;
      } else {
        setErrorMessageOne("");
      }
      if (hasError) return;
    } else if (currentStep === 2) {
      const newErrorFields = {
        profilePhoto: false,
        name: false,
        email: false,
        specialRequest: false,
      };
      let hasEmptyFieldError = false;

      if (!profilePhoto) {
        newErrorFields.profilePhoto = true;
        hasEmptyFieldError = true;
      }
      if (!name) {
        newErrorFields.name = true;
        hasEmptyFieldError = true;
      }
      if (!email) {
        newErrorFields.email = true;
        hasEmptyFieldError = true;
      }
      if (!specialRequest) {
        newErrorFields.specialRequest = true;
        hasEmptyFieldError = true;
      }

      if (hasEmptyFieldError) {
        setErrorFields(newErrorFields);
        setErrorMessageStep2("Please fill all fields and upload a profile photo.");
        setEmailError("");
        return;
      }

      if (!email.includes("@")) {
        setErrorFields((prev) => ({ ...prev, email: true }));
        setErrorMessageStep2("");
        setEmailError("Please enter a valid email with @ symbol.");
        return;
      }

      setErrorMessageStep2("");
      setEmailError("");
      setErrorFields({
        profilePhoto: false,
        name: false,
        email: false,
        specialRequest: false,
      });
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    setSelectedTicketType("");
    setNumberOfTickets("0");
    setProfilePhoto(null);
    setProfilePhotoDataUrl(null);
    setName("");
    setEmail("");
    setSpecialRequest("");
    setCurrentStep(1);
    setErrorMessageOne("");
    setErrorMessageTickets("");
    setErrorMessageStep2("");
    setEmailError("");
    setErrorFields({
      profilePhoto: false,
      name: false,
      email: false,
      specialRequest: false,
    });
    localStorage.clear();
  };

  const downloadTicket = () => {
    const ticketElement = ticketRef.current;

    if (!ticketElement) {
      console.error("Ticket element not found!");
      return;
    }

    const images = ticketElement.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        domtoimage.toPng(ticketElement, {
          bgcolor: '#07373F',
          quality: 1,
          style: {
            fontFamily: '"RoadRage", sans-serif', // Ensure custom font is applied
          },
        })
          .then((imgData) => {
            console.log("PNG Data URL:", imgData);
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "techember_fest_ticket.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            handleCancel();
          })
          .catch((error) => {
            console.error("dom-to-image failed:", error);
          });
      })
      .catch((error) => {
        console.error("Image loading failed:", error);
      });
  };

  const borderTop = { borderTop: '1px dashed #0E464F' };
  const borderBottom = { borderBottom: '1px dashed #0E464F' };

  return (
    <div className="max-w-xl mx-auto">
      <div className="border border-[#0E464F] backdrop-blur-sm p-3 md:p-8 rounded-3xl shadow-lg bg-[#041E23]">
        <ProgressHeader currentStep={currentStep} totalSteps={totalSteps} />
        <div className="md:p-4 md:border md:border-[#0E464F] md:rounded-3xl md:bg-[#08252B]">
          {/* Event Details (Visible only in Step 1) */}
          {currentStep === 1 && (
            <>
              <div className="bg-[#07373f81] border-2 border-[#07373F] p-1 sm:p-4 rounded-lg mb-6 text-center">
                <h3 className="text-3xl md:text-5xl road-rage-regular">Techember Fest '25</h3>
                <p className="text-white/80 text-xs xs:text-sm mt-1 w-4/5 sm:w-3/5 mx-auto break-words">
                  Join us for an unforgettable experience at [Event Name]! Secure your spot now.
                </p>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  📍 [Event Location] || March 15, 2025 7:00 PM
                </p>
              </div>
              <div className="w-full mx-auto bg-[#07373F] h-1 rounded-full my-6"></div>
            </>
          )}

          {/* Step 1: Ticket Selection */}
          {currentStep === 1 && (
            <>
              <div className="mb-6">
                <p className="text-white font-light mb-2">Select Ticket Type:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#052228] p-4 rounded-2xl border border-[#07373F]">
                  {ticketTypes.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => {
                        setSelectedTicketType(type.name);
                        setErrorMessageOne("");
                      }}
                      className={`border-2 border-[#197686] p-2 text-sm rounded-lg font-light text-white hover:bg-[#12464E] transition-colors ${
                        selectedTicketType === type.name ? "bg-[#12464E]" : ""
                      }`}
                    >
                      <span className="block text-xl font-semibold py-1">{type.price}</span>
                      {type.name} <br /> {type.available}
                    </button>
                  ))}
                </div>
                {errorMessageOne && (
                  <p className="text-red-400 text-sm mt-2">{errorMessageOne}</p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-white font-light mb-2">Number of Tickets</p>
                <select
                  className="w-full p-2 bg-[#08252B] border border-[#07373F] text-white rounded-lg focus:outline-none"
                  value={numberOfTickets}
                  onChange={(e) => {
                    setNumberOfTickets(e.target.value);
                    setErrorMessageTickets("");
                  }}
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
                {errorMessageTickets && (
                  <p className="text-red-400 text-sm mt-2">{errorMessageTickets}</p>
                )}
              </div>
            </>
          )}

          {/* Step 2: Attendee Details */}
          {currentStep === 2 && (
            <>
              <div className={`mb-6 bg-[#052228] border border-[#07373F] py-6 p-4 rounded-3xl ${errorFields.profilePhoto ? "border-red-500" : ""}`}>
                <p className="text-white font-light text-xl mb-2">Upload Profile Photo</p>
                <div className="sm:bg-[#00000033]">
                  <div
                    className="flex items-center justify-center h-48 max-w-48 mx-auto border-3 border-[#24A0B5] rounded-3xl bg-[#0E464F] text-white relative group"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer text-center relative w-full h-full">
                      {profilePhotoDataUrl ? (
                        <>
                          <img
                            src={profilePhotoDataUrl}
                            alt="Profile Preview"
                            className="w-full h-full object-cover rounded-3xl"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-light">Drag & drop or click to upload</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl absolute left-2/5 top-3/5 transform -translate-y-1/2">
                            <FaCloudDownloadAlt className="text-center" />
                          </p>
                          <p className="text-md mt-10 font-light">Drag & drop or click to upload</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full mx-auto bg-[#07373F] h-1 rounded-full my-6"></div>
              <div className="mb-6">
                <p className="text-white font-light mb-2">Enter your name</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorFields((prev) => ({ ...prev, name: false }));
                  }}
                  className={`w-full p-2 bg-[#08252B] border rounded-lg focus:outline-none text-white ${
                    errorFields.name ? "border-red-500" : "border-[#07373F]"
                  }`}
                />
              </div>
              <div className="mb-6 relative">
                <FaEnvelope className="text-white absolute top-10 left-1 text-2xl" />
                <p className="text-white font-light mb-2">Enter your email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorFields((prev) => ({ ...prev, email: false }));
                    setEmailError("");
                  }}
                  className={`w-full py-2 px-7 bg-[#08252B] border rounded-lg focus:outline-none text-white placeholder-white/70 ${
                    errorFields.email ? "border-red-500" : "border-[#07373F]"
                  }`}
                  placeholder="hello@avifolio.io"
                />
              </div>
              <div className="mb-6">
                <p className="text-white font-light mb-2">Special request?</p>
                <textarea
                  value={specialRequest}
                  onChange={(e) => {
                    setSpecialRequest(e.target.value);
                    setErrorFields((prev) => ({ ...prev, specialRequest: false }));
                  }}
                  className={`w-full p-2 bg-[#08252B] border rounded-lg focus:outline-none text-white ${
                    errorFields.specialRequest ? "border-red-500" : "border-[#07373F]"
                  }`}
                  placeholder="Textarea"
                  rows="4"
                />
                {(errorMessageStep2 || emailError) && (
                  <p className="text-red-400 text-sm mt-2">
                    {errorMessageStep2 || emailError}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Step 3: Ticket Confirmation */}
          {currentStep === 3 && (
            <>
              <div>
                <p className="text-white font-bold text-2xl mb-2 text-center">Your Ticket is Booked!</p>
                <p className="text-white font-light text-sm mb-4 text-center break-words">
                  Check your email for a copy you can <strong>download</strong>
                </p>
                <div
                  className="p-4 rounded-2xl border border-[#0E464F] text-center bg-[#07373F]"
                  style={borderBottom}
                  ref={ticketRef}
                >
                  <h3 className="text-4xl text-white font-semibold mb-2 road-rage-regular">Techember Fest '25</h3>
                  <p className="text-white font-light mb-1">📅 March 15, 2025 7:00 PM</p>
                  <p className="text-white font-light mb-5">📍 04 Rumens road, Ikoyi, Lagos</p>
                  {profilePhotoDataUrl && (
                    <img
                      src={profilePhotoDataUrl}
                      alt="Profile"
                      className="mt-2 max-w-9/12 md:max-w-xs h-auto rounded-2xl mx-auto border-3 border-[#24A0B5]"
                      crossOrigin="anonymous"
                    />
                  )}
                  <div className="border-3 border-[#133D44] p-3 rounded-2xl mt-4 bg-[#08343C] text-start">
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <p className="text-white/50 font-light sm:border-r-1 sm:border-r-[#12464E] p-1 border-b-1 border-b-[#12464E]">
                        Enter your name <br /><span className="font-semibold text-white">{name}</span>
                      </p>
                      <p className="text-white/50 font-light border-b-1 border-b-[#12464E] pl-2 overflow-hidden">
                        Enter your email* <br /><span className="font-semibold text-white">{email}</span>
                      </p>
                      <p className="text-white/50 font-light sm:border-r-1 sm:border-r-[#12464E] border-b-1 border-b-[#12464E]">
                        Ticket Type <br /><span className="text-white font-semibold">{selectedTicketType}</span>
                      </p>
                      <p className="text-white/50 font-light border-b-1 border-b-[#12464E] pl-2">
                        Number of Tickets <br /><span className="text-white font-semibold">{numberOfTickets}</span>
                      </p>
                    </div>
                    <p className="text-white/50 font-light mt-3">
                      Special Request ? <br /><span className="text-white font-light">{specialRequest}</span>
                    </p>
                  </div>
                  {/* Ensure barcode is part of the ticket content */}
                  
                </div>
                <div className="mb-4 border-2 border-t-dashed border-[#0E464F] p-2 rounded-2xl bg-[#07373F]" style={borderTop}>
                    <img
                      src={barCode}
                      alt="Barcode"
                      className="max-w-full h-auto mx-auto"
                      crossOrigin="anonymous"
                    />
                  </div>
              </div>
            </>
          )}

          {/* Buttons */}
          <div
            className={`grid gap-4 ${
              currentStep === 3 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {currentStep < 3 && (
              <button
                onClick={handleCancel}
                className="border border-[#24A0B5] px-2 py-2 text-[#24A0B5] rounded-lg hover:bg-[#07373f81] transition-colors baskervville font-light"
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="border border-[#24A0B5] px-2 py-2 text-white rounded-lg bg-[#24A0B5] hover:bg-[#249fb59d] transition-colors baskervville font-light"
              >
                {currentStep === 1 ? "Next" : "Get My Free Ticket"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="border border-[#24A0B5] px-2 py-2 text-[#24A0B5] rounded-lg hover:bg-[#07373f81] transition-colors baskervville font-light"
                >
                  Book Another Ticket
                </button>
                <button
                  onClick={downloadTicket}
                  className="border border-[#24A0B5] px-2 py-2 text-white rounded-lg bg-[#24A0B5] hover:bg-[#249fb59d] transition-colors baskervville font-light"
                >
                  Download Ticket
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;