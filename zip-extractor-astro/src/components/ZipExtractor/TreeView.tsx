import React from 'react'
import { ChevronRight, ChevronDown, Folder, FileIcon, Download, Eye, Code } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TreeNodeProps {
  name: string
  path: string
  isDirectory: boolean
  children?: TreeNodeProps[]
  level: number
  isExpanded: boolean
  onToggle: (path: string) => void
  onFileSelect: (path: string) => void
  isSelected: boolean
  onPreview?: (path: string) => void
}

function TreeNode({
  name,
  path,
  isDirectory,
  children,
  level,
  isExpanded,
  onToggle,
  onFileSelect,
  isSelected,
  onPreview
}: TreeNodeProps) {
  const isImage = (fileName: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
  const isJson = (fileName: string) => /\.json$/i.test(fileName)

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-1 px-2 hover:bg-accent rounded-md cursor-pointer',
          isSelected && 'bg-primary text-primary-foreground',
          isDirectory && 'text-muted-foreground'
        )}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => (isDirectory ? onToggle(path) : onFileSelect(path))}
      >
        {isDirectory ? (
          <>
            <button
              className="p-0.5 hover:bg-background/10 rounded"
              onClick={(e) => {
                e.stopPropagation()
                onToggle(path)
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <Folder className="h-4 w-4" />
          </>
        ) : (
          <>
            <div className="w-4" />
            <FileIcon className="h-4 w-4" />
          </>
        )}
        <span className="text-sm truncate flex-1">{name}</span>
        {!isDirectory && (
          <div className="flex items-center gap-2">
            {isImage(name) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPreview?.(path)
                }}
                className="p-1 hover:bg-background/10 rounded"
                title="Preview image"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {isJson(name) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPreview?.(path)
                }}
                className="p-1 hover:bg-background/10 rounded"
                title="View JSON"
              >
                <Code className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {isDirectory && isExpanded && children && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.path} {...child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface TreeViewProps {
  files: string[]
  selectedFiles: Set<string>
  onFileSelect: (path: string) => void
  onPreview?: (path: string) => void
}

export function TreeView({
  files,
  selectedFiles,
  onFileSelect,
  onPreview
}: TreeViewProps) {
  const [expandedDirs, setExpandedDirs] = React.useState<Set<string>>(new Set(['/']))

  const fileTree = React.useMemo(() => {
    const tree: Record<string, TreeNodeProps> = {}
    
    // Create root node
    tree['/'] = {
      name: 'Root',
      path: '/',
      isDirectory: true,
      children: [],
      level: 0,
      isExpanded: expandedDirs.has('/'),
      onToggle: () => {},
      onFileSelect: () => {},
      isSelected: false
    }

    // Sort files to ensure directories are processed before their contents
    const sortedFiles = [...files].sort()

    // Build tree structure
    sortedFiles.forEach((filePath) => {
      const parts = filePath.split('/')
      let currentPath = ''
      
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1
        const parentPath = currentPath || '/'
        currentPath = currentPath ? `${currentPath}/${part}` : part

        if (!tree[currentPath]) {
          const node: TreeNodeProps = {
            name: part,
            path: currentPath,
            isDirectory: !isLast,
            children: [],
            level: index,
            isExpanded: expandedDirs.has(currentPath),
            onToggle: (path: string) => {
              setExpandedDirs((prev) => {
                const next = new Set(prev)
                if (next.has(path)) {
                  next.delete(path)
                } else {
                  next.add(path)
                }
                return next
              })
            },
            onFileSelect,
            isSelected: selectedFiles.has(currentPath),
            onPreview
          }

          tree[currentPath] = node

          // Add to parent's children
          if (tree[parentPath]) {
            tree[parentPath].children = tree[parentPath].children || []
            tree[parentPath].children.push(node)
          }
        }
      })
    })

    // Sort children of each directory
    Object.values(tree).forEach((node) => {
      if (node.children) {
        node.children.sort((a, b) => {
          // Directories come first
          if (a.isDirectory !== b.isDirectory) {
            return a.isDirectory ? -1 : 1
          }
          // Then sort alphabetically
          return a.name.localeCompare(b.name)
        })
      }
    })

    return tree['/']
  }, [files, expandedDirs, selectedFiles, onFileSelect, onPreview])

  return (
    <Card className="w-full max-w-md">
      <h3 className="text-lg font-semibold p-4">Files in ZIP:</h3>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <TreeNode {...fileTree} />
      </ScrollArea>
    </Card>
  )
} 