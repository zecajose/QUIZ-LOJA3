'use client'

import { useState, useEffect } from 'react'
import {
  ChevronRight, ChevronLeft, Store, Instagram, Phone, Calendar, ShoppingBag, Users,
  MessageCircle, DollarSign, Target, TrendingUp, Smartphone, Globe, Mail, CheckCircle, ArrowRight
} from 'lucide-react'

const FORM_VERSION = '1.0.0'

interface FormData {
  nome: string
  whatsapp: string
  instagram: string
  tempoMercado: string
  canaisVenda: string[]
  estiloPecas: string
  perfilPublico: string
  comunicacaoMarca: string
  faturamento: string
  ticketMedio: string
  produtoMaisVendido: string
  metasVendas: string
  desafios: string[]
  presencaDigital: string[]
  frequenciaPostagens: string
  investimentoAnuncios: string
  temSite: string
  vendasRedesSociais: string
  contatoPosCompra: string
  objetivosFuturos: string[]
  diferencial: string
  planejamentoColecao: string
  retencao: string
  analiseConcorrencia: string
  metricas: string
  estrategiaConteudo: string
}

const initialFormData: FormData = {
  nome: '',
  whatsapp: '',
  instagram: '',
  tempoMercado: '',
  canaisVenda: [],
  estiloPecas: '',
  perfilPublico: '',
  comunicacaoMarca: '',
  faturamento: '',
  ticketMedio: '',
  produtoMaisVendido: '',
  metasVendas: '',
  desafios: [],
  presencaDigital: [],
  frequenciaPostagens: '',
  investimentoAnuncios: '',
  temSite: '',
  vendasRedesSociais: '',
  contatoPosCompra: '',
  objetivosFuturos: [],
  diferencial: '',
  planejamentoColecao: '',
  retencao: '',
  analiseConcorrencia: '',
  metricas: '',
  estrategiaConteudo: ''
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [sending, setSending] = useState(false)

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fashionStoreForm')
      if (!raw) return
      const saved = JSON.parse(raw)
      if (saved?.__version !== FORM_VERSION || typeof saved !== 'object') {
        localStorage.removeItem('fashionStoreForm')
        return
      }
      setFormData({ ...initialFormData, ...saved })
    } catch {
      localStorage.removeItem('fashionStoreForm')
    }
  }, [])

  // Save
  useEffect(() => {
    const payload = { ...formData, __version: FORM_VERSION }
    localStorage.setItem('fashionStoreForm', JSON.stringify(payload))
  }, [formData])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayValue = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as unknown as string[]
    const next = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value]
    updateFormData(field, next)
  }

  const questions = [
    { id: 'nome', title: 'Qual o nome da sua loja?', icon: <Store className="w-6 h-6" />, type: 'text', placeholder: 'Digite o nome da sua loja' },
    { id: 'whatsapp', title: 'Qual seu WhatsApp para contato?', icon: <Phone className="w-6 h-6" />, type: 'text', placeholder: '(11) 99999-9999' },
    { id: 'instagram', title: 'Qual o Instagram da sua loja?', icon: <Instagram className="w-6 h-6" />, type: 'text', placeholder: '@sualojaaqui' },
    { id: 'tempoMercado', title: 'Há quanto tempo sua loja está no mercado?', icon: <Calendar className="w-6 h-6" />, type: 'select', options: ['Menos de 6 meses', '6 meses a 1 ano', '1 a 2 anos', '2 a 5 anos', 'Mais de 5 anos'] },
    { id: 'canaisVenda', title: 'Quais canais de venda você utiliza?', icon: <ShoppingBag className="w-6 h-6" />, type: 'multiple', options: ['Loja física', 'Instagram', 'WhatsApp', 'Site próprio', 'Marketplace (Mercado Livre, Shopee)', 'Facebook', 'Outros'] },
    { id: 'estiloPecas', title: 'Qual o estilo predominante das suas peças?', icon: <Users className="w-6 h-6" />, type: 'select', options: ['Casual', 'Elegante/Social', 'Jovem/Moderno', 'Plus Size', 'Moda Praia', 'Íntimo/Lingerie', 'Esportivo', 'Boho/Alternativo'] },
    { id: 'perfilPublico', title: 'Qual o perfil do seu público-alvo?', icon: <Users className="w-6 h-6" />, type: 'select', options: ['Jovens (18-25 anos)', 'Adultas (26-35 anos)', 'Maduras (36-50 anos)', 'Todas as idades', 'Classe A/B', 'Classe C', 'Classe C/D'] },
    { id: 'comunicacaoMarca', title: 'Como você descreveria a comunicação da sua marca?', icon: <MessageCircle className="w-6 h-6" />, type: 'select', options: ['Descontraída e jovem', 'Elegante e sofisticada', 'Próxima e amigável', 'Profissional', 'Ainda estou definindo'] },
    { id: 'faturamento', title: 'Qual o faturamento mensal aproximado da sua loja?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Até R$ 5.000', 'R$ 5.001 a R$ 15.000', 'R$ 15.001 a R$ 30.000', 'R$ 30.001 a R$ 50.000', 'Acima de R$ 50.000'] },
    { id: 'ticketMedio', title: 'Qual o ticket médio das suas vendas?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Até R$ 50', 'R$ 51 a R$ 100', 'R$ 101 a R$ 200', 'R$ 201 a R$ 300', 'Acima de R$ 300'] },
    { id: 'produtoMaisVendido', title: 'Qual categoria de produto mais vende na sua loja?', icon: <TrendingUp className="w-6 h-6" />, type: 'text', placeholder: 'Ex: Vestidos, Blusas, Calças, etc.' },
    { id: 'metasVendas', title: 'Qual sua meta de vendas para os próximos 3 meses?', icon: <Target className="w-6 h-6" />, type: 'select', options: ['Aumentar 20%', 'Aumentar 50%', 'Dobrar as vendas', 'Manter o atual', 'Ainda não defini'] },
    { id: 'desafios', title: 'Quais são seus principais desafios atualmente?', icon: <Target className="w-6 h-6" />, type: 'multiple', options: ['Atrair novos clientes', 'Aumentar ticket médio', 'Melhorar presença digital', 'Organizar estoque', 'Precificar produtos', 'Fidelizar clientes', 'Competir com grandes lojas'] },
    { id: 'presencaDigital', title: 'Onde sua marca está presente digitalmente?', icon: <Smartphone className="w-6 h-6" />, type: 'multiple', options: ['Instagram', 'Facebook', 'WhatsApp Business', 'Site próprio', 'Google Meu Negócio', 'TikTok', 'Pinterest', 'Nenhum'] },
    { id: 'frequenciaPostagens', title: 'Com que frequência você posta nas redes sociais?', icon: <Instagram className="w-6 h-6" />, type: 'select', options: ['Diariamente', '3-4 vezes por semana', '1-2 vezes por semana', 'Esporadicamente', 'Não posto regularmente'] },
    { id: 'investimentoAnuncios', title: 'Você investe em anúncios pagos?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Sim, regularmente', 'Sim, esporadicamente', 'Já tentei, mas parei', 'Nunca investi', 'Pretendo começar'] },
    { id: 'temSite', title: 'Sua loja tem site próprio?', icon: <Globe className="w-6 h-6" />, type: 'select', options: ['Sim, com loja virtual', 'Sim, apenas institucional', 'Não, mas pretendo ter', 'Não vejo necessidade'] },
    { id: 'vendasRedesSociais', title: 'Que % das suas vendas vem das redes sociais?', icon: <TrendingUp className="w-6 h-6" />, type: 'select', options: ['Menos de 20%', '20% a 40%', '40% a 60%', '60% a 80%', 'Mais de 80%'] },
    { id: 'contatoPosCompra', title: 'Como você mantém contato com clientes após a compra?', icon: <Mail className="w-6 h-6" />, type: 'select', options: ['WhatsApp', 'Instagram', 'E-mail', 'SMS', 'Não mantenho contato regular'] },
    { id: 'objetivosFuturos', title: 'Quais são seus objetivos para os próximos 12 meses?', icon: <Target className="w-6 h-6" />, type: 'multiple', options: ['Aumentar faturamento', 'Expandir para novos canais', 'Melhorar presença digital', 'Abrir loja física', 'Lançar site/e-commerce', 'Profissionalizar gestão', 'Aumentar equipe'] },
    { id: 'diferencial', title: 'Como você se diferencia das outras lojas?', icon: <Target className="w-6 h-6" />, type: 'select', options: ['Preço mais acessível', 'Qualidade superior', 'Atendimento personalizado', 'Exclusividade das peças', 'Ainda não tenho um diferencial claro'] },
    { id: 'planejamentoColecao', title: 'Você planeja coleções sazonais?', icon: <Calendar className="w-6 h-6" />, type: 'select', options: ['Sim, com antecedência', 'Sim, mas sem estrutura', 'Não, compro conforme demanda', 'Não faço coleções sazonais'] },
    { id: 'retencao', title: 'Você tem ações para estimular a recompra?', icon: <CheckCircle className="w-6 h-6" />, type: 'select', options: ['Programa de fidelidade', 'Cupons de desconto', 'Pós-venda personalizado', 'Não tenho nenhuma ação'] },
    { id: 'analiseConcorrencia', title: 'Com que frequência analisa concorrentes/tendências?', icon: <TrendingUp className="w-6 h-6" />, type: 'select', options: ['Semanalmente', 'Mensalmente', 'Raramente', 'Nunca'] },
    { id: 'metricas', title: 'Você acompanha CAC, ROI ou taxa de recompra?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Sim, frequentemente', 'Sim, mas com dificuldade', 'Raramente', 'Não acompanho'] },
    { id: 'estrategiaConteudo', title: 'Seu conteúdo é pensado para conversão?', icon: <MessageCircle className="w-6 h-6" />, type: 'select', options: ['Estratégico para vendas', 'Misto: institucional e promoções', 'Mais institucional', 'Não tenho estratégia'] }
  ] as const

  const fieldsConfig: { key: keyof FormData; type: 'text'|'select'|'multiple' }[] = [
    { key: 'nome', type: 'text' },
    { key: 'whatsapp', type: 'text' },
    { key: 'instagram', type: 'text' },
    { key: 'tempoMercado', type: 'select' },
    { key: 'canaisVenda', type: 'multiple' },
    { key: 'estiloPecas', type: 'select' },
    { key: 'perfilPublico', type: 'select' },
    { key: 'comunicacaoMarca', type: 'select' },
    { key: 'faturamento', type: 'select' },
    { key: 'ticketMedio', type: 'select' },
    { key: 'produtoMaisVendido', type: 'text' },
    { key: 'metasVendas', type: 'select' },
    { key: 'desafios', type: 'multiple' },
    { key: 'presencaDigital', type: 'multiple' },
    { key: 'frequenciaPostagens', type: 'select' },
    { key: 'investimentoAnuncios', type: 'select' },
    { key: 'temSite', type: 'select' },
    { key: 'vendasRedesSociais', type: 'select' },
    { key: 'contatoPosCompra', type: 'select' },
    { key: 'objetivosFuturos', type: 'multiple' },
    { key: 'diferencial', type: 'select' },
    { key: 'planejamentoColecao', type: 'select' },
    { key: 'retencao', type: 'select' },
    { key: 'analiseConcorrencia', type: 'select' },
    { key: 'metricas', type: 'select' },
    { key: 'estrategiaConteudo', type: 'select' }
  ]

  const countAnswered = () =>
    fieldsConfig.reduce((acc, f) => {
      const v = formData[f.key] as any
      if (f.type === 'multiple') return acc + ((Array.isArray(v) && v.length > 0) ? 1 : 0)
      return acc + (v && String(v).trim().length > 0 ? 1 : 0)
    }, 0)

  const completionPercent = Math.round((countAnswered() / fieldsConfig.length) * 100)

  const calcHealthScore = () => {
    let score = 0
    const max = 100

    const pd = formData.presencaDigital.length
    if (pd >= 5) score += 20
    else if (pd >= 3) score += 14
    else if (pd >= 1) score += 8

    if (formData.frequenciaPostagens === 'Diariamente') score += 10
    else if (formData.frequenciaPostagens === '3-4 vezes por semana') score += 8
    else if (formData.frequenciaPostagens === '1-2 vezes por semana') score += 5

    if (formData.investimentoAnuncios === 'Sim, regularmente') score += 10
    else if (formData.investimentoAnuncios === 'Sim, esporadicamente') score += 6
    else if (formData.investimentoAnuncios === 'Pretendo começar') score += 3

    const cv = formData.canaisVenda.length
    if (cv >= 4) score += 10
    else if (cv >= 2) score += 6
    else if (cv >= 1) score += 3

    if (formData.contatoPosCompra && formData.contatoPosCompra !== 'Não mantenho contato regular') score += 8
    if (formData.metasVendas && formData.metasVendas !== 'Ainda não defini') score += 8
    if (formData.temSite && !formData.temSite.startsWith('Não')) score += 4

    if (formData.vendasRedesSociais === '40% a 60%') score += 6
    else if (formData.vendasRedesSociais === '20% a 40%' || formData.vendasRedesSociais === '60% a 80%') score += 4
    else score += 2

    if (formData.diferencial && formData.diferencial !== 'Ainda não tenho um diferencial claro') score += 6
    if (formData.retencao && formData.retencao !== 'Não tenho nenhuma ação') score += 6
    if (formData.metricas && formData.metricas !== 'Não acompanho') score += 6

    const pct = Math.max(0, Math.min(100, Math.round((score / max) * 100)))
    const label = pct >= 75 ? 'Saudável' : pct >= 50 ? 'Atenção' : 'Crítico'
    const color = pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'
    const bar = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'

    return { pct, label, color, bar }
  }

  const generateDiagnostic = () => {
    const diagnostics: { area: string; status: string; message: string; color: string }[] = []

    if (formData.presencaDigital.length <= 2) {
      diagnostics.push({ area: 'Presença Digital', status: 'Crítico', message: 'Sua presença digital é limitada. Expandir para mais canais pode aumentar significativamente suas vendas.', color: 'text-red-600 bg-red-50' })
    } else if (formData.presencaDigital.length <= 4) {
      diagnostics.push({ area: 'Presença Digital', status: 'Atenção', message: 'Boa presença digital, mas há oportunidades de crescimento em novos canais.', color: 'text-yellow-600 bg-yellow-50' })
    } else {
      diagnostics.push({ area: 'Presença Digital', status: 'Excelente', message: 'Parabéns! Você tem uma presença digital diversificada.', color: 'text-green-600 bg-green-50' })
    }

    if (formData.frequenciaPostagens === 'Não posto regularmente' || formData.frequenciaPostagens === 'Esporadicamente') {
      diagnostics.push({ area: 'Engajamento', status: 'Crítico', message: 'Postagens irregulares prejudicam o engajamento. Consistência é fundamental para o crescimento.', color: 'text-red-600 bg-red-50' })
    } else {
      diagnostics.push({ area: 'Engajamento', status: 'OK', message: 'Frequência razoável. Foque em formatos de conversão (Reels com prova social e CTAs).', color: 'text-green-600 bg-green-50' })
    }

    if (formData.investimentoAnuncios === 'Nunca investi') {
      diagnostics.push({ area: 'Marketing Pago', status: 'Oportunidade', message: 'Anúncios pagos podem acelerar o crescimento com segmentação por interesse e lookalikes.', color: 'text-blue-600 bg-blue-50' })
    } else if (formData.investimentoAnuncios === 'Já tentei, mas parei') {
      diagnostics.push({ area: 'Marketing Pago', status: 'Atenção', message: 'Teste criativos com ofertas simples (combo/kit) e otimize eventos do Pixel.', color: 'text-yellow-600 bg-yellow-50' })
    } else if (formData.investimentoAnuncios === 'Pretendo começar') {
      diagnostics.push({ area: 'Marketing Pago', status: 'Planejado', message: 'Defina orçamento pequeno e estável com campanhas sempre ativas.', color: 'text-yellow-600 bg-yellow-50' })
    } else {
      diagnostics.push({ area: 'Marketing Pago', status: 'Em Andamento', message: 'Mantenha consistência e valide criativos com testes A/B quinzenais.', color: 'text-green-600 bg-green-50' })
    }

    if (formData.diferencial === 'Ainda não tenho um diferencial claro' || !formData.diferencial) {
      diagnostics.push({ area: 'Posicionamento', status: 'Atenção', message: 'Defina um ponto único (ex.: prova de qualidade, modelagem exclusiva, atendimento consultivo).', color: 'text-yellow-600 bg-yellow-50' })
    } else {
      diagnostics.push({ area: 'Posicionamento', status: 'Claro', message: `Seu diferencial informado: "${formData.diferencial}". Reforce em bio, destaques e anúncios.`, color: 'text-green-600 bg-green-50' })
    }

    if (formData.retencao === 'Não tenho nenhuma ação') {
      diagnostics.push({ area: 'Fidelização', status: 'Crítico', message: 'Implemente recompra: cupom pós-primeira compra e lembretes de 30 dias via WhatsApp.', color: 'text-red-600 bg-red-50' })
    } else if (formData.retencao) {
      diagnostics.push({ area: 'Fidelização', status: 'OK', message: 'Mantenha cadência quinzenal de ofertas VIP e novidades para base ativa.', color: 'text-green-600 bg-green-50' })
    }

    if (formData.planejamentoColecao?.startsWith('Não')) {
      diagnostics.push({ area: 'Coleções', status: 'Atenção', message: 'Planeje calendário sazonal (mãe, namorados, inverno, verão) para campanhas de pico.', color: 'text-yellow-600 bg-yellow-50' })
    } else if (formData.planejamentoColecao) {
      diagnostics.push({ area: 'Coleções', status: 'OK', message: 'Mantenha grade por curva e reposição programada para evitar rupturas.', color: 'text-green-600 bg-green-50' })
    }

    if (formData.metricas === 'Não acompanho') {
      diagnostics.push({ area: 'Métricas', status: 'Crítico', message: 'Comece pelo básico: ticket médio, taxa de conversão e ROI de campanhas.', color: 'text-red-600 bg-red-50' })
    } else if (formData.metricas === 'Raramente') {
      diagnostics.push({ area: 'Métricas', status: 'Atenção', message: 'Crie rotina semanal de leitura: CAC, ROI e recompra.', color: 'text-yellow-600 bg-yellow-50' })
    } else {
      diagnostics.push({ area: 'Métricas', status: 'OK', message: 'Bom! Evolua para metas por canal (orgânico, pago, WhatsApp).', color: 'text-green-600 bg-green-50' })
    }

    if (formData.temSite?.startsWith('Não')) {
      diagnostics.push({ area: 'Site/E-commerce', status: 'Oportunidade', message: 'Criar vitrine simples (catálogo + checkout) aumenta escala e confiança.', color: 'text-blue-600 bg-blue-50' })
    }

    if (formData.vendasRedesSociais === 'Mais de 80%') {
      diagnostics.push({ area: 'Risco de Canal', status: 'Atenção', message: 'Diversifique para reduzir dependência: e-mail/WhatsApp + site.', color: 'text-yellow-600 bg-yellow-50' })
    }

    if (formData.desafios?.length) {
      diagnostics.push({ area: 'Principais Obstáculos', status: 'Reportado', message: `Você destacou: ${formData.desafios.join(', ')}`, color: 'text-purple-700 bg-purple-50' })
    }

    return diagnostics
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1)
    else setShowDiagnostic(true)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const progress = ((currentStep + 1) / questions.length) * 100

  // Envio → rota interna (proxy para Make)
  const sendFormData = async () => {
    if (sending) return
    setSending(true)
    try {
      const health = calcHealthScore()
      const payload = {
        ...formData,
        completionPercent,
        healthScore: health.pct,
        healthLabel: health.label,
        submittedAt: new Date().toISOString()
      }

      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const out = await res.json()
      if (!res.ok || !out.ok) {
        console.error('Erro ao enviar', out)
        alert('Ops! Não consegui enviar agora. Tente novamente.')
        return
      }
      alert('Pronto! Suas respostas foram enviadas. Em breve você receberá o diagnóstico completo. ✅')
    } catch (e) {
      console.error(e)
      alert('Ops! Não consegui enviar agora. Tente novamente em instantes.')
    } finally {
      setSending(false)
    }
  }

  // ---------- UI ----------
  if (showDiagnostic) {
    const diagnostics = generateDiagnostic()
    const health = calcHealthScore()
    const visibleCount = Math.max(1, Math.ceil(diagnostics.length * 0.3))
    const visibleDiagnostics = diagnostics.slice(0, visibleCount)
    const blurredDiagnostics = diagnostics.slice(visibleCount)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Diagnóstico Parcial Concluído!</h1>
              <p className="text-gray-600">Aqui está uma prévia da análise da sua loja</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-5 rounded-xl border bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-2">% do Quiz Preenchido</h4>
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <span>Progresso</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>

              <div className="p-5 rounded-xl border bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-2">Saúde da Loja</h4>
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <span>Status</span>
                  <span className={`${health.color} font-semibold`}>{health.label} • {health.pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${health.bar}`} style={{ width: `${health.pct}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Olá, {formData.nome || 'lojista'}! 👋</h2>
                <p>Identificamos pontos importantes para o seu crescimento. Veja uma amostra abaixo:</p>
              </div>

              {visibleDiagnostics.map((d, i) => (
                <div key={i} className={`p-4 rounded-lg border-l-4 ${d.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{d.area}</h3>
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-white">{d.status}</span>
                  </div>
                  <p className="text-sm">{d.message}</p>
                </div>
              ))}

              {blurredDiagnostics.length > 0 && (
                <div className="relative">
                  <div className="space-y-4 filter blur-sm select-none pointer-events-none">
                    {blurredDiagnostics.map((d, i) => (
                      <div key={i} className={`p-4 rounded-lg border-l-4 ${d.color}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{d.area}</h3>
                          <span className="text-sm font-medium px-2 py-1 rounded-full bg-white">{d.status}</span>
                        </div>
                        <p className="text-sm">{d.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm border rounded-xl px-4 py-3 text-center shadow">
                      <p className="font-semibold text-gray-800">Parte do diagnóstico está oculta</p>
                      <p className="text-sm text-gray-600">Desbloqueie o conteúdo completo e o plano de 90 dias</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={sendFormData}
                disabled={sending}
                className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:from-pink-600 hover:to-purple-700'}`}
              >
                {sending ? 'Enviando…' : 'Acessar Diagnóstico Completo'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <p className="text-sm text-gray-500">
                Investimento único de R$ 17,90 • Acesso imediato • Garantia de 7 dias
              </p>
              <button
                onClick={() => { setShowDiagnostic(false); setCurrentStep(0) }}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Voltar ao formulário
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Form
  const currentQuestion = questions[currentStep] as any

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Diagnóstico da Sua Loja</h1>
          <p className="text-gray-600">Descubra como acelerar o crescimento da sua loja de moda feminina</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pergunta {currentStep + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-xl text-white mr-4">
              {currentQuestion.icon}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{currentQuestion.title}</h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'text' && (
              <input
                type="text"
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof FormData] as string}
                onChange={(e) => updateFormData(currentQuestion.id as keyof FormData, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-lg"
              />
            )}

            {currentQuestion.type === 'select' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => updateFormData(currentQuestion.id as keyof FormData, option)}
                    className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                      (formData as any)[currentQuestion.id] === option
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option: string) => {
                  const isSelected = ((formData as any)[currentQuestion.id] as string[]).includes(option)
                  return (
                    <button
                      key={option}
                      onClick={() => toggleArrayValue(currentQuestion.id as keyof FormData, option)}
                      className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                        isSelected ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {option}
                        {isSelected && <CheckCircle className="w-5 h-5 text-pink-500" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anterior
          </button>

          <button
            onClick={() => {
              if (currentStep < questions.length - 1) setCurrentStep(s => s + 1)
              else setShowDiagnostic(true)
            }}
            disabled={
              (currentQuestion.type === 'text' && !(formData as any)[currentQuestion.id]) ||
              (currentQuestion.type === 'select' && !(formData as any)[currentQuestion.id]) ||
              (currentQuestion.type === 'multiple' && ((formData as any)[currentQuestion.id] as string[]).length === 0)
            }
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              ((currentQuestion.type === 'text' && !(formData as any)[currentQuestion.id]) ||
                (currentQuestion.type === 'select' && !(formData as any)[currentQuestion.id]) ||
                (currentQuestion.type === 'multiple' && ((formData as any)[currentQuestion.id] as string[]).length === 0))
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg'
            }`}
          >
            {currentStep === questions.length - 1 ? 'Ver Diagnóstico' : 'Próxima'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}
