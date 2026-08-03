import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const skillGroups = [
  {
    category: 'Machine Learning & DL',
    color: '#6366f1',
    skills: [
      { name: 'TensorFlow / Keras',  level: 88 },
      { name: 'PyTorch',             level: 80 },
      { name: 'Scikit-learn',        level: 92 },
      { name: 'CNN Architecture',    level: 85 },
      { name: 'LSTM / GRU',          level: 90 },
    ],
  },
  {
    category: 'NLP & Text Processing',
    color: '#10b981',
    skills: [
      { name: 'BERT / Transformers', level: 82 },
      { name: 'NLTK & spaCy',        level: 88 },
      { name: 'Text Normalization',  level: 95 },
      { name: 'Tokenization',        level: 90 },
      { name: 'Roman Urdu NLP',      level: 97 },
    ],
  },
  {
    category: 'Programming & Tools',
    color: '#f59e0b',
    skills: [
      { name: 'Python',              level: 95 },
      { name: 'React / JavaScript',  level: 75 },
      { name: 'SQL',                 level: 78 },
      { name: 'Git & GitHub',        level: 88 },
      { name: 'LaTeX',               level: 85 },
    ],
  },
  {
    category: 'Data & Automation',
    color: '#ec4899',
    skills: [
      { name: 'Pandas & NumPy',      level: 93 },
      { name: 'Selenium / Scrapy',   level: 90 },
      { name: 'Data Visualization',  level: 85 },
      { name: 'API Integration',     level: 82 },
      { name: 'BeautifulSoup',       level: 92 },
    ],
  },
]

/* ─────────────────────────────────────────
   Radar Chart (SVG)
───────────────────────────────────────── */
const RADAR_SKILLS = [
  { label: 'Machine\nLearning',  value: 88 },
  { label: 'NLP',                value: 93 },
  { label: 'Python',             value: 95 },
  { label: 'Data\nScience',      value: 87 },
  { label: 'Research',           value: 90 },
  { label: 'Automation',         value: 88 },
]

function RadarChart({ animated }) {
  const size   = 260
  const cx     = size / 2
  const cy     = size / 2
  const radius = 100
  const levels = 5
  const n      = RADAR_SKILLS.length

  const angleStep = (2 * Math.PI) / n
  const angle = (i) => i * angleStep - Math.PI / 2

  const toXY = (i, r) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  })

  /* Grid polygon points for each level */
  const gridPolygon = (level) =>
    Array.from({ length: n }, (_, i) => {
      const r = (radius * level) / levels
      const { x, y } = toXY(i, r)
      return `${x},${y}`
    }).join(' ')

  /* Data polygon */
  const dataPolygon = (scale = 1) =>
    RADAR_SKILLS.map((s, i) => {
      const r = (s.value / 100) * radius * scale
      const { x, y } = toXY(i, r)
      return `${x},${y}`
    }).join(' ')

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid lines */}
        {Array.from({ length: levels }, (_, l) => (
          <polygon
            key={l}
            points={gridPolygon(l + 1)}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.1"
            className="text-gray-400"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {RADAR_SKILLS.map((_, i) => {
          const { x, y } = toXY(i, radius)
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={x}  y2={y}
              stroke="currentColor"
              strokeOpacity="0.15"
              className="text-gray-400"
              strokeWidth="1"
            />
          )
        })}

        {/* Data area */}
        <motion.polygon
          points={dataPolygon(animated ? 1 : 0)}
          fill="var(--accent)"
          fillOpacity="0.2"
          stroke="var(--accent)"
          strokeWidth="2.5"
          initial={{ points: dataPolygon(0) }}
          animate={{ points: animated ? dataPolygon(1) : dataPolygon(0) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Data dots */}
        {RADAR_SKILLS.map((s, i) => {
          const r = (s.value / 100) * radius
          const { x, y } = toXY(i, r)
          return (
            <motion.circle
              key={i}
              cx={x} cy={y}
              r={4}
              fill="var(--accent)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: animated ? 1 : 0, scale: animated ? 1 : 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
            />
          )
        })}

        {/* Labels */}
        {RADAR_SKILLS.map((s, i) => {
          const labelR = radius + 24
          const { x, y } = toXY(i, labelR)
          const lines = s.label.split('\n')
          return (
            <text
              key={i}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current text-gray-600 dark:text-gray-300"
              fontSize="11"
              fontWeight="600"
            >
              {lines.map((line, li) => (
                <tspan
                  key={li}
                  x={x}
                  dy={li === 0 ? (lines.length > 1 ? '-0.5em' : '0') : '1.2em'}
                >
                  {line}
                </tspan>
              ))}
            </text>
          )
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="var(--accent)" />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────
   Animated Progress Bar
───────────────────────────────────────── */
function SkillBar({ name, level, color, delay = 0, animate }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>
        <span className="text-sm font-bold" style={{ color }}>
          {level}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: animate ? `${level}%` : '0%' }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main SkillChart Component
───────────────────────────────────────── */
export default function SkillChart() {
  const ref       = useRef(null)
  const isInView  = useInView(ref, { once: true, margin: '-100px' })
  const [tab, setTab] = useState(0)

  return (
    <div ref={ref} className="w-full">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="section-title">
          Technical <span className="text-accent">Skills</span>
        </h2>
        <p className="section-subtitle mx-auto">
          Proficiency levels across research and development tools
        </p>
      </motion.div>

      {/* ── Layout ── */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">

        {/* Left — Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">
            Core Competency <span className="text-accent">Overview</span>
          </h3>
          <RadarChart animated={isInView} />

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {RADAR_SKILLS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
                {s.label.replace('\n', ' ')} — {s.value}%
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Progress Bars with Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {skillGroups.map((g, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
                  ${tab === i
                    ? 'text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:opacity-80'
                  }`}
                style={tab === i ? { backgroundColor: g.color } : {}}
              >
                {g.category}
              </button>
            ))}
          </div>

          {/* Active skill group */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest mb-5"
                style={{ color: skillGroups[tab].color }}>
                {skillGroups[tab].category}
              </h3>
              {skillGroups[tab].skills.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={skillGroups[tab].color}
                  delay={i * 0.1}
                  animate={isInView}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Proficiency Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest mb-3">
              Proficiency Scale
            </p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-400">
              {[
                { range: '0–50%',   label: 'Learning',     bg: 'bg-gray-200 dark:bg-gray-700' },
                { range: '51–70%',  label: 'Familiar',     bg: 'bg-blue-100 dark:bg-blue-900/30' },
                { range: '71–85%',  label: 'Proficient',   bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                { range: '86–100%', label: 'Expert',       bg: 'bg-green-100 dark:bg-green-900/30' },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-lg py-1.5 px-2`}>
                  <div className="font-bold text-gray-600 dark:text-gray-300 text-xs">
                    {item.label}
                  </div>
                  <div className="text-gray-400 text-xs">{item.range}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}