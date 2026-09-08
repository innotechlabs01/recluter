'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useRef } from 'react'
import { Upload, FileText, Trash2 } from 'lucide-react'

interface Document {
  id: string
  filename: string
  url: string
  type: string | null
  uploadedAt: string | null
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/candidato/documents')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los documentos')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setDocuments(data as Document[])
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
        const res = await fetch('/api/candidato/documents')
        if (res.ok) {
          setDocuments((await res.json()) as Document[])
        } else {
          setDocuments((prev) => [
            ...prev,
            {
              id: data.id ?? String(Date.now()),
              filename: data.filename,
              url: data.url,
              type: data.type,
              uploadedAt: new Date().toISOString(),
            },
          ])
        }
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este archivo?')) return
    const res = await fetch(`/api/candidato/documents/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    }
  }

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>

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
                      Subido el {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('es-AR') : '—'}
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
                      Ver
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
            {documents.length === 0 && (
              <p className="text-sm text-slate-500">Todavía no subiste documentos.</p>
            )}
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
              {uploading ? 'Subiendo...' : 'Subir nuevo documento'}
            </Button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Formatos aceptados: PDF, JPG, PNG. Tamaño máximo: 5MB
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
