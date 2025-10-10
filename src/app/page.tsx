'use client'

import { useState } from 'react'

export default function QuizPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    instagram: '',
    faturamento: '',
    publico: '',
    estrategia: '',
  })

  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const enviarFormulario = async () => {
    setEnviando(true)
    try {
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setEnviado(true)
      } else {
        alert('Erro ao enviar. Tente novamente.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Diagnóstico da Sua Loja 👗
        </h1>

        {!enviado ? (
          <div className="space-y-4">
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Seu nome"
              name="nome"
              onChange={handleChange}
            />
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="WhatsApp"
              name="telefone"
              onChange={handleChange}
            />
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="@ da loja no Instagram"
              name="instagram"
              onChange={handleChange}
            />
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Faturamento médio mensal"
              name="faturamento"
              onChange={handleChange}
            />
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Público-alvo principal"
              name="publico"
              onChange={handleChange}
            />
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Qual estratégia de vendas você usa hoje?"
              name="estrategia"
              onChange={handleChange}
            />

            <button
              onClick={enviarFormulario}
              disabled={enviando}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              {enviando ? 'Enviando...' : 'Gerar Diagnóstico Completo'}
            </button>
          </div>
        ) : (
          <div className="text-center text-green-600 font-semibold text-lg">
            ✅ Sucesso! Recebemos suas respostas. Em breve você receberá seu plano de ação completo 📊
          </div>
        )}
      </div>
    </div>
  )
}
