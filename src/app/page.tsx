'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ChevronRight, ChevronLeft, Store, Instagram, Phone, Calendar, ShoppingBag, Users,
  MessageCircle, DollarSign, Target, TrendingUp, Smartphone, Mail, CheckCircle, Loader2
} from 'lucide-react'

/** Versão do schema salvo no localStorage */
const FORM_VERSION = '2.0.2'

type QType = 'text' | 'select' | 'multiple' | 'loading'

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

/** ===== Imagens do /public ===== */
const NIVEIS = {
  iniciante: '/images/niveis/lojinha-iniciante.jpg',
  seuNivel: '/images/niveis/seu-nivel-preocupada.jpg',
  nacional: '/images/niveis/loja-shopping.jpg'
} as const

/** ===== Perguntas + Telas de Carregamento ===== */
type Question =
  | { id: keyof FormData; title: string; icon: JSX.Element; type: 'text'; placeholder: string }
  | { id: keyof FormData; title: string; icon: JSX.Element; type: 'select'; options: string[] }
  | { id: keyof FormData; title: string; icon: JSX.Element; type: 'multiple'; options: string[] }
  | { id: string; type: 'loading'; title: string; subtitle: string; duration: number; finalStep?: boolean }

const questions: Question[] = [
  { id: 'nome', title: 'Qual o nome da sua Loja?', icon: <Store className="w-6 h-6" />, type: 'text', placeholder: 'Digite o nome da sua loja' },
  { id: 'whatsapp', title: 'Qual o seu WhatsApp para enviar o Diagnóstico?', icon: <Phone className="w-6 h-6" />, type: 'text', placeholder: '(11) 99999-9999' },
  { id: 'instagram', title: 'Qual o Instagram da sua loja?', icon: <Instagram className="w-6 h-6" />, type: 'text', placeholder: '@sualojaaqui' },

  { id: 'tempoMercado', title: 'Há quanto tempo a sua loja existe?', icon: <Calendar className="w-6 h-6" />, type: 'select', options: ['Menos de 6 meses','6 meses a 1 ano','1 a 2 anos','2 a 5 anos','Mais de 5 anos'] },
  { id: 'canaisVenda', title: 'Quais canais de venda você utiliza?', icon: <ShoppingBag className="w-6 h-6" />, type: 'multiple', options: ['Loja física','Instagram','WhatsApp','Site próprio','Marketplace (Mercado Livre, Shopee)','Facebook','Outros'] },
  { id: 'estiloPecas', title: 'Qual o estilo predominante das suas peças?', icon: <Users className="w-6 h-6" />, type: 'select', options: ['Casual','Elegante/Social','Jovem/Moderno','Plus Size','Moda Praia','Íntimo/Lingerie','Esportivo','Boho/Alternativo'] },
  { id: 'perfilPublico', title: 'Qual o perfil do seu público-alvo?', icon: <Users className="w-6 h-6" />, type: 'select', options: ['Jovens (18-25 anos)','Adultas (26-35 anos)','Maduras (36-50 anos)','Todas as idades','Classe A/B','Classe C','Classe C/D'] },
  { id: 'comunicacaoMarca', title: 'Como você descreveria a comunicação da sua marca?', icon: <MessageCircle className="w-6 h-6" />, type: 'select', options: ['Descontraída e jovem','Elegante e sofisticada','Próxima e amigável','Profissional','Ainda estou definindo'] },

  { id: 'scan1', type: 'loading', title: 'Analisando sua loja...', subtitle: 'Identificando presença digital e comportamento da marca', duration: 6000 },

  { id: 'faturamento', title: 'Qual o faturamento mensal aproximado da sua loja?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Até R$ 5.000','R$ 5.001 a R$ 15.000','R$ 15.001 a R$ 30.000','R$ 30.001 a R$ 50.000','Acima de R$ 50.000'] },
  { id: 'ticketMedio', title: 'Qual o ticket médio das suas vendas?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Até R$ 50','R$ 51 a R$ 100','R$ 101 a R$ 200','R$ 201 a R$ 300','Acima de R$ 300'] },
  { id: 'produtoMaisVendido', title: 'Qual categoria de produto mais vende na sua loja?', icon: <TrendingUp className="w-6 h-6" />, type: 'text', placeholder: 'Ex: Vestidos, Blusas, Calças, etc.' },
  { id: 'metasVendas', title: 'Qual sua meta de vendas para os próximos 3 meses?', icon: <Target className="w-6 h-6" />, type: 'select', options: ['Aumentar 20%','Aumentar 50%','Dobrar as vendas','Manter o atual','Ainda não defini'] },
  { id: 'desafios', title: 'Quais são seus principais desafios atualmente?', icon: <Target className="w-6 h-6" />, type: 'multiple', options: ['Atrair novos clientes','Aumentar ticket médio','Melhorar presença digital','Organizar estoque','Precificar produtos','Fidelizar clientes','Competir com grandes lojas'] },
  { id: 'presencaDigital', title: 'Onde sua marca está presente digitalmente?', icon: <Smartphone className="w-6 h-6" />, type: 'multiple', options: ['Instagram','Facebook','WhatsApp Business','Site próprio','Google Meu Negócio','TikTok','Pinterest','Nenhum'] },
  { id: 'frequenciaPostagens', title: 'Com que frequência você posta nas redes sociais?', icon: <Instagram className="w-6 h-6" />, type: 'select', options: ['Diariamente','3-4 vezes por semana','1-2 vezes por semana','Esporadicamente','Não posto regularmente'] },
  { id: 'investimentoAnuncios', title: 'Você investe em anúncios pagos?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Sim, regularmente','Sim, esporadicamente','Já tentei, mas parei','Nunca investi','Pretendo começar'] },
  { id: 'vendasRedesSociais', title: 'Que % das suas vendas vem das redes sociais?', icon: <TrendingUp className="w-6 h-6" />, type: 'select', options: ['Menos de 20%','20% a 40%','40% a 60%','60% a 80%','Mais de 80%'] },

  { id: 'scan2', type: 'loading', title: 'Criando o planejamento ideal para sua loja...', subtitle: 'Usando suas respostas para montar o plano perfeito', duration: 8000 },

  { id: 'contatoPosCompra', title: 'Como você mantém contato com clientes após a compra?', icon: <Mail className="w-6 h-6" />, type: 'select', options: ['WhatsApp','Instagram','E-mail','SMS','Não mantenho contato regular'] },
  { id: 'objetivosFuturos', title: 'Quais são seus objetivos para os próximos 12 meses?', icon: <Target className="w-6 h-6" />, type: 'multiple', options: ['Aumentar faturamento','Expandir para novos canais','Melhorar presença digital','Abrir loja física','Lançar site/e-commerce','Profissionalizar gestão','Aumentar equipe'] },
  { id: 'diferencial', title: 'Como você se diferencia das outras lojas?', icon: <Target className="w-6 h-6" />, type: 'select', options: ['Preço mais acessível','Qualidade superior','Atendimento personalizado','Exclusividade das peças','Ainda não tenho um diferencial claro'] },
  { id: 'planejamentoColecao', title: 'Você planeja coleções sazonais?', icon: <Calendar className="w-6 h-6" />, type: 'select', options: ['Sim, com antecedência','Sim, mas sem estrutura','Não, compro conforme demanda','Não faço coleções sazonais'] },
  { id: 'retencao', title: 'Você tem ações para estimular a recompra?', icon: <CheckCircle className="w-6 h-6" />, type: 'select', options: ['Programa de fidelidade','Cupons de desconto','Pós-venda personalizado','Não tenho nenhuma ação'] },
  { id: 'analiseConcorrencia', title: 'Com que frequência analisa concorrentes/tendências?', icon: <TrendingUp className="w-6 h-6" />, type: 'select', options: ['Semanalmente','Mensalmente','Raramente','Nunca'] },
  { id: 'metricas', title: 'Você acompanha Custo de aquisição de clientes (CAC), Retorno sobre o investimento (ROI) ou taxa de recompra?', icon: <DollarSign className="w-6 h-6" />, type: 'select', options: ['Sim, frequentemente','Sim, mas com dificuldade','Raramente','Não acompanho'] },
  { id: 'estrategiaConteudo', title: 'Seu conteúdo é pensado para conversão?', icon: <MessageCircle className="w-6 h-6" />, type: 'select', options: ['Estratégico para vendas','Misto: institucional e promoções','Mais institucional','Não tenho estratégia'] },

  { id: 'scan3', type: 'loading', title: 'Gerando seu diagnóstico personalizado...', subtitle: 'Consolidando todas as informações da sua loja', duration: 6000, finalStep: true },
]

/** mapeia id->tipo para validar preenchimento e cálculo de % (exclui as telas loading) */
const fieldsConfig: { key: keyof FormData; type: Exclude<QType,'loading'> }[] =
  (questions.filter(q => q.type !== 'loading') as any[]).map(q => ({ key: q.id, type: q.type }))

/** ---------- Component de carregamento ---------- */
function AnalyzingScreen({ title, subtitle, duration, onFinish }: { title: string; subtitle: string; duration: number; onFinish: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFinish, duration)
    return () => clearTimeout(t)
  }, [duration, onFinish])

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-5">
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full border-4 border-pink-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin" />
        <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-pink-600 animate-pulse" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-600 animate-[loadingbar_1.4s_ease_infinite]" />
      </div>
      <style jsx>{`
        @keyframes loadingbar {
          0% { transform: translateX(-100%); width: 40%; }
          50% { transform: translateX(20%); width: 60%; }
          100% { transform: translateX(100%); width: 40%; }
        }
      `}</style>
    </div>
  )
}

/** ---------- Página ---------- */
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

  // % respondido (considera só perguntas não-loading)
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
    else
      out.push({ area:'Engajamento', status:'OK', message:'Boa frequência. Foque em CTAs e prova social.', color:'text-green-600 bg-green-50' })

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

  // ---------- DIAGNÓSTICO (priorizado para evitar “loading infinito”) ----------
  if (showDiagnostic) {
    const diagnostics = generateDiagnostic()
    const health = calcHealth()
    const visible = diagnostics.slice(0, Math.max(1, Math.ceil(diagnostics.length * 0.3)))
    const blurred = diagnostics.slice(visible.length)

    return (
      <div className="min-h-[100svh] w-full bg-gradient-to-br from-pink-50 via-white to-purple-50 py-10 px-4">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Desbloqueie o diagnóstico completo da sua loja</h1>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-gray-600">Veja seu nível no mercado de moda, entenda o que está travando seu crescimento e receba um caminho claro para vender mais.</p>
          </header>

         {/* KPIs superiores + CTA para Planos */}
<section className="grid gap-6 md:grid-cols-2 mb-6">
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
</section>

{/* CTA: leva para os Planos */}
<div className="text-center mb-10">
  <button
    onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-[0_6px_0_#3730a3] transition hover:bg-indigo-700 active:translate-y-[1px]"
    aria-label="Ir para os planos"
  >
    Adquirir meu diagnóstico completo
    <ChevronRight className="w-5 h-5 ml-2" />
  </button>
</div>


          <section className="grid gap-4 md:grid-cols-3">
            <CardBox>
              <div className="mb-2 text-center"><Badge>Lojinha iniciante</Badge></div>
              <div className="h-48 w-full overflow-hidden rounded-xl bg-neutral-100">
                <img src={NIVEIS.iniciante} alt="Lojinha iniciante" className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 space-y-1 text-center text-sm">
                <p className="font-extrabold text-gray-800">Faturamento: R$ 1.000/mês</p>
                <p className="text-gray-600">Fachada simples, pouco movimento, presença digital fraca.</p>
              </div>
            </CardBox>

            <CardBox extra="ring-2 ring-indigo-400 text-center">
              <div className="mb-2"><Badge>Seu nível</Badge></div>
              <div className="h-48 w-full overflow-hidden rounded-xl bg-neutral-100">
                <img src={NIVEIS.seuNivel} alt="Seu nível" className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 text-sm text-neutral-600">Pronto para descobrir seu nível e o plano de ação ideal para crescer?</p>
            </CardBox>

            <CardBox>
              <div className="mb-2 text-center"><Badge>Reconhecimento nacional</Badge></div>
              <div className="h-48 w-full overflow-hidden rounded-xl bg-neutral-100">
                <img src={NIVEIS.nacional} alt="Fachada de loja de shopping, vitrine impecável" className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 space-y-1 text-center text-sm">
                <p className="font-extrabold text-gray-800">Brasil</p>
                <p className="text-gray-600">Presença em diversas regiões e destaque no mercado nacional.</p>
              </div>
            </CardBox>
          </section>

          <section className="mt-8 space-y-4">
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
                <div className="space-y-4 filter blur-sm select-none pointer-events-none">
                  {blurred.map((d, i) => (
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
                  <div className="bg-white/85 backdrop-blur-sm border rounded-xl px-4 py-3 text-center shadow">
                    <p className="font-semibold text-gray-800">Parte do diagnóstico está oculta</p>
                    <p className="text-sm text-gray-600">Desbloqueie o conteúdo completo e o plano de 90 dias</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="mt-12" id="planos">
            <SectionTitle overline="Oferta" title="Escolha seu acesso ao diagnóstico completo" />
            <div className="grid gap-5 md:grid-cols-3 items-stretch">
              <PriceCard
                title="Plano 1"
                price="R$ 14,90"
                sub="PAGAMENTO ÚNICO"
                bullets={[
                  'Análise da sua loja',
                  'Checklist de prioridade (curto prazo)'
                ]}
              />
              <PriceCard
                ribbon="Mais vendido"
                highlight
                title="Plano 2"
                price="R$ 19,90"
                sub="PAGAMENTO ÚNICO"
                bullets={[
                  'Análise da sua loja',
                  'Direcionamento de melhorias',
                  'Sugestões de conteúdo e ofertas'
                ]}
              />
              <PriceCard
                ribbon="Recomendado"
                title="Plano 3"
                price="R$ 27,90"
                sub="PAGAMENTO ÚNICO"
                bullets={[
                  'Análise da loja',
                  'Direcionamento de melhorias',
                  'Relatório personalizado para a sua loja',
                  'Manual de bolso de um perfil campeão (conteúdo, funil e vendas)'
                ]}
              />
            </div>
          </section>

          <section className="mt-12">
            <SectionTitle overline="Seu relatório" title="Relatório personalizado para a sua loja" />
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <p className="mx-auto max-w-3xl text-center text-sm text-neutral-700">Seus resultados mostram dados valiosos sobre presença digital, proposta de valor e potencial de crescimento. Ao desbloquear, você recebe o relatório completo com melhorias prioritárias e um roteiro claro para os próximos 90 dias.</p>
              <div className="relative mt-4 overflow-hidden rounded-xl">
  {/* Fundo simulado com cores e skeletons */}
  <div className="h-48 w-full select-none bg-[radial-gradient(circle_at_20%_30%,#fce7f3,transparent_40%),radial-gradient(circle_at_80%_70%,#e9d5ff,transparent_40%),linear-gradient(to_right,#f5f5f5,#e5e7eb)]">
    <div className="absolute inset-0 opacity-70">
      <div className="m-4 space-y-3">
        <div className="h-4 w-3/5 bg-white/40 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-white/40 rounded animate-pulse" />
        <div className="h-4 w-2/5 bg-white/40 rounded animate-pulse" />
        <div className="h-20 w-full bg-white/30 rounded animate-pulse" />
      </div>
    </div>
  </div>

  {/* Camada borrada e levemente opaca para evitar "tudo branco" */}
  <div className="absolute inset-0 backdrop-blur-sm bg-white/50" />

  {/* Cartão com cadeado por cima */}
  <div className="absolute inset-0 grid place-items-center">
    <div className="rounded-xl bg-white/90 px-4 py-3 text-center shadow">
      <div className="text-2xl">🔒</div>
      <div className="font-semibold text-gray-800">Você precisa de acesso completo para ler o relatório</div>
    </div>
  </div>
</div>

              <p className="mt-2 text-center text-[11px] text-neutral-500">Disponível imediatamente após a confirmação do pagamento.</p>
            </div>
          </section>

          <section className="mt-12">
            <SectionTitle overline="Resultados reais" title="Lojistas que destravaram o crescimento" />
            <div className="grid gap-4 md:grid-cols-3">
              <RealResultCard img="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" nome="Carla, Boutique Luma" texto="Em 30 dias, passei a postar 3x por semana com CTA e o WhatsApp virou meu melhor canal. Vendi 2x mais kits." />
              <RealResultCard img="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop" nome="Gabi, Dona G Modas" texto="Organizei ofertas por coleção e aumentei o ticket médio com combos. O plano deu clareza total." />
              <RealResultCard img="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop" nome="Isa, Clube da Saia" texto="Fluxo de pós-compra e reativação trouxe clientes de volta. ROI dos anúncios subiu com criativo alinhado." />
            </div>
          </section>

          <section className="mt-12">
            <SectionTitle overline="Avaliações" title="O que lojistas estão dizendo" />
            <div className="grid gap-4 md:grid-cols-3">
              <Testimonial img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" nome="Paula" tag="VERIFICADO" texto="Finalmente parei de tentar de tudo e foquei no que funciona. Em 45 dias, bati minha melhor semana do ano." />
              <Testimonial img="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop" nome="Renata" tag="VERIFICADO" texto="As tarefas semanais me ajudaram a sair da inércia. Meus stories agora geram pedidos no mesmo dia." />
              <Testimonial img="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop" nome="Eduardo" tag="VERIFICADO" texto="Eu não tinha estratégia. O diagnóstico mostrou o caminho e o relatório personalizado vale cada centavo." />
            </div>
          </section>

          <section className="mt-12 text-center">
            <button
              onClick={sendFormData}
              disabled={sending}
              className={`inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-lg font-extrabold text-white shadow-[0_8px_0_#3730a3] transition hover:bg-indigo-700 active:translate-y-[2px] active:shadow-[0_6px_0_#3730a3] ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {sending ? 'Enviando…' : 'Desbloquear meu diagnóstico'}
            </button>
            <p className="mt-2 text-xs text-neutral-500">Pagamento único • Acesso imediato • Garantia de 7 dias</p>
          </section>
        </div>
      </div>
    )
  }

  // ---------- Se for etapa de "loading", mostra AnalyzingScreen e não mostra navegação ----------
  if (currentQuestion.type === 'loading') {
    const q = currentQuestion as Extract<Question, {type:'loading'}>
    return (
      <div className="min-h-[100svh] flex flex-col bg-gradient-to-br from-pink-50 to-purple-50 px-4 pt-10 pb-6">
        <header className="text-center mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Diagnóstico da Sua Loja</h1>
          <p className="text-gray-600 text-sm sm:text-base">Descubra como acelerar o crescimento da sua loja de moda feminina</p>
        </header>

        <main className="flex-1 flex flex-col justify-start mt-4 max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <AnalyzingScreen
              title={q.title}
              subtitle={q.subtitle}
              duration={q.duration}
              onFinish={() => {
                if (q.finalStep) setShowDiagnostic(true)
                else setCurrentStep(s => Math.min(questions.length - 1, s + 1))
              }}
            />
          </div>
        </main>
      </div>
    )
  }

  // ---------- Formulário ----------
  return (
    <div className="min-h-[100svh] flex flex-col bg-gradient-to-br from-pink-50 to-purple-50 px-4 pt-10 pb-6">
      <header className="text-center mb-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Diagnóstico da Sua Loja</h1>
        <p className="text-gray-600 text-sm sm:text-base">Descubra como acelerar o crescimento da sua loja de moda feminina</p>
      </header>

      <main className="flex-1 flex flex-col justify-start mt-3 max-w-md mx-auto w-full">
        <div className="mb-5">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Etapa {currentStep + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-5 flex flex-col items-stretch justify-center">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-xl text-white mr-3">
              {(currentQuestion as any).icon}
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{(currentQuestion as any).title}</h2>
          </div>

          <div className="space-y-4">
            {(currentQuestion as any).type === 'text' && (
              <input
                type="text"
                placeholder={(currentQuestion as any).placeholder}
                value={(formData as any)[(currentQuestion as any).id] as string}
                onChange={(e) => updateFormData((currentQuestion as any).id, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-base sm:text-lg"
              />
            )}

            {(currentQuestion as any).type === 'select' && (
              <div className="space-y-3">
                {(currentQuestion as any).options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => updateFormData((currentQuestion as any).id, opt)}
                    className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                      (formData as any)[(currentQuestion as any).id] === opt
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {(currentQuestion as any).type === 'multiple' && (
              <div className="space-y-3">
                {(currentQuestion as any).options.map((opt: string) => {
                  const selected = ((formData as any)[(currentQuestion as any).id] as string[]).includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleArrayValue((currentQuestion as any).id, opt)}
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

               {/* BOTÕES – Próxima em cima, Anterior embaixo */}
        <div className="flex flex-col gap-3 mt-1">
          {/* Próxima */}
          <button
            onClick={() =>
              currentStep < questions.length - 1
                ? setCurrentStep(s => s + 1)
                : setShowDiagnostic(true)
            }
            disabled={
              ((currentQuestion as any).type === 'text' && !(formData as any)[(currentQuestion as any).id]) ||
              ((currentQuestion as any).type === 'select' && !(formData as any)[(currentQuestion as any).id]) ||
              ((currentQuestion as any).type === 'multiple' && ((formData as any)[(currentQuestion as any).id] as string[]).length === 0)
            }
            className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              (((currentQuestion as any).type === 'text' && !(formData as any)[(currentQuestion as any).id]) ||
                ((currentQuestion as any).type === 'select' && !(formData as any)[(currentQuestion as any).id]) ||
                ((currentQuestion as any).type === 'multiple' && ((formData as any)[(currentQuestion as any).id] as string[]).length === 0))
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg'
            }`}
            aria-label="Ir para a próxima etapa"
          >
            {currentStep === questions.length - 1 ? 'Ver Diagnóstico' : 'Próxima'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>

          {/* Anterior */}
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
            aria-label="Voltar para a etapa anterior"
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Anterior
          </button>
        </div>

      </main>
    </div>
  )
}

/* ===== Components auxiliares (inline) ===== */
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black tracking-wide text-indigo-700">{children}</span>
}

function SectionTitle({ overline, title }: { overline?: string; title: string }) {
  return (
    <div className="mb-6 text-center">
      {overline && <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-600">{overline}</div>}
      <h2 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900">{title}</h2>
    </div>
  )
}

function CardBox({ children, extra = '' }: { children: React.ReactNode; extra?: string }) {
  return <article className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 ${extra}`}>{children}</article>
}

function PriceCard({ title, price, sub, bullets, ribbon, highlight=false }: { title: string; price: string; sub: string; bullets: string[]; ribbon?: string; highlight?: boolean }) {
  return (
    <div className={[ 'relative flex h-full flex-col rounded-2xl bg-white text-center shadow-sm ring-1 ring-black/5 transition', highlight ? 'ring-2 ring-indigo-400' : '' ].join(' ')}>
      {ribbon && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-sm">{ribbon}</div>
      )}
      <div className="px-6 pt-8">
        <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
        <div className="mt-3 text-4xl font-black leading-none text-gray-900">{price}</div>
        <div className="mt-1 text-[12px] uppercase tracking-wide text-neutral-500">{sub}</div>
      </div>
      <div className="mx-8 mt-5 min-h-[160px] flex-1">
        <ul className="space-y-2 text-left text-sm text-neutral-700">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2"><span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-neutral-700" /><span>{b}</span></li>
          ))}
        </ul>
      </div>
      <div className="px-6 pb-7 pt-4">
        <button className="mx-auto inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-[0_6px_0_#3730a3] transition hover:translate-y-[-1px] hover:bg-indigo-700 hover:shadow-[0_7px_0_#3730a3] active:translate-y-[1px] active:shadow-[0_5px_0_#3730a3]">Desbloquear meu diagnóstico</button>
        <p className="mt-2 text-center text-[11px] text-neutral-500">Pagamento único • Acesso imediato • Garantia de 7 dias</p>
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-pink-50 text-lg">{icon}</div>
      <div>
        <div className="font-extrabold text-gray-900">{title}</div>
        <div className="text-sm text-neutral-600">{desc}</div>
      </div>
    </div>
  )
}

function RealResultCard({ img, nome, texto }: { img: string; nome: string; texto: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="h-36 w-full overflow-hidden rounded-xl bg-neutral-100">
        <img src={img} alt={nome} className="h-full w-full object-cover" />
      </div>
      <div className="mt-3 text-sm">
        <div className="font-semibold text-gray-900">{nome}</div>
        <p className="text-neutral-700">{texto}</p>
      </div>
    </div>
  )
}

function Testimonial({ img, nome, tag, texto }: { img: string; nome: string; tag: string; texto: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200"><img src={img} alt={nome} className="h-full w-full object-cover" /></div>
        <div className="font-semibold">{nome}</div>
        <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{tag}</span>
      </div>
      <div className="text-neutral-700">{texto}</div>
    </div>
  )
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
      <details>
        <summary className="cursor-pointer list-none text-left font-semibold text-gray-900">{q}</summary>
        <p className="mt-2 text-sm text-neutral-600">{a}</p>
      </details>
    </div>
  )
}
