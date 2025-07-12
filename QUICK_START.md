# ⚡ Quick Start - Deploy em 5 Minutos

## 🎯 Deploy Mais Rápido: GitHub + Vercel

### 1️⃣ Preparar GitHub (2 min)

```bash
# 1. Criar repositório no GitHub (via web)
# Nome: sistema-gestao-financeira

# 2. Clonar localmente
git clone https://github.com/SEU_USUARIO/sistema-gestao-financeira.git
cd sistema-gestao-financeira

# 3. Copiar arquivos do sistema para esta pasta
# (todos os arquivos: src/, frontend/, requirements.txt, etc.)

# 4. Fazer commit
git add .
git commit -m "Sistema de Gestão Financeira - Deploy inicial"
git push origin main
```

### 2️⃣ Deploy no Vercel (2 min)

1. **Acessar:** [vercel.com](https://vercel.com)
2. **Login:** com GitHub
3. **New Project:** selecionar repositório criado
4. **Configurar:**
   - Framework: `Other`
   - Build Command: `npm run build`
   - Install Command: `pip install -r requirements.txt`
5. **Deploy:** clicar em Deploy

### 3️⃣ Pronto! (1 min)

✅ Sistema online em URL permanente  
✅ Deploy automático a cada push  
✅ HTTPS habilitado  
✅ CDN global  

---

## 🚀 Alternativa: Heroku

```bash
# 1. Instalar Heroku CLI
# 2. Login
heroku login

# 3. Criar app
heroku create meu-sistema-gestao

# 4. Deploy
git push heroku main

# 5. Abrir
heroku open
```

---

## 🐳 Alternativa: Docker Local

```bash
# 1. Build e run
docker-compose up --build

# 2. Acessar
# http://localhost:5000
```

---

## 📱 Funcionalidades Disponíveis Imediatamente

✅ **Dashboard** - Visão geral financeira  
✅ **Notas Fiscais** - Upload e processamento XML  
✅ **Contas a Pagar** - Controle completo  
✅ **OCR** - Análise de comprovantes  
✅ **DRE** - Demonstrativo automático  
✅ **Configurações** - Personalização  

---

## 🔧 Configurações Opcionais

### Para OCR Completo (OpenAI)
```bash
# No Vercel/Heroku, adicionar variável:
OPENAI_API_KEY=sua_chave_aqui
```

### Para Domínio Personalizado
- Vercel: Settings > Domains
- Heroku: Settings > Domains

---

## 📞 Precisa de Ajuda?

- 📖 **Guia Completo:** `DEPLOY_GUIDE.md`
- 👤 **Manual do Usuário:** `MANUAL_USUARIO.md`
- 🔧 **Documentação Técnica:** `README.md`

**🎉 Em 5 minutos seu sistema estará online!**

