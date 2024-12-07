import React, { useState, useCallback } from 'react'
import JSZip from 'jszip'
import { Button } from '@/components/ui/button'
import { DropZone } from './DropZone'
import { FileList } from './FileList'
import { TreeView } from './TreeView'
import { FilePreviewModal } from './FilePreviewModal'

export function ZipExtractor() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [prefix, setPrefix] = useState('')
  const [zipInstance, setZipInstance] = useState<JSZip | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list')
  const [zipFileName, setZipFileName] = useState('')
  const [previewFile, setPreviewFile] = useState<{
    name: string
    content: string | ArrayBuffer | null
    type: 'image' | 'json'
  } | null>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const zip = new JSZip()
      const zipData = await zip.loadAsync(file)
      const fileNames = Object.keys(zipData.files).filter(
        (name) => !zipData.files[name].dir
      )
      setFiles(fileNames)
      setSelectedFiles(new Set())
      setZipInstance(zip)
      setZipFileName(file.name)
      setPrefix(file.name.replace(/\.zip$/, '') + '_')
    } catch (e) {
      alert('The file could not be loaded as a ZIP file.')
    }
  }, [])

  const toggleFileSelection = useCallback((fileName: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(fileName)) {
        next.delete(fileName)
      } else {
        next.add(fileName)
      }
      return next
    })
  }, [])

  const downloadFile = useCallback(async (fileName: string) => {
    if (!zipInstance) return

    const file = zipInstance.file(fileName)
    if (!file) return

    const blob = await file.async('blob')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = prefix ? `${prefix}${fileName}` : fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [zipInstance, prefix])

  const previewFileContent = useCallback(async (fileName: string) => {
    if (!zipInstance) return

    const file = zipInstance.file(fileName)
    if (!file) return

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
    const isJson = /\.json$/i.test(fileName)

    if (!isImage && !isJson) return

    const blob = await file.async('blob')
    
    if (isImage) {
      const url = URL.createObjectURL(blob)
      setPreviewFile({
        name: fileName,
        content: url,
        type: 'image'
      })
    } else {
      const text = await file.async('text')
      try {
        JSON.parse(text) // Validate JSON
        setPreviewFile({
          name: fileName,
          content: text,
          type: 'json'
        })
      } catch (e) {
        alert('Invalid JSON file')
      }
    }
  }, [zipInstance])

  const downloadSelectedFiles = useCallback(async () => {
    if (!zipInstance) return

    for (const fileName of selectedFiles) {
      await downloadFile(fileName)
    }
  }, [zipInstance, selectedFiles, downloadFile])

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen bg-background text-foreground"> 
      <div className="w-full max-w-2xl mt-2">
        <div className="flex items-center">
          <img src="/zip-extractor/zip-extractor.png" alt="ZIP Extractor Logo" className="h-4 w-4" />
          <h1 className="text-xl font-bold">IP Extractor</h1>
        </div>
      </div>
      <DropZone onFileSelect={handleFileSelect} />
      {files.length > 0 && (
        <>
          {viewMode === 'list' ? (
            <FileList
              files={files}
              selectedFiles={selectedFiles}
              onFileSelect={toggleFileSelection}
              onFileDownload={downloadFile}
              onPreview={previewFileContent}
              viewMode={viewMode}
              onViewModeChange={(value) => setViewMode(value)}
              prefix={prefix}
              onPrefixChange={setPrefix}
              zipFileName={zipFileName}
            />
          ) : (
            <TreeView
              files={files}
              selectedFiles={selectedFiles}
              onFileSelect={toggleFileSelection}
              onPreview={previewFileContent}
              viewMode={viewMode}
              onViewModeChange={(value) => setViewMode(value)}
              prefix={prefix}
              onPrefixChange={setPrefix}
              zipFileName={zipFileName}
            />
          )}
          {selectedFiles.size > 0 && (
            <Button onClick={downloadSelectedFiles}>
              Download Selected Files
            </Button>
          )}
        </>
      )}
      {previewFile && (
        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          fileContent={previewFile.content}
          fileName={previewFile.name}
          fileType={previewFile.type}
        />
      )}
    </div>
  )
} 