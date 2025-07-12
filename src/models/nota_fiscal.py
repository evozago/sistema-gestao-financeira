from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class NotaFiscal(db.Model):
    __tablename__ = 'notas_fiscais'
    
    id = db.Column(db.Integer, primary_key=True)
    numero_nota = db.Column(db.String(50), nullable=False, unique=True)
    serie = db.Column(db.String(10), nullable=False)
    cnpj_fornecedor = db.Column(db.String(18), nullable=False)
    nome_fornecedor = db.Column(db.String(200), nullable=False)
    data_emissao = db.Column(db.Date, nullable=False)
    data_vencimento = db.Column(db.Date, nullable=True)
    valor_total = db.Column(db.Numeric(15, 2), nullable=False)
    valor_desconto = db.Column(db.Numeric(15, 2), default=0)
    valor_liquido = db.Column(db.Numeric(15, 2), nullable=False)
    chave_acesso = db.Column(db.String(44), nullable=True)
    xml_content = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pendente')  # pendente, pago, vencido
    observacoes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com produtos
    produtos = db.relationship('ProdutoNota', backref='nota_fiscal', lazy=True, cascade='all, delete-orphan')
    
    # Relacionamento com parcelas
    parcelas = db.relationship('ParcelaNota', backref='nota_fiscal', lazy=True, cascade='all, delete-orphan')

class ProdutoNota(db.Model):
    __tablename__ = 'produtos_nota'
    
    id = db.Column(db.Integer, primary_key=True)
    nota_fiscal_id = db.Column(db.Integer, db.ForeignKey('notas_fiscais.id'), nullable=False)
    codigo_produto = db.Column(db.String(50), nullable=True)
    descricao = db.Column(db.String(500), nullable=False)
    quantidade = db.Column(db.Numeric(10, 3), nullable=False)
    unidade = db.Column(db.String(10), nullable=False)
    valor_unitario = db.Column(db.Numeric(15, 2), nullable=False)
    valor_total = db.Column(db.Numeric(15, 2), nullable=False)
    ncm = db.Column(db.String(10), nullable=True)
    cfop = db.Column(db.String(10), nullable=True)

class ParcelaNota(db.Model):
    __tablename__ = 'parcelas_nota'
    
    id = db.Column(db.Integer, primary_key=True)
    nota_fiscal_id = db.Column(db.Integer, db.ForeignKey('notas_fiscais.id'), nullable=False)
    numero_parcela = db.Column(db.Integer, nullable=False)
    data_vencimento = db.Column(db.Date, nullable=False)
    valor = db.Column(db.Numeric(15, 2), nullable=False)
    status = db.Column(db.String(20), default='pendente')  # pendente, pago, vencido
    data_pagamento = db.Column(db.Date, nullable=True)
    valor_pago = db.Column(db.Numeric(15, 2), nullable=True)
    observacoes = db.Column(db.Text, nullable=True)

