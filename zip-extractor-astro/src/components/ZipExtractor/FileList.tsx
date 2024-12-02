import React from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Eye, Code, WholeWord } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListTree, List } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface FileListProps {
  files: string[]
  selectedFiles: Set<string>
  onFileSelect: (fileName: string) => void
  onFileDownload: (fileName: string) => void
  onPreview: (fileName: string) => void
  viewMode: 'list' | 'tree'
  onViewModeChange: (mode: 'list' | 'tree') => void
  prefix: string
  onPrefixChange: (value: string) => void
  zipFileName: string
}

export function FileList({
  files,
  selectedFiles,
  onFileSelect,
  onFileDownload,
  onPreview,
  viewMode,
  onViewModeChange,
  prefix,
  onPrefixChange,
  zipFileName,
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
    <Card className="w-full max-w-2xl">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">
          <span className="text-muted-foreground">Files in </span>
          <span className="text-primary">{zipFileName}</span>
        </h3>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="p-2 hover:bg-accent rounded-md"
                title="Set filename prefix"
              >
                <WholeWord className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Filename Prefix</h4>
                <Input
                  type="text"
                  value={prefix}
                  onChange={(e) => onPrefixChange(e.target.value)}
                  placeholder="Enter prefix for downloaded files..."
                />
              </div>
            </PopoverContent>
          </Popover>
          <Tabs
            value={viewMode}
            onValueChange={(value) => onViewModeChange(value as 'list' | 'tree')}
          >
            <TabsList className="grid w-[120px] grid-cols-2">
              <TabsTrigger value="list" className="flex items-center justify-center gap-1 px-0">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="tree" className="flex items-center justify-center gap-1 px-0">
                <ListTree className="h-4 w-4" />
                Tree
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
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
              <span className="truncate min-w-0 flex-1 mr-4 text-sm">
                {folderPath && (
                  <span className="text-muted-foreground">{folderPath}</span>
                )}
                {fileName}
              </span>
              <div className="flex items-center gap-2 shrink-0">
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