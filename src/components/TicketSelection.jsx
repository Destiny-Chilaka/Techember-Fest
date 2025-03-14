import React, { useState, useEffect } from "react";
import ProgressHeader from "./ProgressHeader";
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import barCode from '../assets/images/barcode.png';

const TicketSelection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // State for Step 1: Ticket Selection
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [numberOfTickets, setNumberOfTickets] = useState("1");

  // State for Step 2: Attendee Details
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoDataUrl, setProfilePhotoDataUrl] = useState(null); // State for base64 image
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  // State for validation and error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Ticket type options
  const ticketTypes = [
    { name: "Regular Access", price: "Free", available: "20/52" },
    { name: "VIP Access", price: "$150", available: "20/52" },
    { name: "VVIP Access", price: "$150", available: "20/52" },
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

  // Log current step for debugging
  useEffect(() => {
    console.log("Current Step updated to:", currentStep);
  }, [currentStep]);

  // Handle file upload and convert to data URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfilePhoto(file);
      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle navigation and validation
  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedTicketType || !numberOfTickets) {
        setErrorMessage("Please select a ticket type and number of tickets.");
        return;
      }
    } else if (currentStep === 2) {
      if (!profilePhoto || !name || !email || !specialRequest) {
        setErrorMessage("Please fill all fields and upload a profile photo.");
        return;
      }
      // Check for @ symbol in email
      if (!email.includes("@")) {
        setErrorMessage("Please enter a valid email with @ symbol.");
        return;
      }
    }

    setErrorMessage("");
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    setSelectedTicketType("");
    setNumberOfTickets("1");
    setProfilePhoto(null);
    setProfilePhotoDataUrl(null); // Clear image data URL
    setName("");
    setEmail("");
    setSpecialRequest("");
    setCurrentStep(1);
    setErrorMessage("");
    localStorage.clear();
  };

  const downloadTicket = () => {
    const ticketContent = `
      <!DOCTYPE html>
      <html>
      <body>
        <h2>Techember Fest '25 Ticket</h2>
        <p>Event Date: March 15, 2025 7:00 PM</p>
        <p>Location: 04 Rumens road, Ikoyi, Lagos</p>
        <p>Ticket Type: ${selectedTicketType}</p>
        <p>Number of Tickets: ${numberOfTickets}</p>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Special Request: ${specialRequest}</p>
        <p>Profile Photo:</p>
        ${profilePhotoDataUrl ? `<img src="${profilePhotoDataUrl}" alt="Profile" style="max-width: 300px;">` : "<p>Not uploaded</p>"}
        <p>Thank you for booking! Enjoy the event!</p>
      </body>
      </html>
    `;

    const blob = new Blob([ticketContent], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "techember_fest_ticket.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Reset to Step 1 after downloading
    handleCancel();
  };

  const borderTop = {
    borderTop: '1px dashed #0E464F' 
  };
  const borderBottom = {
    borderBottom: '1px dashed #0E464F' 
  };

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
              <p className="text-white/80  text-xs xs:text-sm mt-1 w-4/5 sm:w-3/5 mx-auto break-words">
                Join us for an unforgettable experience at [Event Name]! Secure your spot now.
              </p>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                📍 [Event Location] || March 15, 2025 7:00 PM
              </p>
            </div>
            <div className="w-full mx-auto bg-[#07373F] h-1 rounded-full my-6"></div></>
          )}
          
          {/* Step 1: Ticket Selection */}
          {currentStep === 1 && (
            <>
              {/* Ticket Type Selection */}
              <div className="mb-6">
                <p className="text-white font-light mb-2">Select Ticket Type:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#052228] p-4 rounded-2xl border border-[#07373F]">
                  {ticketTypes.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => setSelectedTicketType(type.name)}
                      className={`border-2 border-[#197686] p-2 text-sm rounded-lg font-light text-white hover:bg-[#12464E] transition-colors ${
                        selectedTicketType === type.name ? "bg-[#12464E]" : ""
                      }`}
                    >
                      <span className="block text-xl font-semibold py-1">{type.price}</span>
                      {type.name} <br /> {type.available}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Tickets */}
              <div className="mb-6">
                <p className="text-white font-light mb-2">Number of Tickets</p>
                <select
                  className="w-full p-2 bg-[#08252B] border border-[#07373F] text-white rounded-lg focus:outline-none"
                  value={numberOfTickets}
                  onChange={(e) => setNumberOfTickets(e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </>
          )}

          {/* Step 2: Attendee Details */}
          {currentStep === 2 && (
            <>
              <div className="mb-6 bg[#052228] border border-[#07373F] py-6 p-4 rounded-3xl">
                <p className="text-white font-light text-xl mb-2">Upload Profile Photo</p>
                <div className="sm:bg-[#00000033]">
                <div
                  className="flex items-center justify-center h-48 max-w-48 mx-auto border-3 border-[#24A0B5] rounded-3xl bg-[#0E464F] text-white"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden "
                    id="photo-upload"
                  />
                  
                  <label htmlFor="photo-upload" className="cursor-pointer text-center relative ">
                    {profilePhoto ? (
                      <p className="text-sm ">{profilePhoto.name}</p>
                    ) : (
                      <>
                        <p className="text-3xl absolute left-2/5  "><FaCloudDownloadAlt className=" text-center"/></p>
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
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-[#08252B] border border-[#07373F] text-white rounded-lg focus:outline-none"
                  
                />
              </div>
              <div className="mb-6 relative">
                 <FaEnvelope className="text-white absolute top-10  left-1 text-2xl" />
                <p className="text-white font-light mb-2">Enter your email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-7 bg-[#08252B] border border-[#07373F] text-white placeholder-white/70  rounded-lg focus:outline-none"
                  placeholder=" hello@avifolio.io"
                />
              </div>
              <div className="mb-6">
                <p className="text-white font-light mb-2">Special request?</p>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full p-2 bg-[#08252B] border border-[#07373F] text-white rounded-lg focus:outline-none"
                  placeholder="Textarea"
                  rows="4"
                />
              </div>
            </>
          )}

          {/* Step 3: Ticket Confirmation */}
          {currentStep === 3 && (
            <>
              <div>
              <p className="text-white font-bold text-2xl mb-2 text-center">Your Ticket is Booked!</p>
              <p className="text-white font-light text-sm mb-4 text-center break-words">Check your email for a copy you can <strong>download</strong></p>
                
                <div className=" p-4 rounded-2xl border border-[#0E464F] text-center bg-[#07373F]" style={borderBottom}>
                  <h3 className=" text-4xl  text-white font-semibold mb-2 road-rage-regular">Techember Fest '25</h3>
                  <p className="text-white font-light  mb-1">📅 March 15, 2025 7:00 PM</p>
                  <p className="text-white font-light mb-5">📍 04 Rumens road, Ikoyi, Lagos</p>
                  {profilePhotoDataUrl && (
                    <img
                      src={profilePhotoDataUrl}
                      alt="Profile"
                      className="mt-2 max-w-9/12 md:max-w-xs h-auto rounded-2xl mx-auto border-3 border-[#24A0B5]"
                    />
                  )}
                  <div className="border-3 border-[#133D44] p-3 rounded-2xl mt-4  bg-[#08343C] text-start ">
                  <div className="grid grid-cols-1 sm:grid-cols-2  ">
                  <p className="text-white/50 font-light sm:border-r-1 sm:border-r-[#12464E] p-1 border-b-1 border-b-[#12464E]">
                    Enter your name <br /><span className="font-semibold text-white">{name}</span>
                  </p>
                  <p className="text-white/50 font-light border-b-1 border-b-[#12464E] pl-2 overflow-hidden">
                    Enter your email* <br /><span className="font-semibold text-white">{email}</span> 
                  </p>
                  <p className="text-white/50 font-light sm:border-r-1 sm:border-r-[#12464E] border-b-1 border-b-[#12464E] ">
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
                </div>
              </div>
              {/* Barcode Section */}
              <div className="mb-4 border-2 border-t-dashed border-[#0E464F] p-2 rounded-2xl bg-[#07373F]" style={borderTop}>
                    <img
                      src={barCode}
                      alt="Barcode"
                      className="max-w-full h-auto mx-auto"
                    />
                  </div>
            </>
          )}

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-400 text-sm mb-4">{errorMessage}</p>
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