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
  const [displayitenary,setDisplayitenary] = useState('none')
  const [displayForm, setDisplayForm] = useState('block')

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
    const response = axios.post('http://localhost:3000/itenary',data);
    console.log(`response:`, response)
    if(response){
      setDisplayForm('none')
      setDisplayitenary('block')
    }
  }

  return (
    <>
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif', display: displayForm }}>
      <h2 style={{ textAlign: 'center' }}>Create Your Itinerary</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>From: </label>
          <input
            type="text"
            name="FromWhere"
            value={fromWhere}
            onChange={(e) => setFromWhere(e.target.value)}
            placeholder="Enter starting location"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>To: </label>
          <input
            type="text"
            name="ToWhere"
            value={toWhere}
            onChange={(e) => setToWhere(e.target.value)}
            placeholder="Enter destination"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Budget: </label>
          <select
            name="BudgetConstraint"
            value={budgetConstraint}
            onChange={(e) => setBudgetConstraint(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select a budget</option>
            <option value="BudgetFriendly">Budget-Friendly</option>
            <option value="BudgetMedium">Budget-Medium</option>
            <option value="BudgetPremium">Budget-Premium</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Purpose of Visit: </label>
          <select
            name="PurposeToVisit"
            value={purposeToVisit}
            onChange={(e) => setPurposeToVisit(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select a purpose</option>
            <option value="ReligiousPlaces">Religious Places</option>
            <option value="HistoricalPlaces">Historical Places</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Days to Stay: </label>
          <input
            type="number"
            name="DaysToStay"
            value={daysToStay}
            onChange={(e) => setDaysToStay(e.target.value)}
            placeholder="Number of days"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Accommodation Type: </label>
          <select
            name="AccomodationType"
            value={accommodationType}
            onChange={(e) => setAccommodationType(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select accommodation type</option>
            <option value="Hotel">Hotel</option>
            <option value="Hostel">Hostel</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Trip Type: </label>
          <select
            name="TripType"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select trip type</option>
            <option value="Solo">Solo</option>
            <option value="Friends">Friends</option>
            <option value="Family">Family</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>What Justifies You Best: </label>
          <select
            name="WhatJustifyYouBest"
            value={whatJustifyYouBest}
            onChange={(e) => setWhatJustifyYouBest(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select justification</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
            <option value="old">Old</option>
          </select>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              opacity: isFormValid() ? 1 : 0.5,
            }}
            disabled={!isFormValid()} // Disable the button if the form is invalid
          >
            Create Itinerary
          </button>
        </div>
      </form>
    </div>
    <div style={{display: displayitenary}}>
      BATAK
      <br />
      <button onClick={() => {
        setDisplayForm('block')
        setDisplayitenary('none')
      }}>Edit Itenary</button>
    </div>
    
    </>
  )
}

export default Itinerary
