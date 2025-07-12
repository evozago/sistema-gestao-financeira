import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Plus,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function DRE() {
  const [dre, setDre] = useState(null)
  const [comparativo, setComparativo] = useState([])
  const [planoContas, setPlanoContas] = useState([])
  const [lancamentos, setLancamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [dialogLancamento, setDialogLancamento] = useState(false)
  const [dialogComparativo, setDialogComparativo] = useState(false)
  
  const [periodo, setPeriodo] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  })

  const [novoLancamento, setNovoLancamento] = useState({
    conta_contabil_id: '',
    data_lancamento: new Date().toISOString().split('T')[0],
    valor: '',
    descricao: '',
    documento: ''
  })

  const { toast } = useToast()

  useEffect(() => {
    carregarPlanoContas()
    gerarDRE()
    carregarComparativo()
  }, [periodo])

  const carregarPlanoContas = async () => {
    try {
      const response = await fetch('/api/dre/plano-contas')
      const data = await response.json()
      
      if (response.ok) {
        setPlanoContas(data)
      }
    } catch (error) {
      console.error('Erro ao carregar plano de contas:', error)
    }
  }

  const gerarDRE = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/dre/gerar/${periodo.ano}/${periodo.mes}`)
      const data = await response.json()
      
      if (response.ok) {
        setDre(data)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao gerar DRE",
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

  const carregarComparativo = async () => {
    try {
      const response = await fetch(`/api/dre/comparativo?ano=${periodo.ano}`)
      const data = await response.json()
      
      if (response.ok) {
        setComparativo(data)
      }
    } catch (error) {
      console.error('Erro ao carregar comparativo:', error)
    }
  }

  const sincronizarContasPagar = async () => {
    try {
      const response = await fetch('/api/dre/sincronizar-contas-pagar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ano: periodo.ano,
          mes: periodo.mes
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message
        })
        gerarDRE()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao sincronizar",
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

  const criarLancamento = async () => {
    try {
      const response = await fetch('/api/dre/lancamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoLancamento)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Lançamento criado com sucesso"
        })
        setDialogLancamento(false)
        setNovoLancamento({
          conta_contabil_id: '',
          data_lancamento: new Date().toISOString().split('T')[0],
          valor: '',
          descricao: '',
          documento: ''
        })
        gerarDRE()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar lançamento",
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
    }).format(valor || 0)
  }

  const formatarPorcentagem = (valor, total) => {
    if (!total || total === 0) return '0%'
    return ((valor / total) * 100).toFixed(1) + '%'
  }

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">DRE - Demonstração do Resultado</h1>
        
        <div className="flex gap-2">
          <Dialog open={dialogLancamento} onOpenChange={setDialogLancamento}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
                <DialogDescription>
                  Criar um novo lançamento contábil
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="conta">Conta Contábil *</Label>
                  <select
                    id="conta"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={novoLancamento.conta_contabil_id}
                    onChange={(e) => setNovoLancamento({...novoLancamento, conta_contabil_id: e.target.value})}
                  >
                    <option value="">Selecione uma conta...</option>
                    {planoContas.map(conta => (
                      <option key={conta.id} value={conta.id}>
                        {conta.codigo} - {conta.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={novoLancamento.data_lancamento}
                      onChange={(e) => setNovoLancamento({...novoLancamento, data_lancamento: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="valor">Valor *</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={novoLancamento.valor}
                      onChange={(e) => setNovoLancamento({...novoLancamento, valor: e.target.value})}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    value={novoLancamento.descricao}
                    onChange={(e) => setNovoLancamento({...novoLancamento, descricao: e.target.value})}
                    placeholder="Descrição do lançamento"
                  />
                </div>

                <div>
                  <Label htmlFor="documento">Documento</Label>
                  <Input
                    id="documento"
                    value={novoLancamento.documento}
                    onChange={(e) => setNovoLancamento({...novoLancamento, documento: e.target.value})}
                    placeholder="Número do documento"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogLancamento(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={criarLancamento}>
                    Criar Lançamento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={sincronizarContasPagar} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>

          <Dialog open={dialogComparativo} onOpenChange={setDialogComparativo}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Comparativo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Comparativo Anual</DialogTitle>
                <DialogDescription>
                  Evolução dos resultados ao longo do ano
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={comparativo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(value)} />
                    <Line type="monotone" dataKey="receita_liquida" stroke="#8884d8" name="Receita Líquida" />
                    <Line type="monotone" dataKey="lucro_bruto" stroke="#82ca9d" name="Lucro Bruto" />
                    <Line type="monotone" dataKey="lucro_liquido" stroke="#ffc658" name="Lucro Líquido" />
                  </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparativo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(value)} />
                    <Bar dataKey="receita_bruta" fill="#8884d8" name="Receita Bruta" />
                    <Bar dataKey="despesas_operacionais" fill="#ff7300" name="Despesas Operacionais" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Seletor de período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="mes">Mês</Label>
              <select
                id="mes"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={periodo.mes}
                onChange={(e) => setPeriodo({...periodo, mes: parseInt(e.target.value)})}
              >
                {meses.map((mes, index) => (
                  <option key={index} value={index + 1}>{mes}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                value={periodo.ano}
                onChange={(e) => setPeriodo({...periodo, ano: parseInt(e.target.value)})}
                className="w-24"
              />
            </div>
            
            <Button onClick={gerarDRE} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar DRE'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DRE */}
      {dre && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>DRE - {dre.periodo}</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </CardTitle>
            <CardDescription>
              Demonstração do Resultado do Exercício
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Receitas */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">RECEITAS</h3>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Receita Bruta</span>
                    <span className="font-bold text-green-600">{formatarMoeda(dre.receita_bruta.valor)}</span>
                  </div>
                  
                  {Object.entries(dre.receita_bruta.detalhes || {}).map(([codigo, conta]) => (
                    <div key={codigo} className="flex justify-between items-center py-1 ml-4 text-sm">
                      <span>{conta.nome}</span>
                      <span>{formatarMoeda(conta.valor)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Deduções da Receita</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.deducoes_receita.valor)})</span>
                  </div>
                  
                  {Object.entries(dre.deducoes_receita.detalhes || {}).map(([codigo, conta]) => (
                    <div key={codigo} className="flex justify-between items-center py-1 ml-4 text-sm">
                      <span>{conta.nome}</span>
                      <span>({formatarMoeda(conta.valor)})</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center py-3 border-t-2 border-blue-200 bg-blue-50 px-2 rounded">
                    <span className="font-bold text-lg">RECEITA LÍQUIDA</span>
                    <span className="font-bold text-lg text-blue-600">{formatarMoeda(dre.receita_liquida)}</span>
                  </div>
                </div>
              </div>

              {/* Custos */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">CUSTOS</h3>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Custos das Vendas</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.custos_vendas.valor)})</span>
                  </div>
                  
                  {Object.entries(dre.custos_vendas.detalhes || {}).map(([codigo, conta]) => (
                    <div key={codigo} className="flex justify-between items-center py-1 ml-4 text-sm">
                      <span>{conta.nome}</span>
                      <span>({formatarMoeda(conta.valor)})</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center py-3 border-t-2 border-orange-200 bg-orange-50 px-2 rounded">
                    <span className="font-bold text-lg">LUCRO BRUTO</span>
                    <span className={`font-bold text-lg ${dre.lucro_bruto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarMoeda(dre.lucro_bruto)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Despesas Operacionais */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">DESPESAS OPERACIONAIS</h3>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Despesas Operacionais</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.despesas_operacionais.operacionais.valor)})</span>
                  </div>
                  
                  {Object.entries(dre.despesas_operacionais.operacionais.detalhes || {}).map(([codigo, conta]) => (
                    <div key={codigo} className="flex justify-between items-center py-1 ml-4 text-sm">
                      <span>{conta.nome}</span>
                      <span>({formatarMoeda(conta.valor)})</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Despesas Administrativas</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.despesas_operacionais.administrativas.valor)})</span>
                  </div>
                  
                  {Object.entries(dre.despesas_operacionais.administrativas.detalhes || {}).map(([codigo, conta]) => (
                    <div key={codigo} className="flex justify-between items-center py-1 ml-4 text-sm">
                      <span>{conta.nome}</span>
                      <span>({formatarMoeda(conta.valor)})</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Despesas de Vendas</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.despesas_operacionais.vendas.valor)})</span>
                  </div>
                  
                  {Object.entries(dre.despesas_operacionais.vendas.detalhes || {}).map(([codigo, conta]) => (
                    <div key={codigo} className="flex justify-between items-center py-1 ml-4 text-sm">
                      <span>{conta.nome}</span>
                      <span>({formatarMoeda(conta.valor)})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outras Receitas e Despesas */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-600">OUTRAS RECEITAS E DESPESAS</h3>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Outras Receitas</span>
                    <span className="font-bold text-green-600">{formatarMoeda(dre.outras_receitas.valor)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Outras Despesas</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.outras_despesas.valor)})</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Despesas Financeiras</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.despesas_financeiras.valor)})</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 bg-gray-50 px-2 rounded">
                    <span className="font-bold text-lg">LUCRO ANTES DO IR</span>
                    <span className={`font-bold text-lg ${dre.lucro_antes_ir >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatarMoeda(dre.lucro_antes_ir)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Impostos e Resultado Final */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">IMPOSTOS</h3>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Provisão para IR e CSLL</span>
                    <span className="font-bold text-red-600">({formatarMoeda(dre.impostos.valor)})</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-t-4 border-gray-800 bg-gray-100 px-4 rounded-lg">
                    <span className="font-bold text-xl">LUCRO LÍQUIDO DO EXERCÍCIO</span>
                    <div className="text-right">
                      <span className={`font-bold text-2xl ${dre.lucro_liquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarMoeda(dre.lucro_liquido)}
                      </span>
                      {dre.receita_liquida > 0 && (
                        <p className="text-sm text-gray-600">
                          {formatarPorcentagem(dre.lucro_liquido, dre.receita_liquida)} da receita líquida
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicadores */}
      {dre && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem Bruta</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatarPorcentagem(dre.lucro_bruto, dre.receita_liquida)}
              </div>
              <p className="text-xs text-muted-foreground">
                Lucro bruto / Receita líquida
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem Operacional</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatarPorcentagem(dre.lucro_antes_ir, dre.receita_liquida)}
              </div>
              <p className="text-xs text-muted-foreground">
                Lucro antes IR / Receita líquida
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem Líquida</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatarPorcentagem(dre.lucro_liquido, dre.receita_liquida)}
              </div>
              <p className="text-xs text-muted-foreground">
                Lucro líquido / Receita líquida
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resultado</CardTitle>
              {dre.lucro_liquido >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${dre.lucro_liquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dre.lucro_liquido >= 0 ? 'Lucro' : 'Prejuízo'}
              </div>
              <p className="text-xs text-muted-foreground">
                Resultado do período
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

