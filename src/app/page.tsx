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
    { id: 'nome', title: 'Qual o nome da sua loja?',
