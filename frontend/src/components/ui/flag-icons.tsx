import React from 'react'
import { cn } from '@/lib/utils'

interface FlagIconProps {
  className?: string
  size?: number
}

export function VietnamFlag({ className = "", size = 16 }: FlagIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 900 600" 
      className={cn("drop-shadow-sm border border-gray-200", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="900" height="600" fill="#da251d"/>
      <polygon points="450,146.153 548.077,423.077 323.077,253.846 576.923,253.846 351.923,423.077" fill="#ff0"/>
    </svg>
  )
}

export function UnitedStatesFlag({ className = "", size = 16 }: FlagIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 900 600" 
      className={cn("drop-shadow-sm border border-gray-200", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="900" height="600" fill="#bf0a30"/>
      <rect width="900" height="46.15" fill="#fff"/>
      <rect y="92.3" width="900" height="46.15" fill="#fff"/>
      <rect y="184.6" width="900" height="46.15" fill="#fff"/>
      <rect y="276.9" width="900" height="46.15" fill="#fff"/>
      <rect y="369.2" width="900" height="46.15" fill="#fff"/>
      <rect y="461.5" width="900" height="46.15" fill="#fff"/>
      <rect y="553.8" width="900" height="46.15" fill="#fff"/>
      <rect width="360" height="323.1" fill="#002868"/>
      <g fill="#fff">
        <g id="s">
          <g id="t">
            <g id="u">
              <g id="v">
                <polygon id="w" points="24,13.5 26.5,20.5 34,20.5 27.5,25.5 30,32.5 24,28.5 18,32.5 20.5,25.5 14,20.5 21.5,20.5"/>
                <use href="#w" y="36"/>
                <use href="#w" y="72"/>
                <use href="#w" y="108"/>
                <use href="#w" y="144"/>
              </g>
              <use href="#v" y="180"/>
            </g>
            <use href="#u" y="216"/>
          </g>
          <use href="#t" x="72"/>
        </g>
        <use href="#s" x="144"/>
        <use href="#s" x="288"/>
        <use href="#t" x="216"/>
        <use href="#u" x="360"/>
        <use href="#v" x="432"/>
        <use href="#w" x="504"/>
      </g>
    </svg>
  )
}

export function JapanFlag({ className = "", size = 16 }: FlagIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 900 600" 
      className={cn("drop-shadow-sm border border-gray-200", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="900" height="600" fill="#fff"/>
      <circle cx="450" cy="300" r="180" fill="#bc002d"/>
    </svg>
  )
}

// Flag mapping object
export const flagComponents = {
  vi: VietnamFlag,
  en: UnitedStatesFlag,
  ja: JapanFlag,
} as const

export type FlagCode = keyof typeof flagComponents 