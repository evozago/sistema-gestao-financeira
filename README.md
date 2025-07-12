# Sistema de Gestão Financeira

Sistema completo de gestão financeira desenvolvido para empresas no regime de lucro real, com funcionalidades avançadas de processamento de notas fiscais, controle de contas a pagar, OCR de comprovantes e geração de DRE.

## 🚀 Funcionalidades Principais

### 📊 Dashboard Executivo
- Visão geral das finanças da empresa
- Indicadores de performance em tempo real
- Gráficos de receitas, despesas e fluxo de caixa
- Alertas de vencimentos e pendências

### 📄 Gestão de Notas Fiscais
- **Upload e processamento de XML NFe**
- Extração automática de dados fiscais
- Armazenamento organizado por fornecedor
- Visualização detalhada de produtos e valores
- Integração automática com contas a pagar

### 💰 Contas a Pagar
- Cadastro manual e automático de despesas
- Controle de parcelas e vencimentos
- Categorização por tipo de despesa
- Gestão de despesas recorrentes (água, luz, aluguel, folha)
- Filtros avançados por data, fornecedor e status
- Totalizadores e relatórios

### 🔍 OCR de Comprovantes
- **Análise automática de comprovantes de pagamento**
- Extração de dados via inteligência artificial
- Detecção automática de valor, data, beneficiário
- Busca inteligente de contas correspondentes
- Conciliação automática de pagamentos
- Confirmação de baixa com score de compatibilidade

### 📈 DRE - Demonstração do Resultado
- **Geração automática de DRE para lucro real**
- Classificação contábil automática
- Relatórios mensais e anuais
- Comparativos de performance
- Indicadores de margem e rentabilidade
- Sincronização com contas a pagar
- Lançamentos contábeis manuais

### ⚙️ Configurações
- Plano de contas contábeis
- Despesas recorrentes
- Categorias de despesas
- Backup e manutenção

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS
- **OpenAI API** - Processamento de OCR (opcional)

### Frontend
- **React** - Framework JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **React Router** - Roteamento SPA

## 📁 Estrutura do Projeto

```
sistema-gestao-financeira/
├── src/                          # Backend Flask
│   ├── models/                   # Modelos de dados
│   │   ├── nota_fiscal.py
│   │   ├── contas_pagar.py
│   │   ├── dre.py
│   │   └── user.py
│   ├── routes/                   # Rotas da API
│   │   ├── notas_fiscais.py
│   │   ├── contas_pagar.py
│   │   ├── ocr.py
│   │   └── dre.py
│   ├── static/                   # Arquivos estáticos (frontend build)
│   ├── templates/                # Templates HTML
│   ├── main.py                   # Aplicação principal
│   └── __init__.py
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── ui/              # Componentes UI (shadcn)
│   │   │   └── Layout.jsx
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NotasFiscais.jsx
│   │   │   ├── ContasPagar.jsx
│   │   │   ├── OCR.jsx
│   │   │   ├── DRE.jsx
│   │   │   └── Configuracoes.jsx
│   │   ├── hooks/               # Hooks customizados
│   │   ├── lib/                 # Utilitários
│   │   └── App.jsx
│   ├── dist/                    # Build de produção
│   └── package.json
├── uploads/                     # Arquivos temporários
├── requirements.txt             # Dependências Python
├── vercel.json                  # Configuração Vercel
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- pnpm ou npm

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd sistema-gestao-financeira
```

2. **Configure o backend**
```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt
```

3. **Configure o frontend**
```bash
cd frontend
pnpm install
pnpm run build
cd ..

# Copiar build para Flask
cp -r frontend/dist/* src/static/
```

4. **Executar a aplicação**
```bash
# Ativar ambiente virtual
source venv/bin/activate

# Executar servidor
python src/main.py
```

5. **Acessar o sistema**
- Abra o navegador em: `http://localhost:5000`

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente se necessário
3. O deploy será automático

### Outras Plataformas
- **Heroku**: Adicione `Procfile` com `web: python src/main.py`
- **Railway**: Configure `railway.json`
- **PythonAnywhere**: Upload dos arquivos e configuração WSGI

## 📊 Funcionalidades Detalhadas

### Processamento de XML NFe
- Suporte a NFe padrão brasileiro
- Extração de dados do emitente e destinatário
- Processamento de itens e valores
- Cálculo automático de impostos
- Geração automática de contas a pagar

### Sistema de OCR
- Análise de comprovantes PIX, TED, DOC
- Extração de dados bancários
- Reconhecimento de valores e datas
- Busca inteligente por correspondências
- Score de compatibilidade

### DRE Automatizado
- Classificação por plano de contas
- Agrupamento por natureza contábil
- Cálculo de margens e indicadores
- Comparativos mensais e anuais
- Exportação para Excel/PDF

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# Opcional: Para funcionalidade completa de OCR
OPENAI_API_KEY=sua_chave_openai
OPENAI_API_BASE=https://api.openai.com/v1
```

### Banco de Dados
- SQLite por padrão (arquivo `database.db`)
- Configurável para PostgreSQL ou MySQL
- Migrations automáticas na inicialização

### Customização
- Plano de contas editável
- Categorias de despesas personalizáveis
- Regras de classificação DRE configuráveis

## 📱 Interface Responsiva

O sistema foi desenvolvido com design responsivo, funcionando perfeitamente em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🔒 Segurança

- Validação de dados de entrada
- Sanitização de uploads
- Proteção contra CSRF
- Logs de auditoria
- Backup automático

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação técnica
- Verifique os logs da aplicação

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Integração com bancos via Open Banking
- [ ] Relatórios fiscais automatizados
- [ ] Dashboard mobile nativo
- [ ] Integração com contadores
- [ ] API para terceiros
- [ ] Backup em nuvem
- [ ] Múltiplas empresas
- [ ] Controle de usuários e permissões

---

**Desenvolvido com ❤️ para simplificar a gestão financeira empresarial**

