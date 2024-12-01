import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileContent: string | ArrayBuffer | null
  fileName: string
  fileType: 'image' | 'json'
}

export function FilePreviewModal({
  isOpen,
  onClose,
  fileContent,
  fileName,
  fileType,
}: FilePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {fileType === 'image' && fileContent && (
            <img
              src={fileContent as string}
              alt={fileName}
              className="max-w-full h-auto"
            />
          )}
          {fileType === 'json' && fileContent && (
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              <code>
                {JSON.stringify(
                  JSON.parse(fileContent as string),
                  null,
                  2
                )}
              </code>
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 