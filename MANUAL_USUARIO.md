# Manual do Usuário - Sistema de Gestão Financeira

## 📋 Índice
1. [Primeiros Passos](#primeiros-passos)
2. [Dashboard](#dashboard)
3. [Notas Fiscais](#notas-fiscais)
4. [Contas a Pagar](#contas-a-pagar)
5. [OCR de Comprovantes](#ocr-de-comprovantes)
6. [DRE](#dre)
7. [Configurações](#configurações)
8. [Dicas e Boas Práticas](#dicas-e-boas-práticas)

## 🚀 Primeiros Passos

### Acessando o Sistema
1. Abra seu navegador
2. Acesse o endereço do sistema
3. A tela inicial (Dashboard) será exibida automaticamente

### Navegação
- Use o menu lateral esquerdo para navegar entre as seções
- O menu é responsivo e se adapta ao tamanho da tela
- Em dispositivos móveis, use o botão de menu (☰) para abrir/fechar

## 📊 Dashboard

O Dashboard é sua central de controle financeiro.

### Indicadores Principais
- **Total de Contas**: Quantidade total de contas cadastradas
- **Contas Vencidas**: Contas em atraso que precisam de atenção
- **Valor Total Pendente**: Soma de todas as contas em aberto
- **Notas Fiscais**: Quantidade de NFes processadas

### Gráficos
- **Contas por Status**: Visualização das contas por situação
- **Evolução Mensal**: Acompanhamento da evolução ao longo do tempo

### Ações Rápidas
- **Nova Conta**: Cadastrar rapidamente uma nova conta a pagar
- **Upload NFe**: Enviar uma nota fiscal para processamento
- **Gerar DRE**: Criar demonstrativo de resultado

## 📄 Notas Fiscais

### Enviando uma Nota Fiscal
1. Clique em **"Notas Fiscais"** no menu
2. Clique no botão **"Enviar XML"**
3. Selecione o arquivo XML da NFe
4. Aguarde o processamento automático
5. Verifique os dados extraídos

### Visualizando Notas
- **Lista de Notas**: Todas as notas processadas
- **Filtros**: Por data, fornecedor ou valor
- **Detalhes**: Clique em uma nota para ver informações completas
- **Produtos**: Lista detalhada de itens da nota

### Dados Extraídos Automaticamente
- Informações do fornecedor (CNPJ, nome, endereço)
- Valores (total, impostos, descontos)
- Data de emissão e vencimento
- Lista de produtos/serviços
- Classificação fiscal

## 💰 Contas a Pagar

### Cadastrando uma Nova Conta
1. Acesse **"Contas a Pagar"**
2. Clique em **"Nova Conta"**
3. Preencha os campos obrigatórios:
   - **Descrição**: O que está sendo pago
   - **Fornecedor**: Nome da empresa/pessoa
   - **Valor**: Valor total da conta
   - **Vencimento**: Data limite para pagamento
   - **Categoria**: Tipo de despesa

### Gerenciando Parcelas
- **Parcelamento**: Divida uma conta em várias parcelas
- **Vencimentos**: Configure datas diferentes para cada parcela
- **Valores**: Distribua o valor total entre as parcelas

### Filtros e Busca
- **Por Data**: Filtre por período de vencimento
- **Por Status**: Pendente, Pago, Vencido, Cancelado
- **Por Fornecedor**: Busque por nome do fornecedor
- **Por Categoria**: Filtre por tipo de despesa
- **Por Valor**: Defina faixas de valores

### Status das Contas
- 🟡 **Pendente**: Aguardando pagamento
- 🟢 **Pago**: Pagamento confirmado
- 🔴 **Vencido**: Prazo de pagamento expirado
- ⚫ **Cancelado**: Conta cancelada

### Ações Disponíveis
- **Editar**: Modificar dados da conta
- **Pagar**: Marcar como paga
- **Cancelar**: Cancelar a conta
- **Duplicar**: Criar uma conta similar
- **Histórico**: Ver movimentações

## 🔍 OCR de Comprovantes

### Enviando um Comprovante
1. Acesse **"OCR de Comprovantes"**
2. Clique na área de upload ou arraste o arquivo
3. Formatos aceitos: JPG, PNG, PDF
4. Aguarde a análise automática

### Dados Extraídos
O sistema identifica automaticamente:
- **Valor**: Quantia paga
- **Data**: Data do pagamento
- **Beneficiário**: Quem recebeu o pagamento
- **Forma de Pagamento**: PIX, TED, DOC, etc.
- **Banco**: Instituição financeira
- **Documento**: Número do comprovante

### Correspondências Automáticas
- O sistema busca contas a pagar que podem corresponder ao comprovante
- **Score de Compatibilidade**: Indica a probabilidade de correspondência
- **Verde (70%+)**: Alta compatibilidade
- **Amarelo (40-69%)**: Compatibilidade média
- **Vermelho (<40%)**: Baixa compatibilidade

### Confirmando Pagamentos
1. Revise os dados extraídos
2. Selecione a conta correspondente
3. Verifique a compatibilidade
4. Clique em **"Confirmar Pagamento"**
5. A conta será automaticamente marcada como paga

## 📈 DRE - Demonstração do Resultado

### Gerando um DRE
1. Acesse **"DRE"**
2. Selecione o mês e ano desejados
3. Clique em **"Gerar DRE"**
4. Aguarde o processamento

### Estrutura do DRE
- **Receitas**: Receita bruta e deduções
- **Custos**: Custos das vendas
- **Despesas Operacionais**: Administrativas, vendas, operacionais
- **Outras Receitas/Despesas**: Receitas e despesas não operacionais
- **Impostos**: Provisão para IR e CSLL
- **Resultado Final**: Lucro ou prejuízo líquido

### Indicadores Calculados
- **Margem Bruta**: Lucro bruto / Receita líquida
- **Margem Operacional**: Lucro antes IR / Receita líquida
- **Margem Líquida**: Lucro líquido / Receita líquida

### Lançamentos Manuais
1. Clique em **"Novo Lançamento"**
2. Selecione a conta contábil
3. Informe data, valor e descrição
4. Salve o lançamento

### Sincronização
- Use **"Sincronizar"** para atualizar com dados das contas a pagar
- Lançamentos são classificados automaticamente
- Revise a classificação se necessário

### Comparativo Anual
- Visualize a evolução mensal
- Compare receitas e despesas
- Identifique tendências e padrões

## ⚙️ Configurações

### Despesas Recorrentes
Configure despesas que se repetem mensalmente:
1. Clique em **"Nova Despesa"**
2. Defina descrição, fornecedor e valor
3. Configure dia de vencimento
4. Escolha a periodicidade (mensal, trimestral, anual)
5. O sistema criará automaticamente as próximas ocorrências

### Categorias
- **Água**: Contas de água
- **Energia**: Contas de luz
- **Aluguel**: Aluguel de imóveis
- **Folha de Pagamento**: Salários e encargos
- **Telefone**: Telecomunicações
- **Internet**: Provedores de internet
- **Combustível**: Abastecimento de veículos
- **Manutenção**: Reparos e manutenções
- **Material de Escritório**: Suprimentos
- **Outros**: Demais despesas

### Plano de Contas
- Visualize o plano de contas contábeis
- Contas são organizadas por código e tipo
- Classificação automática para DRE

## 💡 Dicas e Boas Práticas

### Organização
1. **Categorize corretamente**: Use categorias específicas para facilitar relatórios
2. **Mantenha dados atualizados**: Revise informações regularmente
3. **Use descrições claras**: Facilita identificação posterior

### Fluxo de Trabalho Recomendado
1. **Recebeu uma NFe**: Envie o XML imediatamente
2. **Conta criada automaticamente**: Revise os dados extraídos
3. **Pagou uma conta**: Use o OCR para confirmar automaticamente
4. **Final do mês**: Gere o DRE para análise

### Backup e Segurança
- Mantenha backups regulares dos dados
- Revise relatórios mensalmente
- Monitore contas vencidas diariamente

### Performance
- Use filtros para encontrar informações rapidamente
- Aproveite a busca automática do OCR
- Configure despesas recorrentes para automatizar

### Relatórios
- Gere DRE mensalmente
- Compare períodos para identificar tendências
- Use indicadores para tomada de decisão

### Suporte
- Consulte este manual em caso de dúvidas
- Verifique os logs em caso de problemas
- Mantenha o sistema atualizado

---

**📞 Precisa de ajuda?**
- Consulte a documentação técnica
- Verifique os exemplos práticos
- Entre em contato com o suporte técnico

