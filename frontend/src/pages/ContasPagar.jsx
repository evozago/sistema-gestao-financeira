import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Search, 
  Eye, 
  Filter,
  CreditCard,
  Calendar,
  DollarSign,
  Building2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function ContasPagar() {
  const [contas, setContas] = useState([])
  const [totalizadores, setTotalizadores] = useState({})
  const [loading, setLoading] = useState(true)
  const [dialogNova, setDialogNova] = useState(false)
  const [dialogDetalhes, setDialogDetalhes] = useState(false)
  const [dialogPagamento, setDialogPagamento] = useState(false)
  const [contaSelecionada, setContaSelecionada] = useState(null)
  const [categorias, setCategorias] = useState([])
  
  const [filtros, setFiltros] = useState({
    fornecedor: '',
    dataInicio: '',
    dataFim: '',
    status: '',
    categoria: '',
    tipo_despesa: ''
  })

  const [novaConta, setNovaConta] = useState({
    descricao: '',
    fornecedor: '',
    cnpj_fornecedor: '',
    tipo_despesa: 'operacional',
    categoria: '',
    valor_total: '',
    data_emissao: new Date().toISOString().split('T')[0],
    data_vencimento: '',
    observacoes: '',
    parcelas: []
  })

  const [novoPagamento, setNovoPagamento] = useState({
    data_pagamento: new Date().toISOString().split('T')[0],
    valor_pago: '',
    forma_pagamento: 'pix',
    observacoes: ''
  })

  const { toast } = useToast()

  useEffect(() => {
    carregarContas()
    carregarCategorias()
  }, [])

  const carregarContas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await fetch(`/api/contas-pagar/?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setContas(data.contas || [])
        setTotalizadores(data.totalizadores || {})
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar contas",
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

  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/contas-pagar/categorias')
      const data = await response.json()
      
      if (response.ok) {
        setCategorias(data)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const criarConta = async () => {
    try {
      const response = await fetch('/api/contas-pagar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaConta)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Conta criada com sucesso"
        })
        setDialogNova(false)
        setNovaConta({
          descricao: '',
          fornecedor: '',
          cnpj_fornecedor: '',
          tipo_despesa: 'operacional',
          categoria: '',
          valor_total: '',
          data_emissao: new Date().toISOString().split('T')[0],
          data_vencimento: '',
          observacoes: '',
          parcelas: []
        })
        carregarContas()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar conta",
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

  const verDetalhes = async (contaId) => {
    try {
      const response = await fetch(`/api/contas-pagar/${contaId}`)
      const data = await response.json()
      
      if (response.ok) {
        setContaSelecionada(data)
        setDialogDetalhes(true)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar detalhes da conta",
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

  const registrarPagamento = async () => {
    try {
      const response = await fetch(`/api/contas-pagar/${contaSelecionada.id}/pagamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoPagamento)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Pagamento registrado com sucesso"
        })
        setDialogPagamento(false)
        setNovoPagamento({
          data_pagamento: new Date().toISOString().split('T')[0],
          valor_pago: '',
          forma_pagamento: 'pix',
          observacoes: ''
        })
        carregarContas()
        if (dialogDetalhes) {
          verDetalhes(contaSelecionada.id)
        }
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao registrar pagamento",
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
      vencido: 'destructive',
      cancelado: 'outline'
    }
    
    const labels = {
      pendente: 'Pendente',
      pago: 'Pago',
      vencido: 'Vencido',
      cancelado: 'Cancelado'
    }

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const isVencida = (dataVencimento, status) => {
    if (status === 'pago') return false
    const hoje = new Date()
    const vencimento = new Date(dataVencimento)
    return vencimento < hoje
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contas a Pagar</h1>
        
        <div className="flex gap-2">
          <Button onClick={carregarContas} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Dialog open={dialogNova} onOpenChange={setDialogNova}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Conta a Pagar</DialogTitle>
                <DialogDescription>
                  Cadastre uma nova conta a pagar
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Input
                      id="descricao"
                      value={novaConta.descricao}
                      onChange={(e) => setNovaConta({...novaConta, descricao: e.target.value})}
                      placeholder="Descrição da conta"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fornecedor">Fornecedor *</Label>
                    <Input
                      id="fornecedor"
                      value={novaConta.fornecedor}
                      onChange={(e) => setNovaConta({...novaConta, fornecedor: e.target.value})}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={novaConta.cnpj_fornecedor}
                      onChange={(e) => setNovaConta({...novaConta, cnpj_fornecedor: e.target.value})}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="valor">Valor Total *</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={novaConta.valor_total}
                      onChange={(e) => setNovaConta({...novaConta, valor_total: e.target.value})}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tipo_despesa">Tipo de Despesa *</Label>
                    <select
                      id="tipo_despesa"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={novaConta.tipo_despesa}
                      onChange={(e) => setNovaConta({...novaConta, tipo_despesa: e.target.value})}
                    >
                      <option value="operacional">Operacional</option>
                      <option value="administrativa">Administrativa</option>
                      <option value="financeira">Financeira</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <select
                      id="categoria"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={novaConta.categoria}
                      onChange={(e) => setNovaConta({...novaConta, categoria: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="data_vencimento">Vencimento *</Label>
                    <Input
                      id="data_vencimento"
                      type="date"
                      value={novaConta.data_vencimento}
                      onChange={(e) => setNovaConta({...novaConta, data_vencimento: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={novaConta.observacoes}
                    onChange={(e) => setNovaConta({...novaConta, observacoes: e.target.value})}
                    placeholder="Observações adicionais"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogNova(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={criarConta}>
                    Criar Conta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Totalizadores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(totalizadores.total_geral || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {totalizadores.quantidade || 0} conta(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatarMoeda(totalizadores.total_pago || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatarMoeda(totalizadores.total_pendente || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {contas.filter(c => isVencida(c.data_vencimento, c.status)).length}
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="filtro-fornecedor">Fornecedor</Label>
              <Input
                id="filtro-fornecedor"
                placeholder="Nome do fornecedor"
                value={filtros.fornecedor}
                onChange={(e) => setFiltros({...filtros, fornecedor: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="filtro-categoria">Categoria</Label>
              <select
                id="filtro-categoria"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filtros.categoria}
                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              >
                <option value="">Todas</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="filtro-status">Status</Label>
              <select
                id="filtro-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="filtro-tipo">Tipo</Label>
              <select
                id="filtro-tipo"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filtros.tipo_despesa}
                onChange={(e) => setFiltros({...filtros, tipo_despesa: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="operacional">Operacional</option>
                <option value="administrativa">Administrativa</option>
                <option value="financeira">Financeira</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="filtro-data-inicio">Data Início</Label>
              <Input
                id="filtro-data-inicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="filtro-data-fim">Data Fim</Label>
              <Input
                id="filtro-data-fim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={carregarContas}>
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setFiltros({
                  fornecedor: '',
                  dataInicio: '',
                  dataFim: '',
                  status: '',
                  categoria: '',
                  tipo_despesa: ''
                })
                setTimeout(carregarContas, 100)
              }}
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de contas */}
      <Card>
        <CardHeader>
          <CardTitle>Contas a Pagar</CardTitle>
          <CardDescription>
            {contas.length} conta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4 p-4 border rounded">
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          ) : contas.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma conta encontrada</p>
              <p className="text-sm text-gray-400 mt-2">
                Cadastre uma nova conta para começar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contas.map((conta) => (
                    <TableRow 
                      key={conta.id}
                      className={isVencida(conta.data_vencimento, conta.status) ? 'bg-red-50' : ''}
                    >
                      <TableCell className="font-medium">{conta.descricao}</TableCell>
                      <TableCell>{conta.fornecedor}</TableCell>
                      <TableCell>{conta.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {formatarData(conta.data_vencimento)}
                          {isVencida(conta.data_vencimento, conta.status) && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatarMoeda(conta.valor_total)}</TableCell>
                      <TableCell>{getStatusBadge(conta.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verDetalhes(conta.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          {conta.status === 'pendente' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setContaSelecionada(conta)
                                setNovoPagamento({
                                  ...novoPagamento,
                                  valor_pago: conta.valor_total.toString()
                                })
                                setDialogPagamento(true)
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Pagar
                            </Button>
                          )}
                        </div>
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
              Detalhes da Conta: {contaSelecionada?.descricao}
            </DialogTitle>
            <DialogDescription>
              Informações completas da conta a pagar
            </DialogDescription>
          </DialogHeader>
          
          {contaSelecionada && (
            <div className="space-y-6">
              {/* Informações gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Descrição:</span>
                      <p>{contaSelecionada.descricao}</p>
                    </div>
                    <div>
                      <span className="font-medium">Fornecedor:</span>
                      <p>{contaSelecionada.fornecedor}</p>
                    </div>
                    {contaSelecionada.cnpj_fornecedor && (
                      <div>
                        <span className="font-medium">CNPJ:</span>
                        <p>{contaSelecionada.cnpj_fornecedor}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Categoria:</span>
                      <p>{contaSelecionada.categoria}</p>
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span>
                      <p>{contaSelecionada.tipo_despesa}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Valores e Datas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Valor Total:</span>
                      <p className="text-lg font-bold">{formatarMoeda(contaSelecionada.valor_total)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Data Emissão:</span>
                      <p>{formatarData(contaSelecionada.data_emissao)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Data Vencimento:</span>
                      <p>{formatarData(contaSelecionada.data_vencimento)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <div className="mt-1">{getStatusBadge(contaSelecionada.status)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Parcelas */}
              {contaSelecionada.parcelas?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Parcelas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parcela</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data Pagamento</TableHead>
                          <TableHead>Valor Pago</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contaSelecionada.parcelas.map((parcela) => (
                          <TableRow key={parcela.id}>
                            <TableCell>{parcela.numero}</TableCell>
                            <TableCell>{formatarData(parcela.data_vencimento)}</TableCell>
                            <TableCell>{formatarMoeda(parcela.valor)}</TableCell>
                            <TableCell>{getStatusBadge(parcela.status)}</TableCell>
                            <TableCell>
                              {parcela.data_pagamento ? formatarData(parcela.data_pagamento) : '-'}
                            </TableCell>
                            <TableCell>
                              {parcela.valor_pago ? formatarMoeda(parcela.valor_pago) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Pagamentos */}
              {contaSelecionada.pagamentos?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Pagamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Forma</TableHead>
                          <TableHead>Observações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contaSelecionada.pagamentos.map((pagamento) => (
                          <TableRow key={pagamento.id}>
                            <TableCell>{formatarData(pagamento.data_pagamento)}</TableCell>
                            <TableCell>{formatarMoeda(pagamento.valor_pago)}</TableCell>
                            <TableCell>{pagamento.forma_pagamento}</TableCell>
                            <TableCell>{pagamento.observacoes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {contaSelecionada.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{contaSelecionada.observacoes}</p>
                  </CardContent>
                </Card>
              )}

              {contaSelecionada.status === 'pendente' && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setNovoPagamento({
                        ...novoPagamento,
                        valor_pago: contaSelecionada.valor_total.toString()
                      })
                      setDialogPagamento(true)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registrar Pagamento
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de pagamento */}
      <Dialog open={dialogPagamento} onOpenChange={setDialogPagamento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Registre o pagamento da conta: {contaSelecionada?.descricao}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_pagamento">Data do Pagamento *</Label>
                <Input
                  id="data_pagamento"
                  type="date"
                  value={novoPagamento.data_pagamento}
                  onChange={(e) => setNovoPagamento({...novoPagamento, data_pagamento: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="valor_pago">Valor Pago *</Label>
                <Input
                  id="valor_pago"
                  type="number"
                  step="0.01"
                  value={novoPagamento.valor_pago}
                  onChange={(e) => setNovoPagamento({...novoPagamento, valor_pago: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
              <select
                id="forma_pagamento"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={novoPagamento.forma_pagamento}
                onChange={(e) => setNovoPagamento({...novoPagamento, forma_pagamento: e.target.value})}
              >
                <option value="pix">PIX</option>
                <option value="transferencia">Transferência</option>
                <option value="boleto">Boleto</option>
                <option value="cartao">Cartão</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div>
              <Label htmlFor="obs_pagamento">Observações</Label>
              <Textarea
                id="obs_pagamento"
                value={novoPagamento.observacoes}
                onChange={(e) => setNovoPagamento({...novoPagamento, observacoes: e.target.value})}
                placeholder="Observações sobre o pagamento"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogPagamento(false)}>
                Cancelar
              </Button>
              <Button onClick={registrarPagamento}>
                Registrar Pagamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

