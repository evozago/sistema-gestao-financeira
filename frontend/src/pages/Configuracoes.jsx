import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { 
  Settings, 
  Plus, 
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Database,
  FileText,
  Building2,
  Calendar
} from 'lucide-react'

export default function Configuracoes() {
  const [planoContas, setPlanoContas] = useState([])
  const [despesasRecorrentes, setDespesasRecorrentes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogConta, setDialogConta] = useState(false)
  const [dialogDespesa, setDialogDespesa] = useState(false)
  
  const [novaConta, setNovaConta] = useState({
    codigo: '',
    nome: '',
    tipo: 'despesa',
    grupo: '',
    subgrupo: ''
  })

  const [novaDespesa, setNovaDespesa] = useState({
    descricao: '',
    fornecedor: '',
    categoria: '',
    valor: '',
    dia_vencimento: 1,
    periodicidade: 'mensal'
  })

  const { toast } = useToast()

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      
      // Carregar plano de contas
      const contasResponse = await fetch('/api/dre/plano-contas')
      const contasData = await contasResponse.json()
      if (contasResponse.ok) {
        setPlanoContas(contasData)
      }
      
      // Carregar despesas recorrentes
      const despesasResponse = await fetch('/api/contas-pagar/despesas-recorrentes')
      const despesasData = await despesasResponse.json()
      if (despesasResponse.ok) {
        setDespesasRecorrentes(despesasData)
      }
      
      // Carregar categorias
      const categoriasResponse = await fetch('/api/contas-pagar/categorias')
      const categoriasData = await categoriasResponse.json()
      if (categoriasResponse.ok) {
        setCategorias(categoriasData)
      }
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const criarDespesaRecorrente = async () => {
    try {
      const response = await fetch('/api/contas-pagar/despesas-recorrentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaDespesa)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Despesa recorrente criada com sucesso"
        })
        setDialogDespesa(false)
        setNovaDespesa({
          descricao: '',
          fornecedor: '',
          categoria: '',
          valor: '',
          dia_vencimento: 1,
          periodicidade: 'mensal'
        })
        carregarDados()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar despesa recorrente",
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

  const getTipoBadge = (tipo) => {
    const variants = {
      receita: 'default',
      despesa: 'destructive',
      custo: 'secondary'
    }
    
    const labels = {
      receita: 'Receita',
      despesa: 'Despesa',
      custo: 'Custo'
    }

    return (
      <Badge variant={variants[tipo] || 'secondary'}>
        {labels[tipo] || tipo}
      </Badge>
    )
  }

  const getPeriodicidadeBadge = (periodicidade) => {
    const variants = {
      mensal: 'default',
      trimestral: 'secondary',
      anual: 'outline'
    }
    
    const labels = {
      mensal: 'Mensal',
      trimestral: 'Trimestral',
      anual: 'Anual'
    }

    return (
      <Badge variant={variants[periodicidade] || 'secondary'}>
        {labels[periodicidade] || periodicidade}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <Button onClick={carregarDados} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plano de Contas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Plano de Contas
            </CardTitle>
            <CardDescription>
              Contas contábeis para classificação dos lançamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {planoContas.length} conta(s) cadastrada(s)
                </span>
                <Dialog open={dialogConta} onOpenChange={setDialogConta}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Conta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Conta Contábil</DialogTitle>
                      <DialogDescription>
                        Adicionar uma nova conta ao plano de contas
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="codigo">Código *</Label>
                          <Input
                            id="codigo"
                            value={novaConta.codigo}
                            onChange={(e) => setNovaConta({...novaConta, codigo: e.target.value})}
                            placeholder="Ex: 5.1.1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tipo">Tipo *</Label>
                          <select
                            id="tipo"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={novaConta.tipo}
                            onChange={(e) => setNovaConta({...novaConta, tipo: e.target.value})}
                          >
                            <option value="receita">Receita</option>
                            <option value="despesa">Despesa</option>
                            <option value="custo">Custo</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nome">Nome da Conta *</Label>
                        <Input
                          id="nome"
                          value={novaConta.nome}
                          onChange={(e) => setNovaConta({...novaConta, nome: e.target.value})}
                          placeholder="Nome da conta contábil"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="grupo">Grupo *</Label>
                          <Input
                            id="grupo"
                            value={novaConta.grupo}
                            onChange={(e) => setNovaConta({...novaConta, grupo: e.target.value})}
                            placeholder="Ex: despesas_operacionais"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="subgrupo">Subgrupo</Label>
                          <Input
                            id="subgrupo"
                            value={novaConta.subgrupo}
                            onChange={(e) => setNovaConta({...novaConta, subgrupo: e.target.value})}
                            placeholder="Subgrupo (opcional)"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogConta(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => {
                          // Implementar criação de conta
                          toast({
                            title: "Info",
                            description: "Funcionalidade em desenvolvimento"
                          })
                        }}>
                          Criar Conta
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planoContas.slice(0, 10).map((conta) => (
                      <TableRow key={conta.id}>
                        <TableCell className="font-mono text-sm">{conta.codigo}</TableCell>
                        <TableCell className="text-sm">{conta.nome}</TableCell>
                        <TableCell>{getTipoBadge(conta.tipo)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {planoContas.length > 10 && (
                <p className="text-sm text-gray-500 text-center">
                  E mais {planoContas.length - 10} conta(s)...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Despesas Recorrentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Despesas Recorrentes
            </CardTitle>
            <CardDescription>
              Despesas que se repetem mensalmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {despesasRecorrentes.length} despesa(s) recorrente(s)
                </span>
                <Dialog open={dialogDespesa} onOpenChange={setDialogDespesa}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Despesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Despesa Recorrente</DialogTitle>
                      <DialogDescription>
                        Configurar uma despesa que se repete periodicamente
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="descricao">Descrição *</Label>
                        <Input
                          id="descricao"
                          value={novaDespesa.descricao}
                          onChange={(e) => setNovaDespesa({...novaDespesa, descricao: e.target.value})}
                          placeholder="Descrição da despesa"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fornecedor">Fornecedor *</Label>
                          <Input
                            id="fornecedor"
                            value={novaDespesa.fornecedor}
                            onChange={(e) => setNovaDespesa({...novaDespesa, fornecedor: e.target.value})}
                            placeholder="Nome do fornecedor"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="categoria">Categoria *</Label>
                          <select
                            id="categoria"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={novaDespesa.categoria}
                            onChange={(e) => setNovaDespesa({...novaDespesa, categoria: e.target.value})}
                          >
                            <option value="">Selecione...</option>
                            {categorias.map(categoria => (
                              <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="valor">Valor *</Label>
                          <Input
                            id="valor"
                            type="number"
                            step="0.01"
                            value={novaDespesa.valor}
                            onChange={(e) => setNovaDespesa({...novaDespesa, valor: e.target.value})}
                            placeholder="0,00"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="dia">Dia Vencimento *</Label>
                          <Input
                            id="dia"
                            type="number"
                            min="1"
                            max="31"
                            value={novaDespesa.dia_vencimento}
                            onChange={(e) => setNovaDespesa({...novaDespesa, dia_vencimento: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="periodicidade">Periodicidade *</Label>
                          <select
                            id="periodicidade"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={novaDespesa.periodicidade}
                            onChange={(e) => setNovaDespesa({...novaDespesa, periodicidade: e.target.value})}
                          >
                            <option value="mensal">Mensal</option>
                            <option value="trimestral">Trimestral</option>
                            <option value="anual">Anual</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogDespesa(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={criarDespesaRecorrente}>
                          Criar Despesa
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {despesasRecorrentes.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma despesa recorrente configurada</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Configure despesas que se repetem mensalmente
                    </p>
                  </div>
                ) : (
                  despesasRecorrentes.map((despesa) => (
                    <div key={despesa.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{despesa.descricao}</h4>
                          <p className="text-sm text-gray-600">{despesa.fornecedor}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatarMoeda(despesa.valor)}</p>
                          {getPeriodicidadeBadge(despesa.periodicidade)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Categoria: {despesa.categoria}</span>
                        <span>Vence dia {despesa.dia_vencimento}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-gray-600">
                          Próximo: {formatarData(despesa.proximo_vencimento)}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categorias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Categorias de Despesas
            </CardTitle>
            <CardDescription>
              Categorias disponíveis para classificação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {categorias.length} categoria(s) disponível(is)
                </span>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categorias.map((categoria, index) => (
                  <Badge key={index} variant="outline" className="justify-center py-2">
                    {categoria}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
            <CardDescription>
              Dados sobre o sistema e configurações gerais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Versão:</span>
                  <p>1.0.0</p>
                </div>
                <div>
                  <span className="font-medium">Regime Fiscal:</span>
                  <p>Lucro Real</p>
                </div>
                <div>
                  <span className="font-medium">Banco de Dados:</span>
                  <p>SQLite</p>
                </div>
                <div>
                  <span className="font-medium">Última Atualização:</span>
                  <p>{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Funcionalidades Ativas</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">✓</Badge>
                    <span className="text-sm">Importação de XML NFe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">✓</Badge>
                    <span className="text-sm">OCR de Comprovantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">✓</Badge>
                    <span className="text-sm">Geração de DRE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">✓</Badge>
                    <span className="text-sm">Controle de Contas a Pagar</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Backup
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

