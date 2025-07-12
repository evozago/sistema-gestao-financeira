import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { 
  Upload, 
  FileText, 
  Search, 
  Eye, 
  Filter,
  Download,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react'

export default function NotasFiscais() {
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filtros, setFiltros] = useState({
    fornecedor: '',
    dataInicio: '',
    dataFim: '',
    status: ''
  })
  const [notaSelecionada, setNotaSelecionada] = useState(null)
  const [dialogDetalhes, setDialogDetalhes] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    carregarNotas()
  }, [])

  const carregarNotas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filtros.fornecedor) params.append('fornecedor', filtros.fornecedor)
      if (filtros.dataInicio) params.append('data_inicio', filtros.dataInicio)
      if (filtros.dataFim) params.append('data_fim', filtros.dataFim)
      if (filtros.status) params.append('status', filtros.status)
      
      const response = await fetch(`/api/notas-fiscais/?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setNotas(data)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar notas fiscais",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.xml')) {
      toast({
        title: "Erro",
        description: "Apenas arquivos XML são permitidos",
        variant: "destructive"
      })
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/notas-fiscais/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Nota fiscal ${data.numero_nota} processada com sucesso`
        })
        carregarNotas()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao processar XML",
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
      event.target.value = ''
    }
  }

  const verDetalhes = async (notaId) => {
    try {
      const response = await fetch(`/api/notas-fiscais/${notaId}`)
      const data = await response.json()
      
      if (response.ok) {
        setNotaSelecionada(data)
        setDialogDetalhes(true)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar detalhes da nota",
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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status) => {
    const variants = {
      pendente: 'secondary',
      pago: 'default',
      vencido: 'destructive'
    }
    
    const labels = {
      pendente: 'Pendente',
      pago: 'Pago',
      vencido: 'Vencido'
    }

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
        
        <div className="flex gap-2">
          <Button onClick={carregarNotas} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".xml"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Button disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Processando...' : 'Importar XML'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                placeholder="Nome do fornecedor"
                value={filtros.fornecedor}
                onChange={(e) => setFiltros({...filtros, fornecedor: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={carregarNotas}>
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setFiltros({fornecedor: '', dataInicio: '', dataFim: '', status: ''})
                setTimeout(carregarNotas, 100)
              }}
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de notas */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais Cadastradas</CardTitle>
          <CardDescription>
            {notas.length} nota(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4 p-4 border rounded">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : notas.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma nota fiscal encontrada</p>
              <p className="text-sm text-gray-400 mt-2">
                Importe um arquivo XML para começar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.map((nota) => (
                    <TableRow key={nota.id}>
                      <TableCell className="font-medium">
                        {nota.numero_nota}/{nota.serie}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{nota.fornecedor}</p>
                          <p className="text-sm text-gray-500">{nota.cnpj_fornecedor}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatarData(nota.data_emissao)}</TableCell>
                      <TableCell>{formatarMoeda(nota.valor_total)}</TableCell>
                      <TableCell>{getStatusBadge(nota.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => verDetalhes(nota.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalhes */}
      <Dialog open={dialogDetalhes} onOpenChange={setDialogDetalhes}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes da Nota Fiscal {notaSelecionada?.numero_nota}/{notaSelecionada?.serie}
            </DialogTitle>
            <DialogDescription>
              Informações completas da nota fiscal
            </DialogDescription>
          </DialogHeader>
          
          {notaSelecionada && (
            <div className="space-y-6">
              {/* Informações gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Fornecedor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{notaSelecionada.fornecedor}</p>
                    <p className="text-sm text-gray-500">CNPJ: {notaSelecionada.cnpj_fornecedor}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Valores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Valor Total:</span>
                        <span className="font-medium">{formatarMoeda(notaSelecionada.valor_total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Desconto:</span>
                        <span>{formatarMoeda(notaSelecionada.valor_desconto)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Valor Líquido:</span>
                        <span className="font-medium">{formatarMoeda(notaSelecionada.valor_liquido)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Produtos */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtos/Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Qtd</TableHead>
                          <TableHead>Valor Unit.</TableHead>
                          <TableHead>Valor Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notaSelecionada.produtos?.map((produto) => (
                          <TableRow key={produto.id}>
                            <TableCell>{produto.codigo}</TableCell>
                            <TableCell>{produto.descricao}</TableCell>
                            <TableCell>{produto.quantidade} {produto.unidade}</TableCell>
                            <TableCell>{formatarMoeda(produto.valor_unitario)}</TableCell>
                            <TableCell>{formatarMoeda(produto.valor_total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Parcelas */}
              {notaSelecionada.parcelas?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Parcelas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parcela</TableHead>
                            <TableHead>Vencimento</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {notaSelecionada.parcelas.map((parcela) => (
                            <TableRow key={parcela.id}>
                              <TableCell>{parcela.numero}</TableCell>
                              <TableCell>{formatarData(parcela.data_vencimento)}</TableCell>
                              <TableCell>{formatarMoeda(parcela.valor)}</TableCell>
                              <TableCell>{getStatusBadge(parcela.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Informações adicionais */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Data de Emissão:</span>
                      <p>{formatarData(notaSelecionada.data_emissao)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Chave de Acesso:</span>
                      <p className="break-all">{notaSelecionada.chave_acesso}</p>
                    </div>
                    {notaSelecionada.observacoes && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Observações:</span>
                        <p>{notaSelecionada.observacoes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

