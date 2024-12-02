import React, { useCallback, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Upload } from 'lucide-react'

interface DropZoneProps {
  onFileSelect: (file: File) => void
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  return (
    <Card className="w-full max-w-2xl p-8">
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-primary/50 hover:border-primary hover:bg-primary/5'
        }`}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileInput}
          accept=".zip"
        />
        <Upload className={`mx-auto h-12 w-12 transition-colors duration-200 ${
          isDragging ? 'text-primary' : 'text-muted-foreground'
        }`} />
        <p className={`mt-4 text-sm transition-colors duration-200 ${
          isDragging ? 'text-primary' : 'text-muted-foreground'
        }`}>
          Drop your ZIP file here or click to browse
        </p>
      </div>
    </Card>
  )
} 