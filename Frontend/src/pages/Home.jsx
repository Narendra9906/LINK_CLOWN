import React, { useState } from 'react';
import Bg1 from '../assets/Bg1.png'
import Bg2 from '../assets/Bg2.png'
import leftSlider from '../assets/leftSlider.png'
import rightSlider from '../assets/rightSlider.png'
import Poster from '../components/Poster';
import Content from '../components/Content';
import Review from '../components/Review'

const Home = () => {
  const images = [Bg1, Bg2]; // Array of image paths
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  };

  const prevSlide = () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300)
      setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  return (
    <>
            <div className="h-[500px] w-full bg-gray-200 flex  justify-center items-center">
                <div className='absolute text-white z-10' style={{ textAlign: 'center' }}>
                    <h2 className='text-4xl font-bold'>Plan Your Perfect Trip</h2>
                    <br />
                    <p className='font-100'>Your ultimate tool for creating unforgettable travel experiences.</p>
                </div>

                <div className='absolute flex justify-between items-center w-full px-10 z-20'>
                    <img className="w-12 h-12 opacity-60 cursor-pointer hover:scale-110 transition-transform duration-300" src={leftSlider} alt="previous" onClick={prevSlide} />
                    <img className="w-12 h-12 opacity-60 cursor-pointer hover:scale-110 transition-transform duration-300" src={rightSlider} alt="next" onClick={nextSlide} />
                </div>

                <img src={images[currentIndex]} alt="Hero Image" className={`h-full w-full object-cover brightness-75 z-0 transition-transform duration-300 ${isAnimating ? 'scale-105' : ''}`} />
            </div>


            {/* Features Overview */}
            <div className="pt-10 h-[800px] w-full flex-col justify-center items-centre">
                <div className='relative text-171A1F' style={{ textAlign: 'center' }}>
                    <h1 className='text-3xl font-bold'>Features Overview</h1>
                    <br />
                    <p>Discover how Travel Pro Simplifies your journey with cutting-edges tools <br /> designed to enhance your travel experience</p>
                </div>

                <div className="flex justify-center items-center h-1/2   pb-20 ">
                    <Content />
                    <Poster />
                </div>

                <div className="flex justify-center items-center h-1/2   pb-20 w-full">
                    <Poster />
                    <Content />
                </div>

            </div>

            {/* Feedback Section */}
            <div className='pt-10 h-[400px] w-full  flex flex-col justify-center items-center'>
                <h3 className='text-3xl font-bold mb-8'>Hear from our awesome users!</h3>
                <div className='w-3/4 flex justify-center items-center'>
                    <div className='flex overflow-x-auto space-x-8 scrollbar-hide'>
                        <Review name={"Ravi"} avatar={"4"} review={"Fine"} rating={"4star"}/>
                        <Review name={"Ravi"} avatar={"4"} review={"Fine"} rating={"4star"}/>
                        <Review name={"Ravi"} avatar={"4"} review={"Fine"} rating={"4star"}/>
                        <Review name={"Ravi"} avatar={"4"} review={"Fine"} rating={"4star"}/>
                        <Review name={"Ravi"} avatar={"4"} review={"Fine"} rating={"4star"}/>
                    </div>
                </div>
            </div>


            {/* Plan Your Journey Section */}
            <div className='py-40 h-[400px] flex-col justify-center items-center ' style={{ textAlign: 'center'}}>
                <h1 className='text-3xl font-bold '>Plan Your Journey</h1>
                <p>Start your adventure today by planning the trip of your dreams effortlessly.</p>
                <a href='#'><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded'>Start Planning</button></a>
            </div>
        </>
  )
}

export default Home