'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useRef } from 'react'
import { Upload, FileText, Trash2 } from 'lucide-react'

interface Document {
  id: string
  filename: string
  url: string
  type: string
  uploadedAt: string
}

export default function DocumentosPage() {
  const t = useTranslations('candidato.documents')
  const tc = useTranslations('common')

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      filename: 'CV_Juan_Perez.pdf',
      url: '#',
      type: 'application/pdf',
      uploadedAt: '2026-08-14',
    },
  ])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            filename: data.filename,
            url: data.url,
            type: data.type,
            uploadedAt: new Date().toISOString().split('T')[0],
          },
        ])
      } else {
        const err = await response.json()
        alert(err.error || 'Error uploading file')
      }
    } catch {
      alert('Connection error')
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(tc('confirm'))) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">{doc.filename}</p>
                    <p className="text-xs text-slate-500">
                      {t('uploaded')} {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      {tc('view')}
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? t('uploading') : t('uploadNew')}
            </Button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              {t('formatInfo')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
