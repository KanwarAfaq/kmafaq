import React from 'react'

function formatDate(value) {
  if (!value) return ''
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  } catch {
    return value
  }
}

function cleanUrl(url) {
  if (!url) return ''
  return String(url).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

function getSkillLabel(group) {
  return (
    group?.category ||
    group?.title ||
    group?.name ||
    group?.label ||
    'Skills'
  )
}

function normalizeSkillText(group) {
  if (!group) return ''

  const arrayCandidates = [
    group.items,
    group.skills,
    group.technologies,
    group.names,
    group.tags,
    group.keywords,
  ]

  for (const candidate of arrayCandidates) {
    const arr = toArray(candidate)
    if (arr.length) return arr.join(', ')
  }

  const stringCandidates = [
    group.description,
    group.content,
    group.value,
    group.list,
    group.skill_text,
    group.skilltext,
    group.skill_list,
    group.skills_text,
    group.technologies_text,
  ]

  for (const candidate of stringCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return ''
}

function normalizeProject(project) {
  return {
    id: project?.id || project?.slug || project?.title,
    title: project?.title || project?.name || 'Untitled Project',
    category: project?.category || project?.type || project?.focus || '',
    desc:
      project?.desc ||
      project?.description ||
      project?.desctext ||
      project?.summary ||
      project?.overview ||
      project?.excerpt ||
      '',
    tags:
      toArray(project?.tags).length
        ? toArray(project?.tags)
        : toArray(project?.technologies).length
        ? toArray(project?.technologies)
        : toArray(project?.skills),
  }
}

function normalizeCertification(cert) {
  return {
    id: cert?.id || cert?.title,
    title: cert?.title || cert?.name || 'Certification',
    issuer: cert?.issuer || cert?.organization || cert?.provider || '',
    date: cert?.date || cert?.issuedate || cert?.issue_date || cert?.year || '',
    skills:
      toArray(cert?.skills).length
        ? toArray(cert?.skills)
        : toArray(cert?.tags).length
        ? toArray(cert?.tags)
        : toArray(cert?.topics),
  }
}

function normalizePublication(paper) {
  return {
    id: paper?.id || paper?.title,
    title: paper?.title || 'Untitled Publication',
    authors: paper?.authors || paper?.author || '',
    journal: paper?.journal || paper?.venue || paper?.conference || '',
    year: paper?.year || paper?.published_year || '',
  }
}

function getCount(profile, keys, fallback = 0) {
  for (const key of keys) {
    const value = profile?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return fallback
}

export default function ResumePdf({
  profile = {},
  socials = [],
  projects = [],
  publications = [],
  certifications = [],
  skills = [],
}) {
  const fallbackSkills = [
    {
      category: 'Machine Learning',
      items: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'Model Development', 'Feature Engineering'],
    },
    {
      category: 'Deep Learning',
      items: ['CNN', 'LSTM', 'GRU', 'Time-Series Forecasting', 'Model Evaluation'],
    },
    {
      category: 'NLP & Text Processing',
      items: ['Roman Urdu', 'Code-Mixed Text', 'Text Normalization', 'Transformers', 'Tokenization'],
    },
    {
      category: 'Programming & Data',
      items: ['Python', 'Pandas', 'NumPy', 'Data Cleaning', 'Visualization'],
    },
    {
      category: 'Web & Automation',
      items: ['React', 'JavaScript', 'APIs', 'Web Scraping', 'Automation Pipelines'],
    },
    {
      category: 'Research & Tools',
      items: ['Experimental Design', 'Academic Writing', 'Git', 'Jupyter', 'Supabase'],
    },
  ]

  const rawSkillGroups = skills?.length ? skills : fallbackSkills

  const skillGroups = rawSkillGroups
    .map((group, idx) => {
      const text = normalizeSkillText(group)
      return {
        key: group?.id || group?.category || group?.title || idx,
        label: getSkillLabel(group),
        text,
      }
    })
    .filter((group) => group.text.trim())

  const normalizedProjects = (projects || []).map(normalizeProject)
  const normalizedCertifications = (certifications || []).map(normalizeCertification)
  const normalizedPublications = (publications || []).map(normalizePublication)

  const topProjects = normalizedProjects.slice(0, 4)
  const topCertifications = normalizedCertifications.slice(0, 4)
  const topPublications = normalizedPublications.slice(0, 4)

  const fullName =
    profile?.fullname ||
    profile?.full_name ||
    profile?.name ||
    profile?.shortname ||
    'Kanwar Muhammad Afaq'

  const roleLine =
    profile?.herotagline ||
    profile?.tagline ||
    profile?.title ||
    'AI Researcher | NLP Engineer | Data Scientist'

  const shortIntro =
    profile?.herosubtitle ||
    profile?.subtitle ||
    profile?.headline ||
    'AI researcher focused on NLP, machine learning, deep learning, and applied data-driven systems.'

  const summaryParagraphs = [
    profile?.bioparagraph1,
    profile?.bioparagraph2,
    profile?.summary,
    profile?.about,
  ].filter(Boolean)

  const summaryText =
    summaryParagraphs.length
      ? summaryParagraphs
      : [
          'Research-oriented AI engineer with experience in natural language processing, code-mixed low-resource language analysis, deep learning, time-series forecasting, and applied data-driven systems.',
          'Skilled in building end-to-end research and engineering workflows spanning experimentation, modeling, automation, and technical communication.',
        ]

  const email =
    profile?.email ||
    profile?.emailaddress ||
    profile?.email_address ||
    ''

  const location =
    profile?.location ||
    profile?.city ||
    profile?.country ||
    ''

  const linkedin =
    profile?.linkedinurl ||
    profile?.linkedin ||
    socials.find((s) => String(s?.platformname || '').toLowerCase().includes('linkedin'))?.profileurl ||
    ''

  const github =
    profile?.githuburl ||
    profile?.github ||
    socials.find((s) => String(s?.platformname || '').toLowerCase().includes('github'))?.profileurl ||
    ''

  const scholar =
    profile?.scholarurl ||
    profile?.google_scholar ||
    socials.find((s) => String(s?.platformname || '').toLowerCase().includes('scholar'))?.profileurl ||
    ''

  const contactLine = [email, location, cleanUrl(linkedin), cleanUrl(github), cleanUrl(scholar)]
    .filter(Boolean)
    .join(' • ')

  const publicationCount = getCount(
    profile,
    ['paperscount', 'publicationscount', 'publication_count', 'papers_count'],
    normalizedPublications.length
  )

  const projectCount = getCount(
    profile,
    ['projectscount', 'projectscount', 'project_count'],
    normalizedProjects.length
  )

  const datasetCount = getCount(
    profile,
    ['datasetscount', 'datasetscount', 'dataset_count', 'datasets_built', 'datasets'],
    0
  )

  const repoCount = getCount(
    profile,
    ['reposcount', 'repo_count', 'repositories', 'github_repos', 'repos'],
    0
  )

  return (
    <div
      id="resume-pdf"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        background: '#ffffff',
        color: '#111827',
        fontFamily: 'Arial, Helvetica, sans-serif',
        padding: '16mm',
        boxSizing: 'border-box',
        lineHeight: 1.35,
      }}
    >
      <div style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '10px', marginBottom: '14px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{fullName}</h1>

        <p style={{ margin: '4px 0 8px', fontSize: '12px', color: '#4b5563', fontWeight: 600 }}>
          {roleLine}
        </p>

        <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#374151', maxWidth: '100%' }}>
          {shortIntro}
        </p>

        {contactLine ? (
          <p style={{ margin: 0, fontSize: '11px', color: '#4b5563' }}>{contactLine}</p>
        ) : null}
      </div>

      <section style={{ marginBottom: '14px' }}>
        <h2 style={sectionTitle}>Professional Summary</h2>
        {summaryText.map((para, idx) => (
          <p key={idx} style={bodyText}>
            {para}
          </p>
        ))}
      </section>

      <section style={{ marginBottom: '14px' }}>
        <h2 style={sectionTitle}>Technical Skills</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
          {skillGroups.map((group) => (
            <div key={group.key} style={{ fontSize: '11px' }}>
              <span style={{ fontWeight: 700 }}>{group.label}:</span> <span>{group.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '14px' }}>
        <h2 style={sectionTitle}>Selected Projects</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {topProjects.map((project) => (
            <div key={project.id}>
              <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 700 }}>{project.title}</h3>

              {project.category ? (
                <p style={{ margin: '2px 0 0', fontSize: '10.5px', color: '#4b5563' }}>
                  <strong>Focus:</strong> {project.category}
                </p>
              ) : null}

              {project.desc ? (
                <p style={{ ...bodyText, marginTop: '2px' }}>{project.desc}</p>
              ) : null}

              {project.tags?.length ? (
                <p style={{ margin: '2px 0 0', fontSize: '10.5px', color: '#4b5563' }}>
                  <strong>Tech:</strong> {project.tags.slice(0, 6).join(', ')}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '14px' }}>
        <section>
          <h2 style={sectionTitle}>Certifications</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {topCertifications.map((cert) => (
              <div key={cert.id}>
                <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 700 }}>{cert.title}</h3>

                <p style={{ margin: '2px 0 0', fontSize: '10.5px', color: '#4b5563' }}>
                  {[cert.issuer, formatDate(cert.date)].filter(Boolean).join(' • ')}
                </p>

                {cert.skills?.length ? (
                  <p style={{ margin: '2px 0 0', fontSize: '10.5px', color: '#4b5563' }}>
                    {cert.skills.slice(0, 6).join(', ')}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>Publications</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {topPublications.map((paper) => (
              <div key={paper.id}>
                <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 700 }}>{paper.title}</h3>

                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '10.5px',
                    color: '#4b5563',
                    wordBreak: 'break-word',
                  }}
                >
                  {[paper.authors, paper.journal, paper.year].filter(Boolean).join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 style={sectionTitle}>Highlights</h2>
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '11px' }}>
          <div><strong>{publicationCount}</strong> Publications</div>
          <div><strong>{projectCount}</strong> Projects</div>
          <div><strong>{datasetCount}</strong> Datasets</div>
          <div><strong>{repoCount}</strong> Repositories</div>
        </div>
      </section>
    </div>
  )
}

const sectionTitle = {
  margin: '0 0 8px',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: '#111827',
}

const bodyText = {
  margin: '0 0 4px',
  fontSize: '11px',
  color: '#374151',
}