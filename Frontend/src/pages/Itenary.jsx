import React, { useState } from 'react'
import axios from 'axios'

const Itinerary = () => {
  const [fromWhere, setFromWhere] = useState('')
  const [toWhere, setToWhere] = useState('')
  const [budgetConstraint, setBudgetConstraint] = useState('')
  const [purposeToVisit, setPurposeToVisit] = useState('')
  const [daysToStay, setDaysToStay] = useState('')
  const [accommodationType, setAccommodationType] = useState('')
  const [tripType, setTripType] = useState('')
  const [whatJustifyYouBest, setWhatJustifyYouBest] = useState('')
  const [displayitenary, setDisplayitenary] = useState('none')
  const [displayForm, setDisplayForm] = useState('block')
  const [result,setResult] = useState('')

  // Function to validate form inputs
  const isFormValid = () => {
    return (
      fromWhere !== '' &&
      toWhere !== '' &&
      budgetConstraint !== '' &&
      purposeToVisit !== '' &&
      daysToStay !== '' &&
      accommodationType !== '' &&
      tripType !== '' &&
      whatJustifyYouBest !== ''
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isFormValid()) {
      alert('Please fill in all the fields before proceeding!')
      return
    }

    const data = {
      fromWhere: fromWhere,
      toWhere: toWhere,
      budgetConstraint: budgetConstraint,
      purposeToVisit: purposeToVisit,
      daysToStay: daysToStay,
      accommodationType: accommodationType,
      tripType: tripType,
      whatJustifyYouBest: whatJustifyYouBest
    }

    console.log('Data:', data)
    {
      setDisplayForm('none')
      setDisplayitenary('block')
    }
    const response = axios.post('http://localhost:3000/itenary', data);
    console.log(`response:`, response.data.data)
    setResult(response);
  }

  return (
    <div className='pb-30 pt-20'>
      <div className={`p-6 max-w-lg mx-auto font-sans ${displayForm === 'block' ? 'block' : 'hidden'}`} style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif', display: displayForm }}>
        <h2 className="text-2xl font-bold text-center mb-6" style={{ textAlign: 'center' }}>Create Your Itinerary</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label className='block text-sm font-medium mb-1'>From: </label>
            <input
              type="text"
              name="FromWhere"
              value={fromWhere}
              onChange={(e) => setFromWhere(e.target.value)}
              placeholder="Enter starting location"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label>To: </label>
            <input
              type="text"
              name="ToWhere"
              value={toWhere}
              onChange={(e) => setToWhere(e.target.value)}
              placeholder="Enter destination"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label>Budget: </label>
            <select
              name="BudgetConstraint"
              value={budgetConstraint}
              onChange={(e) => setBudgetConstraint(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select a budget</option>
              <option value="BudgetFriendly">Budget-Friendly</option>
              <option value="BudgetMedium">Budget-Medium</option>
              <option value="BudgetPremium">Budget-Premium</option>
            </select>
          </div>

          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label className='block text-sm font-medium mb-1'>Purpose of Visit: </label>
            <select
              name="PurposeToVisit"
              value={purposeToVisit}
              onChange={(e) => setPurposeToVisit(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select a purpose</option>
              <option value="ReligiousPlaces">Religious Places</option>
              <option value="HistoricalPlaces">Historical Places</option>
            </select>
          </div>

          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label className='block text-sm font-medium mb-1'>Days to Stay: </label>
            <input
              type="number"
              name="DaysToStay"
              value={daysToStay}
              onChange={(e) => setDaysToStay(e.target.value)}
              placeholder="Number of days"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label className="block text-sm font-medium mb-1">Accommodation Type: </label>
            <select
              name="AccomodationType"
              value={accommodationType}
              onChange={(e) => setAccommodationType(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select accommodation type</option>
              <option value="Hotel">Hotel</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>

          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label>Trip Type: </label>
            <select
              name="TripType"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select trip type</option>
              <option value="Solo">Solo</option>
              <option value="Friends">Friends</option>
              <option value="Family">Family</option>
            </select>
          </div>

          <div className='block text-sm font-medium mb-1' style={{ marginBottom: '15px' }}>
            <label className='block text-sm font-medium mb-1'>What Justifies You Best: </label>
            <select
              name="WhatJustifyYouBest"
              value={whatJustifyYouBest}
              onChange={(e) => setWhatJustifyYouBest(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select justification</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="old">Old</option>
            </select>
          </div>

          <div className="text-center" style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '6px 12px',
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: isFormValid() ? 1 : 0.5,
              }}
              className={`text-sm h-10 w-40 font-medium hover:bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-transform transform hover:scale-105 ${isFormValid() ? '' : 'opacity-50 cursor-not-allowed'
                }`}
              disabled={!isFormValid()} // Disable the button if the form is invalid
            >
              Create Itinerary
            </button>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-16">
              {/* Step 1 */}
              <div className="text-center max-w-xs">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <img src="placeholder-image.png" alt="Step 1" className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-4">01 CREATE YOUR ITINERARY</h3>
                <p className="text-base text-gray-600">
                  Give us your trip details, including your destination, duration, and interests (e.g. culture, adventure, food).
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center max-w-xs">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <img src="placeholder-image.png" alt="Step 2" className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-4">02 GET YOUR PERSONALIZED ITINERARY</h3>
                <p className="text-base text-gray-600">
                  Receive a detailed itinerary tailored to your preferences, complete with transportation, accommodation, and activity bookings.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center max-w-xs">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <img src="placeholder-image.png" alt="Step 3" className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-4">03 ENJOY YOUR TRIP!</h3>
                <p className="text-base text-gray-600">
                  Access your customized itinerary on email and enjoy a seamless travel experience!
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div style={{ display: displayitenary }}>
        {/* {result.} */}
        RESPONSE IS AVAILABLE IN YOUR CONSOLE CHECK IT
        <button style={{borderStyle:'solid'}} onClick={() => {
          setDisplayForm('block')
          setDisplayitenary('none')
        }}>Edit Itenary
        </button>
        <br />
      </div>
      
    </div>
  )
}

export default Itinerary