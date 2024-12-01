import React from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Eye, Code } from 'lucide-react'

interface FileListProps {
  files: string[]
  selectedFiles: Set<string>
  onFileSelect: (fileName: string) => void
  onFileDownload: (fileName: string) => void
  onPreview: (fileName: string) => void
}

export function FileList({
  files,
  selectedFiles,
  onFileSelect,
  onFileDownload,
  onPreview,
}: FileListProps) {
  if (files.length === 0) return null

  const isImage = (fileName: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
  const isJson = (fileName: string) => /\.json$/i.test(fileName)

  return (
    <Card className="w-full max-w-md p-4">
      <h3 className="text-lg font-semibold mb-4">Files in ZIP:</h3>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {files.map((fileName) => (
          <div
            key={fileName}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent mb-2 ${
              selectedFiles.has(fileName) ? 'bg-primary text-primary-foreground' : ''
            }`}
            onClick={() => onFileSelect(fileName)}
          >
            <span className="truncate flex-1 mr-4">{fileName}</span>
            <div className="flex items-center gap-2">
              {isImage(fileName) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(fileName)
                  }}
                  className="p-1 hover:bg-background/10 rounded"
                  title="Preview image"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              {isJson(fileName) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(fileName)
                  }}
                  className="p-1 hover:bg-background/10 rounded"
                  title="View JSON"
                >
                  <Code className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFileDownload(fileName)
                }}
                className="p-1 hover:bg-background/10 rounded"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  )
} 