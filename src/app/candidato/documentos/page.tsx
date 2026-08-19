import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DocumentosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-medium text-slate-900">CV_Juan_Perez.pdf</p>
                <p className="text-xs text-slate-500">Subido hace 5 días</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Actualizar</Button>
          </div>
          <div className="mt-4 p-8 border-2 border-dashed rounded-lg text-center text-slate-500">
            Arrastrá archivos aquí o hacé click para subir
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
