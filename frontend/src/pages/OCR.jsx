import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Upload, 
  Camera, 
  Search, 
  CheckCircle,
  AlertCircle,
  FileImage,
  Zap,
  Eye,
  Calendar,
  DollarSign,
  Building2
} from 'lucide-react'

export default function OCR() {
  const [uploading, setUploading] = useState(false)
  const [analisando, setAnalisando] = useState(false)
  const [resultadoOCR, setResultadoOCR] = useState(null)
  const [contasEncontradas, setContasEncontradas] = useState([])
  const [dialogConfirmacao, setDialogConfirmacao] = useState(false)
  const [contaSelecionada, setContaSelecionada] = useState(null)
  const [historico, setHistorico] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    carregarHistorico()
  }, [])

  const carregarHistorico = async () => {
    try {
      const response = await fetch('/api/ocr/historico')
      const data = await response.json()
      
      if (response.ok) {
        setHistorico(data)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }

  const handleUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Apenas arquivos JPG, PNG ou PDF são permitidos",
        variant: "destructive"
      })
      return
    }

    if (file.size > 16 * 1024 * 1024) { // 16MB
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Tamanho máximo: 16MB",
        variant: "destructive"
      })
      return
    }

    try {
      setUploading(true)
      setAnalisando(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ocr/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setResultadoOCR(data.dados_extraidos)
        setContasEncontradas(data.contas_correspondentes)
        
        toast({
          title: "Sucesso",
          description: "Comprovante analisado com sucesso"
        })
        
        carregarHistorico()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao analisar comprovante",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar arquivo",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
      setAnalisando(false)
      event.target.value = ''
    }
  }

  const confirmarPagamento = async () => {
    if (!contaSelecionada || !resultadoOCR) return

    try {
      const response = await fetch('/api/ocr/confirmar-pagamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conta_id: contaSelecionada.conta.id,
          dados_pagamento: resultadoOCR
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Pagamento confirmado com sucesso"
        })
        
        setDialogConfirmacao(false)
        setContaSelecionada(null)
        setResultadoOCR(null)
        setContasEncontradas([])
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao confirmar pagamento",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      })
    }
  }

  const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00'
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : valor
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numero)
  }

  const formatarData = (data) => {
    if (!data) return '-'
    try {
      return new Date(data).toLocaleDateString('pt-BR')
    } catch {
      return data
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score) => {
    if (score >= 70) return 'default'
    if (score >= 40) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">OCR de Comprovantes</h1>
        <Button onClick={carregarHistorico} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Upload de comprovante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Analisar Comprovante de Pagamento
          </CardTitle>
          <CardDescription>
            Envie uma foto ou arquivo do comprovante para análise automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              <div className="space-y-4">
                {analisando ? (
                  <>
                    <Zap className="h-12 w-12 text-blue-500 mx-auto animate-pulse" />
                    <div>
                      <p className="text-lg font-medium text-blue-600">Analisando comprovante...</p>
                      <p className="text-sm text-gray-500">
                        Extraindo informações do documento
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Clique para enviar ou arraste o arquivo aqui
                      </p>
                      <p className="text-sm text-gray-500">
                        Suporta JPG, PNG e PDF (máx. 16MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado da análise */}
      {resultadoOCR && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Dados Extraídos
            </CardTitle>
            <CardDescription>
              Informações identificadas no comprovante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Valor</span>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatarMoeda(resultadoOCR.valor)}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Data</span>
                </div>
                <p>{formatarData(resultadoOCR.data)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Beneficiário</span>
                </div>
                <p>{resultadoOCR.beneficiario || 'Não identificado'}</p>
              </div>
              
              <div className="space-y-2">
                <span className="font-medium">Forma de Pagamento</span>
                <p>{resultadoOCR.forma_pagamento || 'Não identificado'}</p>
              </div>
              
              <div className="space-y-2">
                <span className="font-medium">Banco</span>
                <p>{resultadoOCR.banco || 'Não identificado'}</p>
              </div>
              
              <div className="space-y-2">
                <span className="font-medium">Documento</span>
                <p>{resultadoOCR.documento || 'Não identificado'}</p>
              </div>
            </div>
            
            {resultadoOCR.observacoes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Observações:</span>
                <p className="text-sm text-gray-600 mt-1">{resultadoOCR.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contas correspondentes */}
      {contasEncontradas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              Contas Correspondentes
            </CardTitle>
            <CardDescription>
              Contas a pagar que podem corresponder ao comprovante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contasEncontradas.map((item, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.conta.descricao}</h3>
                      <p className="text-sm text-gray-600">{item.conta.fornecedor}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getScoreBadge(item.score)}>
                        {item.score}% compatível
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Valor</span>
                      <p className="font-medium">{formatarMoeda(item.conta.valor_total)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Vencimento</span>
                      <p>{formatarData(item.conta.data_vencimento)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Categoria</span>
                      <p>{item.conta.categoria}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        setContaSelecionada(item)
                        setDialogConfirmacao(true)
                      }}
                      disabled={item.score < 30}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Pagamento
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {contasEncontradas.every(item => item.score < 30) && (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600">
                  Nenhuma conta com alta compatibilidade encontrada.
                </p>
                <p className="text-sm text-gray-500">
                  Verifique se os dados estão corretos ou cadastre a conta manualmente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Histórico de Análises
          </CardTitle>
          <CardDescription>
            Comprovantes analisados recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <div className="text-center py-8">
              <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum comprovante analisado ainda</p>
              <p className="text-sm text-gray-400 mt-2">
                Envie um comprovante para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historico.slice(0, 10).map((arquivo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{arquivo.nome}</p>
                      <p className="text-sm text-gray-500">
                        {formatarData(arquivo.data_upload)} • {(arquivo.tamanho / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação */}
      <Dialog open={dialogConfirmacao} onOpenChange={setDialogConfirmacao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pagamento</DialogTitle>
            <DialogDescription>
              Confirme se os dados extraídos correspondem à conta selecionada
            </DialogDescription>
          </DialogHeader>
          
          {contaSelecionada && resultadoOCR && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados do Comprovante</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Valor:</span>
                      <p className="text-green-600 font-bold">{formatarMoeda(resultadoOCR.valor)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Data:</span>
                      <p>{formatarData(resultadoOCR.data)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Beneficiário:</span>
                      <p>{resultadoOCR.beneficiario || 'Não identificado'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Forma:</span>
                      <p>{resultadoOCR.forma_pagamento || 'Não identificado'}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conta Selecionada</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Descrição:</span>
                      <p>{contaSelecionada.conta.descricao}</p>
                    </div>
                    <div>
                      <span className="font-medium">Fornecedor:</span>
                      <p>{contaSelecionada.conta.fornecedor}</p>
                    </div>
                    <div>
                      <span className="font-medium">Valor:</span>
                      <p className="font-bold">{formatarMoeda(contaSelecionada.conta.valor_total)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Vencimento:</span>
                      <p>{formatarData(contaSelecionada.conta.data_vencimento)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <p className="font-medium text-blue-800">
                    Compatibilidade: {contaSelecionada.score}%
                  </p>
                  <p className="text-sm text-blue-600">
                    {contaSelecionada.score >= 70 ? 'Alta compatibilidade' : 
                     contaSelecionada.score >= 40 ? 'Compatibilidade média' : 
                     'Baixa compatibilidade'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogConfirmacao(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmarPagamento}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Pagamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

