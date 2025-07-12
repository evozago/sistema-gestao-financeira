# 🚀 Guia Completo de Deploy - Sistema de Gestão Financeira

Este guia contém instruções detalhadas para fazer o deploy do sistema em diferentes plataformas.

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [GitHub + Vercel (Recomendado)](#github--vercel-recomendado)
3. [Heroku](#heroku)
4. [Railway](#railway)
5. [Netlify (Frontend Only)](#netlify-frontend-only)
6. [Docker](#docker)
7. [VPS/Servidor Próprio](#vpsservidor-próprio)
8. [Troubleshooting](#troubleshooting)

## 🔧 Pré-requisitos

### Contas Necessárias
- [ ] Conta no GitHub
- [ ] Conta no Vercel (ou plataforma escolhida)
- [ ] Git instalado localmente

### Ferramentas Locais
- [ ] Python 3.11+
- [ ] Node.js 20+
- [ ] pnpm (ou npm)
- [ ] Git

## 🌟 GitHub + Vercel (Recomendado)

### Passo 1: Preparar o Repositório GitHub

1. **Criar repositório no GitHub**
   ```bash
   # No GitHub, criar novo repositório
   # Nome sugerido: sistema-gestao-financeira
   ```

2. **Clonar e configurar localmente**
   ```bash
   git clone https://github.com/SEU_USUARIO/sistema-gestao-financeira.git
   cd sistema-gestao-financeira
   
   # Copiar todos os arquivos do sistema para este diretório
   # Incluir: src/, frontend/, requirements.txt, app.py, vercel.json, etc.
   ```

3. **Fazer primeiro commit**
   ```bash
   git add .
   git commit -m "Initial commit: Sistema de Gestão Financeira"
   git push origin main
   ```

### Passo 2: Deploy no Vercel

1. **Acessar Vercel**
   - Ir para [vercel.com](https://vercel.com)
   - Fazer login com GitHub

2. **Importar Projeto**
   - Clicar em "New Project"
   - Selecionar o repositório criado
   - Configurar como "Other" framework

3. **Configurações de Build**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: npm run build
   Output Directory: src/static
   Install Command: pip install -r requirements.txt
   ```

4. **Variáveis de Ambiente (Opcional)**
   ```
   OPENAI_API_KEY=sua_chave_openai (se quiser OCR completo)
   FLASK_ENV=production
   ```

5. **Deploy**
   - Clicar em "Deploy"
   - Aguardar conclusão
   - Acessar URL fornecida

### Passo 3: Configurar Domínio Personalizado (Opcional)

1. **No painel do Vercel**
   - Ir em "Settings" > "Domains"
   - Adicionar seu domínio
   - Configurar DNS conforme instruções

## 🟣 Heroku

### Passo 1: Preparar Aplicação

1. **Instalar Heroku CLI**
   ```bash
   # Windows
   # Baixar de: https://devcenter.heroku.com/articles/heroku-cli
   
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu
   sudo snap install --classic heroku
   ```

2. **Login no Heroku**
   ```bash
   heroku login
   ```

### Passo 2: Criar Aplicação

1. **Criar app no Heroku**
   ```bash
   heroku create nome-do-seu-app
   ```

2. **Configurar variáveis de ambiente**
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set OPENAI_API_KEY=sua_chave (opcional)
   ```

### Passo 3: Deploy

1. **Fazer deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

2. **Abrir aplicação**
   ```bash
   heroku open
   ```

## 🚂 Railway

### Passo 1: Conectar GitHub

1. **Acessar Railway**
   - Ir para [railway.app](https://railway.app)
   - Fazer login com GitHub

2. **Criar novo projeto**
   - Clicar em "New Project"
   - Selecionar "Deploy from GitHub repo"
   - Escolher o repositório

### Passo 2: Configurar Deploy

1. **Configurações automáticas**
   - Railway detecta automaticamente Python
   - Usa o arquivo `railway.json` para configurações

2. **Variáveis de ambiente**
   ```
   FLASK_ENV=production
   OPENAI_API_KEY=sua_chave (opcional)
   ```

3. **Deploy automático**
   - Deploy acontece automaticamente
   - URL gerada automaticamente

## 🟢 Netlify (Frontend Only)

**Nota:** Netlify é ideal apenas para o frontend. Para funcionalidade completa, use com backend separado.

### Passo 1: Preparar Frontend

1. **Build do frontend**
   ```bash
   cd frontend
   pnpm install
   pnpm run build
   ```

### Passo 2: Deploy no Netlify

1. **Acessar Netlify**
   - Ir para [netlify.com](https://netlify.com)
   - Fazer login

2. **Deploy manual**
   - Arrastar pasta `frontend/dist` para Netlify
   - Ou conectar repositório GitHub

3. **Configurar redirects**
   - Arquivo `netlify.toml` já configurado
   - SPA redirects funcionando

## 🐳 Docker

### Desenvolvimento Local

1. **Build e run**
   ```bash
   docker-compose up --build
   ```

2. **Acessar aplicação**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

### Produção

1. **Build imagem**
   ```bash
   docker build -t sistema-gestao-financeira .
   ```

2. **Run container**
   ```bash
   docker run -p 5000:5000 sistema-gestao-financeira
   ```

## 🖥️ VPS/Servidor Próprio

### Passo 1: Preparar Servidor

1. **Instalar dependências**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install python3.11 python3.11-venv nginx git nodejs npm
   
   # Instalar pnpm
   npm install -g pnpm
   ```

### Passo 2: Configurar Aplicação

1. **Clonar repositório**
   ```bash
   git clone https://github.com/SEU_USUARIO/sistema-gestao-financeira.git
   cd sistema-gestao-financeira
   ```

2. **Configurar backend**
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Build frontend**
   ```bash
   cd frontend
   pnpm install
   pnpm run build
   cd ..
   cp -r frontend/dist/* src/static/
   ```

### Passo 3: Configurar Nginx

1. **Criar configuração**
   ```nginx
   # /etc/nginx/sites-available/sistema-gestao
   server {
       listen 80;
       server_name seu-dominio.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

2. **Ativar site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/sistema-gestao /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Passo 4: Configurar Systemd

1. **Criar service**
   ```ini
   # /etc/systemd/system/sistema-gestao.service
   [Unit]
   Description=Sistema de Gestão Financeira
   After=network.target
   
   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/sistema-gestao-financeira
   Environment=PATH=/home/ubuntu/sistema-gestao-financeira/venv/bin
   ExecStart=/home/ubuntu/sistema-gestao-financeira/venv/bin/python app.py
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

2. **Ativar service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable sistema-gestao
   sudo systemctl start sistema-gestao
   ```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Build no Frontend
```bash
# Limpar cache e reinstalar
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

#### 2. Erro de Dependências Python
```bash
# Atualizar pip e reinstalar
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

#### 3. Erro de CORS
- Verificar se Flask-CORS está instalado
- Confirmar configuração no `main.py`

#### 4. Erro 404 em Rotas SPA
- Verificar configuração de redirects
- Confirmar `vercel.json` ou `netlify.toml`

#### 5. Banco de Dados não Inicializa
```python
# No Python, executar:
from src.main import app, db
with app.app_context():
    db.create_all()
```

### Logs e Debug

#### Vercel
```bash
vercel logs
```

#### Heroku
```bash
heroku logs --tail
```

#### Railway
- Acessar dashboard > Deployments > View Logs

#### Docker
```bash
docker logs container_name
```

### Performance

#### Otimizações Recomendadas
1. **Compressão Gzip** (automática no Vercel/Netlify)
2. **CDN** para assets estáticos
3. **Cache de banco** para consultas frequentes
4. **Minificação** de CSS/JS (automática no build)

### Segurança

#### Checklist de Segurança
- [ ] HTTPS habilitado
- [ ] Variáveis de ambiente protegidas
- [ ] Validação de inputs
- [ ] Rate limiting (se necessário)
- [ ] Backup regular do banco

## 📞 Suporte

### Recursos Úteis
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Heroku](https://devcenter.heroku.com/)
- [Documentação Railway](https://docs.railway.app/)
- [Documentação Netlify](https://docs.netlify.com/)

### Contato
- Abrir issue no GitHub
- Consultar logs da plataforma
- Verificar status das plataformas

---

**🎉 Parabéns! Seu sistema está agora online e acessível para todos os usuários!**

