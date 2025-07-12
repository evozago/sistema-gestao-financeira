from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class ContaContabil(db.Model):
    __tablename__ = 'contas_contabeis'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(20), nullable=False, unique=True)
    nome = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # receita, custo, despesa
    grupo = db.Column(db.String(100), nullable=False)  # receita_bruta, custos_vendas, despesas_operacionais, etc
    subgrupo = db.Column(db.String(100), nullable=True)
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LancamentoDRE(db.Model):
    __tablename__ = 'lancamentos_dre'
    
    id = db.Column(db.Integer, primary_key=True)
    conta_contabil_id = db.Column(db.Integer, db.ForeignKey('contas_contabeis.id'), nullable=False)
    data_lancamento = db.Column(db.Date, nullable=False)
    valor = db.Column(db.Numeric(15, 2), nullable=False)
    descricao = db.Column(db.String(500), nullable=False)
    documento = db.Column(db.String(100), nullable=True)  # número da nota, recibo, etc
    conta_pagar_id = db.Column(db.Integer, db.ForeignKey('contas_pagar.id'), nullable=True)
    nota_fiscal_id = db.Column(db.Integer, db.ForeignKey('notas_fiscais.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    conta_contabil = db.relationship('ContaContabil', backref='lancamentos')

class ParametrosDRE(db.Model):
    __tablename__ = 'parametros_dre'
    
    id = db.Column(db.Integer, primary_key=True)
    ano = db.Column(db.Integer, nullable=False)
    mes = db.Column(db.Integer, nullable=False)
    receita_bruta = db.Column(db.Numeric(15, 2), default=0)
    deducoes_receita = db.Column(db.Numeric(15, 2), default=0)
    receita_liquida = db.Column(db.Numeric(15, 2), default=0)
    custos_vendas = db.Column(db.Numeric(15, 2), default=0)
    lucro_bruto = db.Column(db.Numeric(15, 2), default=0)
    despesas_operacionais = db.Column(db.Numeric(15, 2), default=0)
    despesas_administrativas = db.Column(db.Numeric(15, 2), default=0)
    despesas_vendas = db.Column(db.Numeric(15, 2), default=0)
    outras_receitas = db.Column(db.Numeric(15, 2), default=0)
    outras_despesas = db.Column(db.Numeric(15, 2), default=0)
    resultado_financeiro = db.Column(db.Numeric(15, 2), default=0)
    lucro_antes_ir = db.Column(db.Numeric(15, 2), default=0)
    provisao_ir = db.Column(db.Numeric(15, 2), default=0)
    lucro_liquido = db.Column(db.Numeric(15, 2), default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('ano', 'mes', name='unique_ano_mes'),)

