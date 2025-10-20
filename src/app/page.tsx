'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ChevronRight, ChevronLeft, Store, Instagram, Phone, Calendar, ShoppingBag, Users,
  MessageCircle, DollarSign, Target, TrendingUp, Smartphone, Globe, Mail, CheckCircle, ArrowRight
} from 'lucide-react'

/** ===== Caminhos das imagens (estão dentro de /public/images/niveis) ===== */
const NIVEIS = {
  iniciante: '/images/niveis/lojinha-iniciante.jpg',
  seuNivel: '/images/niveis/seu-nivel-preocupada.jpg',
  nacional: '/images/niveis/loja-shopping.jpg',
} as const

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
]

const fieldsConfig: { key: keyof FormData; type: QType }[] = questions.map(q => ({ key: q.id, type: q.type } as any))

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [sending, setSending] = useState(false)

  const updateFormData = (field: keyof FormData, value: any) => setFormData(prev => ({ ...prev, [field]: value }))

  const toggleArrayValue = (field: keyof FormData, value: string) => {
    const arr = (formData[field] as unknown as string[]) || []
    updateFormData(field, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value])
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  if (showDiagnostic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl">
            {/* Comparativo de níveis */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <LevelCard
                badge="Lojinha iniciante"
                captionBold="Faturamento: R$ 1.000/mês"
                caption="Fachada simples, pouco movimento, presença digital fraca."
                img={NIVEIS.iniciante}
              />
              <LevelCard
                highlight
                badge="Seu nível"
                caption="Pronto para descobrir seu nível e o plano de ação ideal para crescer?"
                img={NIVEIS.seuNivel}
              />
              <LevelCard
                badge="Reconhecimento nacional"
                rightTag="Referência"
                captionBold="Brasil"
                caption="Presença em diversas regiões do país e destaque no mercado nacional."
                img={NIVEIS.nacional}
              />
            </div>

            {/* Placeholder bloqueado */}
            <div className="relative my-6">
              <div className="h-40 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/85 backdrop-blur-sm border rounded-xl px-4 py-3 text-center shadow">
                  <p className="font-semibold text-gray-800">Parte do diagnóstico está oculta</p>
                  <p className="text-sm text-gray-600">Desbloqueie o conteúdo completo e o plano de 90 dias</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <button
                onClick={() => alert('Pagamento simulável aqui')}
                disabled={sending}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mx-auto flex items-center justify-center"
              >
                Acessar Diagnóstico Completo
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <p className="text-sm text-gray-500">Pagamento único • Acesso imediato • Garantia de 7 dias</p>
              <button onClick={() => setShowDiagnostic(false)} className="text-gray-500 hover:text-gray-700 text-sm underline">Voltar ao formulário</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------- FORMULÁRIO ----------
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
            className="flex items-center px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg"
          >
            {currentStep === questions.length - 1 ? 'Ver Diagnóstico' : 'Próxima'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ======= Componente de card de nível ======= */
function LevelCard({
  badge, rightTag, captionBold, caption, img, highlight = false,
}: {
  badge: string
  rightTag?: string
  captionBold?: string
  caption?: string
  img: string
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
