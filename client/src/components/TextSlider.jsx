// 



































"use client"

import { useState, useEffect } from "react"

const TextSlider = () => {
  const texts = [
    "A   Brand   By   Mr ~FZ 🤓 ",
    "50,000+ Happy Customers ⭐⭐⭐⭐⭐",
    "Premium Quality Art & Crafts 🎨",
    "A  Created   By   Mr ~MS 🤓 ",
    "Fast Delivery All Across Pakistan 🚚",
    "100% Satisfaction Guaranteed ✅",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, 5000) // 10 seconds

    return () => clearInterval(interval)
  }, [texts.length])

  return (
    <div className="bg-black text-white overflow-hidden relative h-10 flex items-center justify-center md:fixed md:top-0 md:z-50 md:w-full">
      <div className="relative w-full h-full flex items-center justify-center">
        {texts.map((text, index) => (
          <div
            key={index}
            className={`absolute w-full text-center text-sm font-medium whitespace-nowrap transition-all duration-500 ease-in-out transform ${
              index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TextSlider
