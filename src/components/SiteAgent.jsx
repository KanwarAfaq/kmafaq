import { useEffect, useRef, useState } from 'react'
import { FiExternalLink, FiMessageCircle, FiSend, FiX } from 'react-icons/fi'
import { trackEvent } from '../lib/analytics'

const starters = [
  'What research does K.M. AFAQ work on?',
  'Show me the latest projects',
  'What publications are listed?',
  'How can I contact K.M. AFAQ?',
]

export default function SiteAgent() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi — I answer only from information published on this website. Ask me about K.M. AFAQ’s research, projects, publications, skills, blog, scholarships, or contact details.',
      sources: [],
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, sending])

  async function ask(question) {
    const value = String(question || '').trim()
    if (!value || sending) return

    const userMessage = { role: 'user', content: value }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    trackEvent('chatbot_question', { question_length: value.length })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        const message = payload?.setupRequired
          ? 'The website assistant is installed but still needs its server API key configured.'
          : (payload?.error || 'The website assistant is temporarily unavailable.')
        setMessages((current) => [...current, { role: 'assistant', content: message, sources: [] }])
        return
      }

      const seen = new Set()
      const sources = (payload.sources || []).filter((source) => {
        if (!source?.path || seen.has(source.path)) return false
        seen.add(source.path)
        return true
      })

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: payload.answer,
          sources,
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'The website assistant is temporarily unavailable.',
          sources: [],
        },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    ask(input)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { trackEvent('chatbot_opened'); setOpen(true) }}
        aria-label="Open K.M. AFAQ website assistant"
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/30"
      >
        <FiMessageCircle size={23} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[1000] flex items-end justify-end bg-black/20 p-3 backdrop-blur-[1px] sm:p-5" onClick={() => setOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="K.M. AFAQ website assistant"
            className="flex h-[min(720px,85vh)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-black text-white">KA</div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold text-gray-900 dark:text-white">K.M. AFAQ Website Assistant</h2>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Site-only · live website data
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close website assistant"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <FiX size={19} />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/60 px-4 py-4 dark:bg-gray-950/40">
              {messages.map((message, index) => (
                <div key={index} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={message.role === 'user'
                    ? 'max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm leading-6 text-white'
                    : 'max-w-[92%] rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200'}>
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {message.sources?.length > 0 ? (
                      <div className="mt-3 border-t border-gray-100 pt-2 dark:border-gray-800">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Website sources</p>
                        <div className="flex flex-wrap gap-1.5">
                          {message.sources.map((source) => (
                            <a
                              key={source.path}
                              href={source.path}
                              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            >
                              {source.title}
                              <FiExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {sending ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:240ms]" />
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            {messages.length === 1 ? (
              <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {starters.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => ask(starter)}
                      className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:border-accent dark:border-gray-700 dark:bg-gray-950">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value.slice(0, 500))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      handleSubmit(event)
                    }
                  }}
                  rows={1}
                  maxLength={500}
                  placeholder="Ask about this website…"
                  className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiSend size={16} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-gray-400">
                Answers are restricted to content published on kmafaq.site.
              </p>
            </form>
          </section>
        </div>
      ) : null}
    </>
  )
}
