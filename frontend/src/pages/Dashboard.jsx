import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [resumo, setResumo] = useState({
    totalContas: 0,
    contasPendentes: 0,
    contasVencidas: 0,
    totalPendente: 0,
    notasFiscais: 0,
    proximosVencimentos: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarResumo()
  }, [])

  const carregarResumo = async () => {
    try {
      setLoading(true)
      
      // Buscar contas a pagar
      const contasResponse = await fetch('/api/contas-pagar/')
      const contasData = await contasResponse.json()
      
      // Buscar notas fiscais
      const notasResponse = await fetch('/api/notas-fiscais/')
      const notasData = await notasResponse.json()
      
      // Buscar contas vencidas
      const vencidasResponse = await fetch('/api/contas-pagar/vencidas')
      const vencidasData = await vencidasResponse.json()
      
      const totalContas = contasData.contas?.length || 0
      const contasPendentes = contasData.contas?.filter(c => c.status === 'pendente').length || 0
      const contasVencidas = vencidasData.length || 0
      const totalPendente = contasData.totalizadores?.total_pendente || 0
      const notasFiscais = notasData.length || 0
      
      // Próximos vencimentos (próximos 7 dias)
      const hoje = new Date()
      const proximaSemana = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const proximosVencimentos = contasData.contas?.filter(conta => {
        const vencimento = new Date(conta.data_vencimento)
        return vencimento >= hoje && vencimento <= proximaSemana && conta.status === 'pendente'
      }).slice(0, 5) || []
      
      setResumo({
        totalContas,
        contasPendentes,
        contasVencidas,
        totalPendente,
        notasFiscais,
        proximosVencimentos
      })
    } catch (error) {
      console.error('Erro ao carregar resumo:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={carregarResumo} variant="outline">
          Atualizar
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.totalContas}</div>
            <p className="text-xs text-muted-foreground">
              {resumo.contasPendentes} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(resumo.totalPendente)}</div>
            <p className="text-xs text-muted-foreground">
              A pagar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{resumo.contasVencidas}</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas Fiscais</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumo.notasFiscais}</div>
            <p className="text-xs text-muted-foreground">
              Cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos vencimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Vencimentos
            </CardTitle>
            <CardDescription>
              Contas que vencem nos próximos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resumo.proximosVencimentos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma conta vence nos próximos 7 dias
              </p>
            ) : (
              <div className="space-y-3">
                {resumo.proximosVencimentos.map((conta) => (
                  <div key={conta.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{conta.descricao}</p>
                      <p className="text-xs text-muted-foreground">{conta.fornecedor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatarMoeda(conta.valor_total)}</p>
                      <p className="text-xs text-muted-foreground">{formatarData(conta.data_vencimento)}</p>
                    </div>
                  </div>
                ))}
                <Link to="/contas-pagar">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver todas as contas
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/notas-fiscais" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Importar Nota Fiscal
              </Button>
            </Link>
            
            <Link to="/contas-pagar" className="block">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Lançar Conta a Pagar
              </Button>
            </Link>
            
            <Link to="/ocr" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="h-4 w-4 mr-2" />
                Analisar Comprovante
              </Button>
            </Link>
            
            <Link to="/dre" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Gerar DRE
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {resumo.contasVencidas > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atenção Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Você tem {resumo.contasVencidas} conta(s) vencida(s) que precisam de atenção.
            </p>
            <Link to="/contas-pagar?status=vencido" className="inline-block mt-2">
              <Button variant="destructive" size="sm">
                Ver contas vencidas
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

