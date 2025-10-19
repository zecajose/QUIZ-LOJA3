'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ChevronRight, ChevronLeft, Store, Instagram, Phone, Calendar, ShoppingBag, Users,
  MessageCircle, DollarSign, Target, TrendingUp, Smartphone, Globe, Mail, CheckCircle, ArrowRight
} from 'lucide-react'

/** ===== Imagens (import estático garante erro de build se o caminho estiver errado) ===== */
import imgIniciante from '@/public/images/niveis/lojinha-iniciante.jpg'
import imgSeuNivel from '@/public/images/niveis/seu-nivel-preocupada.jpg'
import imgNacional from '@/public/images/niveis/loja-shopping.jpg'

/** Versão do schema salvo no localStorage */
const FORM_VERSION = '1.0.0'

type QType = 'text' | 'select' | 'multiple'

interface FormData {
  nome: string; whatsapp: string; instagram: string; tempoMercado: string; canaisVenda: string[];
  estiloPecas: string; perfilPublico: string; comunicacaoMarca: string; faturamento: string; ticketMedio: string;
  produtoMaisVendido: string; metasVendas: string; desafios: string[]; presencaDigital: string[]; frequenciaPostagens: string;
  investimentoAnuncios: string; temSite: string; vendasRedesSociais: string; contatoPosCompra: string; objetivosFuturos: string[];
  diferencial: string; planejamentoColecao: string; retencao: string; analiseConcorrencia: string; metricas: string; estrategiaConteudo: string;
}

const initialFormData: FormData = {
  nome: '', whatsapp: '', instagram: '', tempoMercado: '', canaisVenda: [],
  estiloPecas: '', perfilPublico: '', comunicacaoMarca: '', faturamento: '', ticketMedio: '',
  produtoMaisVendido: '', metasVendas: '', desafios: [], presencaDigital: [], frequenciaPostagens: '',
  investimentoAnuncios: '', temSite: '', vendasRedesSociais: '', contatoPosCompra: '',
  objetivosFuturos: [], diferencial: '', planejamentoColecao: '', retencao: '',
  analiseConcorrencia: '', metricas: '', estrategiaConteudo: ''
}

type Question =
  | { id: keyof FormData; title: string; icon: JSX.Element; type: 'text'; placeholder: string }
  | { id: keyof FormData; title: string; icon: JSX.Element; type: 'select'; options: string[] }
  | { id: keyof FormData; title: string; icon: JSX.Element; type: 'multiple'; options: string[] }

const questions: Question[] = [
  { id: 'nome', title: 'Qual o nome da sua loja?', icon: <Store className="w-6 h-6" />, type: 'text', placeholder: 'Digite o nome da sua loja' },
  { id: 'whatsapp', title: 'Qual seu WhatsApp para contato?', icon: <Phone className="w-6 h-6" />, type: 'text', placeholder: '(11) 99999-9999' },
  { id: 'instagram', title: 'Qual o Instagram da sua loja?', icon: <Instagram className="w-6 h-6" />, type: 'text', placeholder: '@sualojaaqui' },

  { id: 'tempoMercado', title: 'Há quanto tempo sua loja está no mercado?', icon: <Calendar className="w-6 h-6" />, type: 'select', options: ['Menos de 6 meses','6 meses a 1 ano','1 a 2 anos','2 a 5 anos','Mais de 5 anos'] },
  { id: 'canaisVenda', title: 'Quais canais de venda você utiliza?', icon: <ShoppingBag className="w-6 h-6" />, type: 'multiple', options: ['Loja física','Instagram','WhatsApp','Site próprio','Marketplace (Mercado Livre, Shopee)','Facebook','Outros'] },
  { id: 'estiloPecas', title: 'Qual o estilo predominante das suas peças?', icon: <Users className="w-6 h-6" />, type: 'select', options: ['Casual','Elegante/Social','Jovem/Moderno','Plus Size','Moda Praia','Íntimo/Lingerie','Esportivo','Boho/Alternativo'] },
  { id: 'perfilPublico', title: 'Qual o perfil do seu público-alvo?', icon: <Users className="w-6 h-6" />, type: 'select', options: ['Jovens (18-25 anos)','Adultas (26-35 anos)','Maduras (36-50 anos)','Todas as idades','Classe A/B','Classe C','Classe C/D'] },
  { id: 'comunicacaoMarca', title: 'Como você descreveria a comunicação da sua marca?', icon: <MessageCircle className="w-6 h-6" />, type: 'select', options: ['Descontraída e jovem','Elegante e sofisticada','Próxima e amigável','Profissional','Ainda estou definindo'] },
  { id: 'faturamento', title: 'Qual o faturamento mensal aproximado da sua loja?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Até R$ 5.000','R$ 5.001 a R$ 15.000','R$ 15.001 a R$ 30.000','R$ 30.001 a R$ 50.000','Acima de R$ 50.000'] },
  { id: 'ticketMedio', title: 'Qual o ticket médio das suas vendas?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Até R$ 50','R$ 51 a R$ 100','R$ 101 a R$ 200','R$ 201 a R$ 300','Acima de R$ 300'] },
  { id: 'produtoMaisVendido', title: 'Qual categoria de produto mais vende na sua loja?', icon: <TrendingUp className="w-6 h-6" />, type: 'text', placeholder: 'Ex: Vestidos, Blusas, Calças, etc.' },
  { id: 'metasVendas', title: 'Qual sua meta de vendas para os próximos 3 meses?', icon: <Target className="w-6 h-6" />, type: 'select', options: ['Aumentar 20%','Aumentar 50%','Dobrar as vendas','Manter o atual','Ainda não defini'] },
  { id: 'desafios', title: 'Quais são seus principais desafios atualmente?', icon: <Target className="w-6 h-6" />, type: 'multiple', options: ['Atrair novos clientes','Aumentar ticket médio','Melhorar presença digital','Organizar estoque','Precificar produtos','Fidelizar clientes','Competir com grandes lojas'] },
  { id: 'presencaDigital', title: 'Onde sua marca está presente digitalmente?', icon: <Smartphone className="w-6 h-6" />, type: 'multiple', options: ['Instagram','Facebook','WhatsApp Business','Site próprio','Google Meu Negócio','TikTok','Pinterest','Nenhum'] },
  { id: 'frequenciaPostagens', title: 'Com que frequência você posta nas redes sociais?', icon: <Instagram className="w-6 h-6" />, type: 'select', options: ['Diariamente','3-4 vezes por semana','1-2 vezes por semana','Esporadicamente','Não posto regularmente'] },
  { id: 'investimentoAnuncios', title: 'Você investe em anúncios pagos?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Sim, regularmente','Sim, esporadicamente','Já tentei, mas parei','Nunca investi','Pretendo começar'] },
  { id: 'temSite', title: 'Sua loja tem site próprio?', icon: <Globe className="w-6 h-6" />, type: 'select', options: ['Sim, com loja virtual','Sim, apenas institucional','Não, mas pretendo ter','Não vejo necessidade'] },
  { id: 'vendasRedesSociais', title: 'Que % das suas vendas vem das redes sociais?', icon: <TrendingUp className="w-6 h-6" />, type: 'select', options: ['Menos de 20%','20% a 40%','40% a 60%','60% a 80%','Mais de 80%'] },
  { id: 'contatoPosCompra', title: 'Como você mantém contato com clientes após a compra?', icon: <Mail className="w-6 h-6" />, type: 'select', options: ['WhatsApp','Instagram','E-mail','SMS','Não mantenho contato regular'] },
  { id: 'objetivosFuturos', title: 'Quais são seus objetivos para os próximos 12 meses?', icon: <Target className="w-6 h-6" />, type: 'multiple', options: ['Aumentar faturamento','Expandir para novos canais','Melhorar presença digital','Abrir loja física','Lançar site/e-commerce','Profissionalizar gestão','Aumentar equipe'] },
  { id: 'diferencial', title: 'Como você se diferencia das outras lojas?', icon: <Target className="w-6 h-6" />, type: 'select', options: ['Preço mais acessível','Qualidade superior','Atendimento personalizado','Exclusividade das peças','Ainda não tenho um diferencial claro'] },
  { id: 'planejamentoColecao', title: 'Você planeja coleções sazonais?', icon: <Calendar className="w-6 h-6" />, type: 'select', options: ['Sim, com antecedência','Sim, mas sem estrutura','Não, compro conforme demanda','Não faço coleções sazonais'] },
  { id: 'retencao', title: 'Você tem ações para estimular a recompra?', icon: <CheckCircle className="w-6 h-6" />, type: 'select', options: ['Programa de fidelidade','Cupons de desconto','Pós-venda personalizado','Não tenho nenhuma ação'] },
  { id: 'analiseConcorrencia', title: 'Com que frequência analisa concorrentes/tendências?', icon: <TrendingUp className="w-6 h-6" />, type: 'select', options: ['Semanalmente','Mensalmente','Raramente','Nunca'] },
  { id: 'metricas', title: 'Você acompanha CAC, ROI ou taxa de recompra?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Sim, frequentemente','Sim, mas com dificuldade','Raramente','Não acompanho'] },
  { id: 'estrategiaConteudo', title: 'Seu conteúdo é pensado para conversão?', icon: <MessageCircle className="w-6 h-6" />, type: 'select', options: ['Estratégico para vendas','Misto: institucional e promoções','Mais institucional','Não tenho estratégia'] }
]

/** mapeia id->tipo para validar preenchimento e cálculo de % */
const fieldsConfig: { key: keyof FormData; type: QType }[] = questions.map(q => ({ key: q.id, type: q.type } as any))

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [sending, setSending] = useState(false)

  // carregar/salvar localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fashionStoreForm')
      if (!raw) return
      const saved = JSON.parse(raw)
      if (saved?.__version !== FORM_VERSION) return
      setFormData({ ...initialFormData, ...saved })
    } catch {}
  }, [])
  useEffect(() => {
    localStorage.setItem('fashionStoreForm', JSON.stringify({ ...formData, __version: FORM_VERSION }))
  }, [formData])

  const updateFormData = (field: keyof FormData, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const toggleArrayValue = (field: keyof FormData, value: string) => {
    const arr = (formData[field] as unknown as string[]) || []
    updateFormData(field, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value])
  }

  // % respondido
  const answeredCount = useMemo(() => {
    return fieldsConfig.reduce((acc, f) => {
      const v = formData[f.key] as any
      if (f.type === 'multiple') return acc + (Array.isArray(v) && v.length ? 1 : 0)
      return acc + (v && String(v).trim() ? 1 : 0)
    }, 0)
  }, [formData])
  const completionPercent = Math.round((answeredCount / fieldsConfig.length) * 100)

  // score de saúde
  const calcHealth = () => {
    let s = 0
    const pd = formData.presencaDigital.length
    if (pd >= 5) s += 20; else if (pd >= 3) s += 14; else if (pd >= 1) s += 8
    if (formData.frequenciaPostagens === 'Diariamente') s += 10
    else if (formData.frequenciaPostagens === '3-4 vezes por semana') s += 8
    else if (formData.frequenciaPostagens === '1-2 vezes por semana') s += 5
    if (formData.investimentoAnuncios === 'Sim, regularmente') s += 10
    else if (formData.investimentoAnuncios === 'Sim, esporadicamente') s += 6
    else if (formData.investimentoAnuncios === 'Pretendo começar') s += 3
    const cv = formData.canaisVenda.length
    if (cv >= 4) s += 10; else if (cv >= 2) s += 6; else if (cv >= 1) s += 3
    if (formData.contatoPosCompra && formData.contatoPosCompra !== 'Não mantenho contato regular') s += 8
    if (formData.metasVendas && formData.metasVendas !== 'Ainda não defini') s += 8
    if (formData.temSite && !formData.temSite.startsWith('Não')) s += 4
    if (formData.vendasRedesSociais === '40% a 60%') s += 6
    else if (['20% a 40%','60% a 80%'].includes(formData.vendasRedesSociais)) s += 4
    else s += 2
    if (formData.diferencial && formData.diferencial !== 'Ainda não tenho um diferencial claro') s += 6
    if (formData.retencao && formData.retencao !== 'Não tenho nenhuma ação') s += 6
    if (formData.metricas && formData.metricas !== 'Não acompanho') s += 6
    const pct = Math.max(0, Math.min(100, Math.round((s / 100) * 100)))
    const label = pct >= 75 ? 'Saudável' : pct >= 50 ? 'Atenção' : 'Crítico'
    const color = pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'
    const bar = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
    return { pct, label, color, bar }
  }

  const generateDiagnostic = () => {
    const out: { area: string; status: string; message: string; color: string }[] = []
    if (formData.presencaDigital.length <= 2) out.push({ area:'Presença Digital', status:'Crítico', message:'Sua presença digital é limitada. Expanda canais.', color:'text-red-600 bg-red-50' })
    else if (formData.presencaDigital.length <= 4) out.push({ area:'Presença Digital', status:'Atenção', message:'Há espaço para abrir novos canais.', color:'text-yellow-600 bg-yellow-50' })
    else out.push({ area:'Presença Digital', status:'Excelente', message:'Presença diversificada. Siga escalando criativos.', color:'text-green-600 bg-green-50' })

    if (['Não posto regularmente','Esporadicamente'].includes(formData.frequenciaPostagens))
      out.push({ area:'Engajamento', status:'Crítico', message:'Consistência de posts é prioridade (3–5x/sem).', color:'text-red-600 bg-red-50' })

    if (formData.investimentoAnuncios === 'Nunca investi')
      out.push({ area:'Marketing Pago', status:'Oportunidade', message:'Teste campanhas básicas com orçamento baixo e criativos simples.', color:'text-blue-600 bg-blue-50' })

    if (!formData.diferencial || formData.diferencial === 'Ainda não tenho um diferencial claro')
      out.push({ area:'Posicionamento', status:'Atenção', message:'Defina um ponto único (qualidade/ajuste/atendimento consultivo).', color:'text-yellow-600 bg-yellow-50' })

    if (formData.desafios.length)
      out.push({ area:'Obstáculos citados', status:'Reportado', message: formData.desafios.join(', '), color:'text-purple-700 bg-purple-50' })

    return out
  }

  const sendFormData = async () => {
    if (sending) return
    setSending(true)
    try {
      const health = calcHealth()
      const payload = {
        ...formData,
        completionPercent,
        healthScore: health.pct,
        healthLabel: health.label,
        submittedAt: new Date().toISOString()
      }
      // envia para a rota local que repassa ao Make
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !(data as any).ok) throw new Error('Falha no envio')
      alert('Pronto! Suas respostas foram enviadas. ✅')
    } catch (e) {
      console.error(e)
      alert('Ops! Não consegui enviar agora. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  // ---------- Tela de diagnóstico ----------
  if (showDiagnostic) {
    const diagnostics = generateDiagnostic()
    const health = calcHealth()
    const visible = diagnostics.slice(0, Math.max(1, Math.ceil(diagnostics.length * 0.3)))
    const blurred = diagnostics.slice(visible.length)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl">
            {/* ===== Comparativo de nível com as FOTOS ===== */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <LevelCard
                badge="Lojinha iniciante"
                captionBold="Faturamento: R$ 1.000/mês"
                caption="Fachada simples, pouco movimento, presença digital fraca."
                img={imgIniciante}
              />
              <LevelCard
                highlight
                badge="Seu nível"
                caption="Pronto para descobrir seu nível e o plano de ação ideal para crescer?"
                img={imgSeuNivel}
              />
              <LevelCard
                badge="Reconhecimento nacional"
                rightTag="Referência"
                captionBold="Brasil"
                caption="Presença em diversas regiões do país e destaque no mercado nacional."
                img={imgNacional}
              />
            </div>

            {/* ===== Métricas rápidas ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-5 rounded-xl border bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-2">% do Quiz Preenchido</h4>
                <div className="flex items-center justify-between text-sm mb-2 text-gray-600">
                  <span>Progresso</span><span>{completionPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>

              <div className="p-5 rounded-xl border bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-2">Saúde da Loja</h4>
                <div className="flex items-center justify-between text-sm mb-2 text-gray-600">
                  <span>Status</span>
                  <span className={`${health.color} font-semibold`}>{health.label} • {health.pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${health.bar}`} style={{ width: `${health.pct}%` }} />
                </div>
              </div>
            </div>

            {/* ===== Diagnóstico (parte visível + borrado) ===== */}
            <div className="space-y-4 mb-8">
              {visible.map((d, i) => (
                <div key={i} className={`p-4 rounded-lg border-l-4 ${d.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{d.area}</h3>
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-white">{d.status}</span>
                  </div>
                  <p className="text-sm">{d.message}</p>
                </div>
              ))}

              {blurred.length > 0 && (
                <div className="relative">
                  <div className="space-y-4 select-none pointer-events-none">
                    {/* painel borrado */}
                    <div className="rounded-xl border bg-[linear-gradient(135deg,#eef2ff,#f5f3ff)] p-6 overflow-hidden">
                      <div className="h-28 w-full blur-sm rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300" />
                      <div className="mt-3 h-3 w-3/4 blur-[2px] bg-neutral-300 rounded" />
                      <div className="mt-2 h-3 w-1/2 blur-[2px] bg-neutral-200 rounded" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/85 backdrop-blur-sm border rounded-xl px-4 py-3 text-center shadow">
                      <p className="font-semibold text-gray-800">Parte do diagnóstico está oculta</p>
                      <p className="text-sm text-gray-600">Desbloqueie o conteúdo completo e o plano de 90 dias</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== CTA ===== */}
            <div className="text-center space-y-4">
              <button
                onClick={sendFormData}
                disabled={sending}
                className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mx-auto flex items-center justify-center ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:from-pink-600 hover:to-purple-700'}`}
              >
                {sending ? 'Enviando…' : 'Acessar Diagnóstico Completo'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <p className="text-sm text-gray-500">Pagamento único • Acesso imediato • Garantia de 7 dias</p>
              <button onClick={() => { setShowDiagnostic(false); setCurrentStep(0) }} className="text-gray-500 hover:text-gray-700 text-sm underline">Voltar ao formulário</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Formulário ----------
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
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-xl text-white mr-4">{currentQuestion.icon}</div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{currentQuestion.title}</h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'text' && (
              <input
                type="text"
                placeholder={(currentQuestion as any).placeholder}
                value={formData[currentQuestion.id] as string}
                onChange={(e) => updateFormData(currentQuestion.id, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-lg"
              />
            )}

            {currentQuestion.type === 'select' && (
              <div className="space-y-3">
                {(currentQuestion as any).options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => updateFormData(currentQuestion.id, opt)}
                    className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                      (formData as any)[currentQuestion.id] === opt
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {(currentQuestion as any).options.map((opt: string) => {
                  const selected = ((formData as any)[currentQuestion.id] as string[]).includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleArrayValue(currentQuestion.id, opt)}
                      className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                        selected ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {opt}
                        {selected && <CheckCircle className="w-5 h-5 text-pink-500" />}
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
            <ChevronLeft className="w-5 h-5 mr-2" /> Anterior
          </button>

          <button
            onClick={() => (currentStep < questions.length - 1 ? setCurrentStep(s => s + 1) : setShowDiagnostic(true))}
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

/* ===================== Componentes auxiliares ===================== */

function LevelCard({
  badge, rightTag, captionBold, caption, img, highlight = false,
}: {
  badge: string
  rightTag?: string
  captionBold?: string
  caption?: string
  img: any
  highlight?: boolean
}) {
  return (
    <article className={`rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm ${highlight ? 'ring-2 ring-indigo-400' : ''}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black tracking-wide text-indigo-700">{badge}</span>
        {rightTag && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{rightTag}</span>}
      </div>
      <div className="relative h-48 overflow-hidden rounded-xl">
        <Image
          src={img}
          alt={badge}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={highlight}
        />
      </div>
      <div className="mt-3 space-y-1 text-center text-sm">
        {captionBold && <p className="font-extrabold text-gray-800">{captionBold}</p>}
        {caption && <p className="text-gray-600">{caption}</p>}
      </div>
    </article>
  )
}
