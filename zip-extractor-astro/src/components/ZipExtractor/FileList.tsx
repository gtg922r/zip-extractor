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

  const splitPath = (path: string) => {
    const parts = path.split('/')
    const fileName = parts.pop() || ''
    const folderPath = parts.length > 0 ? parts.join('/') + '/' : ''
    return { folderPath, fileName }
  }

  return (
    <Card className="w-full max-w-md">
      <h3 className="text-lg font-semibold p-4">Files in ZIP:</h3>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {files.map((filePath) => {
          const { folderPath, fileName } = splitPath(filePath)
          return (
            <div
              key={filePath}
              className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer hover:bg-accent mb-1 ${
                selectedFiles.has(filePath) ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => onFileSelect(filePath)}
            >
              <span className="truncate flex-1 mr-4 text-sm">
                {folderPath && (
                  <span className="text-muted-foreground">{folderPath}</span>
                )}
                {fileName}
              </span>
              <div className="flex items-center gap-2">
                {isImage(filePath) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPreview(filePath)
                    }}
                    className="p-1 hover:bg-background/10 rounded"
                    title="Preview image"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                {isJson(filePath) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPreview(filePath)
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
                    onFileDownload(filePath)
                  }}
                  className="p-1 hover:bg-background/10 rounded"
                  title="Download file"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </ScrollArea>
    </Card>
  )
} 