import React from 'react'

interface TextWithLinksProps {
  text: string
  className?: string
}

export function TextWithLinks({ text, className = '' }: TextWithLinksProps) {
  // Regex để tìm URL
  const urlRegex = /(https?:\/\/[^\s]+)/g
  
  if (!text) return null

  const parts = text.split(urlRegex)
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {part}
            </a>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
} 