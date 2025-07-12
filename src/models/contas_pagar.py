from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class ContaPagar(db.Model):
    __tablename__ = 'contas_pagar'
    
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(200), nullable=False)
    fornecedor = db.Column(db.String(200), nullable=False)
    cnpj_fornecedor = db.Column(db.String(18), nullable=True)
    tipo_despesa = db.Column(db.String(50), nullable=False)  # operacional, administrativa, financeira
    categoria = db.Column(db.String(100), nullable=False)  # agua, luz, aluguel, folha, etc
    valor_total = db.Column(db.Numeric(15, 2), nullable=False)
    data_emissao = db.Column(db.Date, nullable=False)
    data_vencimento = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='pendente')  # pendente, pago, vencido, cancelado
    recorrente = db.Column(db.Boolean, default=False)
    periodicidade = db.Column(db.String(20), nullable=True)  # mensal, trimestral, anual
    observacoes = db.Column(db.Text, nullable=True)
    nota_fiscal_id = db.Column(db.Integer, db.ForeignKey('notas_fiscais.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com parcelas
    parcelas = db.relationship('ParcelaConta', backref='conta_pagar', lazy=True, cascade='all, delete-orphan')
    
    # Relacionamento com pagamentos
    pagamentos = db.relationship('PagamentoConta', backref='conta_pagar', lazy=True, cascade='all, delete-orphan')

class ParcelaConta(db.Model):
    __tablename__ = 'parcelas_conta'
    
    id = db.Column(db.Integer, primary_key=True)
    conta_pagar_id = db.Column(db.Integer, db.ForeignKey('contas_pagar.id'), nullable=False)
    numero_parcela = db.Column(db.Integer, nullable=False)
    data_vencimento = db.Column(db.Date, nullable=False)
    valor = db.Column(db.Numeric(15, 2), nullable=False)
    status = db.Column(db.String(20), default='pendente')  # pendente, pago, vencido
    data_pagamento = db.Column(db.Date, nullable=True)
    valor_pago = db.Column(db.Numeric(15, 2), nullable=True)
    juros = db.Column(db.Numeric(15, 2), default=0)
    multa = db.Column(db.Numeric(15, 2), default=0)
    desconto = db.Column(db.Numeric(15, 2), default=0)
    observacoes = db.Column(db.Text, nullable=True)

class PagamentoConta(db.Model):
    __tablename__ = 'pagamentos_conta'
    
    id = db.Column(db.Integer, primary_key=True)
    conta_pagar_id = db.Column(db.Integer, db.ForeignKey('contas_pagar.id'), nullable=False)
    parcela_id = db.Column(db.Integer, db.ForeignKey('parcelas_conta.id'), nullable=True)
    data_pagamento = db.Column(db.Date, nullable=False)
    valor_pago = db.Column(db.Numeric(15, 2), nullable=False)
    forma_pagamento = db.Column(db.String(50), nullable=False)  # dinheiro, pix, transferencia, boleto, cartao
    comprovante_path = db.Column(db.String(500), nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DespesaRecorrente(db.Model):
    __tablename__ = 'despesas_recorrentes'
    
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(200), nullable=False)
    fornecedor = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    valor = db.Column(db.Numeric(15, 2), nullable=False)
    dia_vencimento = db.Column(db.Integer, nullable=False)  # dia do mês
    periodicidade = db.Column(db.String(20), nullable=False)  # mensal, trimestral, anual
    ativo = db.Column(db.Boolean, default=True)
    proximo_vencimento = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

