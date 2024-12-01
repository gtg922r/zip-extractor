import React from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface PrefixInputProps {
  value: string
  onChange: (value: string) => void
}

export function PrefixInput({ value, onChange }: PrefixInputProps) {
  return (
    <Card className="w-full max-w-md p-4">
      <div className="space-y-2">
        <label htmlFor="prefix" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Filename Prefix
        </label>
        <Input
          id="prefix"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter prefix for downloaded files"
        />
      </div>
    </Card>
  )
} 