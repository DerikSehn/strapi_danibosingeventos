"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface SpeedometerInputProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  size?: number
  className?: string
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}

export function SpeedometerInput({
  value,
  min,
  max,
  step = 1,
  onChange,
  size = 250,
  label,
  className
}: SpeedometerInputProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Angles for the speedometer (open at bottom)
  // -120 (bottom-leftish) to 120 (bottom-rightish)
  const startAngle = -120
  const endAngle = 120
  const angleRange = endAngle - startAngle
  
  const center = size / 2
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  
  // Calculate current angle based on value
  const percentage = (value - min) / (max - min)
  const currentAngle = startAngle + (percentage * angleRange)
  
  const handleInteraction = (clientX: number, clientY: number) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = clientX - rect.left - center
    const y = clientY - rect.top - center
    
    // Calculate angle in degrees
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    
    // Convert to our coordinate system (0 at 12 o'clock)
    angle += 90
    
    // Normalize to -180 to 180
    if (angle > 180) angle -= 360
    
    // Clamp to our range
    let clampedAngle = Math.max(startAngle, Math.min(endAngle, angle))
    
    // If the user clicks in the "dead zone" at the bottom, snap to closest
    if (angle > endAngle && angle < 180) clampedAngle = endAngle
    if (angle < startAngle && angle > -180) clampedAngle = startAngle
    
    // Convert angle back to value
    const anglePercent = (clampedAngle - startAngle) / angleRange
    let newValue = min + (anglePercent * (max - min))
    
    // Apply step
    if (step > 0) {
        newValue = Math.round(newValue / step) * step
    }
    
    // Clamp value
    newValue = Math.max(min, Math.min(max, newValue))
    
    onChange(newValue)
  }
  
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleInteraction(e.clientX, e.clientY)
  }
  
  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
        e.preventDefault()
        handleInteraction(e.clientX, e.clientY)
    }
  }
  
  const onMouseUp = () => {
    setIsDragging(false)
  }
  
  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY)
  }
  
  const onTouchMove = (e: TouchEvent) => {
      if (isDragging) {
          e.preventDefault() // Prevent scrolling while dragging
          handleInteraction(e.touches[0].clientX, e.touches[0].clientY)
      }
  }

  useEffect(() => {
    if (isDragging) {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('touchmove', onTouchMove as any, { passive: false })
        window.addEventListener('touchend', onMouseUp)
    }
    return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
        window.removeEventListener('touchmove', onTouchMove as any)
        window.removeEventListener('touchend', onMouseUp)
    }
  }, [isDragging])

  // Motion number
  const numberSpring = useSpring(value, { stiffness: 100, damping: 20 })
  
  useEffect(() => {
    numberSpring.set(value)
  }, [value, numberSpring])
  
  const displayValue = useTransform(numberSpring, (latest) => Math.round(latest))

  return (
    <div className={cn("relative flex flex-col items-center justify-center select-none touch-none mx-auto", className)} style={{ width: size, height: size }}>
        <svg 
            ref={svgRef}
            width={size} 
            height={size} 
            className="cursor-pointer"
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
        >
            {/* Background Track */}
            <path 
                d={describeArc(center, center, radius, startAngle, endAngle)} 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round"
            />
            
            {/* Active Track */}
            <path 
                d={describeArc(center, center, radius, startAngle, currentAngle)} 
                fill="none" 
                stroke="#f97316" // Primary orange
                strokeWidth={strokeWidth} 
                strokeLinecap="round"
            />
            
            {/* Thumb/Knob */}
            <circle 
                cx={polarToCartesian(center, center, radius, currentAngle).x}
                cy={polarToCartesian(center, center, radius, currentAngle).y}
                r={strokeWidth / 1.5}
                fill="white"
                stroke="#f97316"
                strokeWidth={4}
                className="shadow-md"
            />
        </svg>
        
        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
            <motion.span className="text-5xl font-bold text-gray-800">
                {displayValue}
            </motion.span>
            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">{label}</span>
        </div>
    </div>
  )
}
