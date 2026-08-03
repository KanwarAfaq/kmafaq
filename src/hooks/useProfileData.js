import { useEffect, useState } from 'react';
import { getProfileSettings, getProfileTimeline } from '../lib/profileApi';

export const fallbackProfile = {
  full_name: 'Kanwar Muhammad Afaq',
  short_name: 'K.M. AFAQ',
  hero_tagline: 'AI Researcher, NLP Engineer, Data Scientist, Python Developer',
  hero_subtitle: 'Researching NLP for code-mixed Roman Urdu text and air quality forecasting with deep learning.',
  about_title: 'About Me',
  about_subtitle: 'AI Researcher · NLP Engineer · Data Scientist',
  about_badge: 'AI Researcher',
  bio_paragraph_1: 'I am an AI researcher focused on Natural Language Processing for low-resource code-mixed languages, specifically Roman Urdu-English text normalization for downstream NLP tasks.',
  bio_paragraph_2: 'On the applied side, I build deep learning models for air quality forecasting using CNN, LSTM, and GRU architectures on real-time environmental sensor time-series data.',
  bio_paragraph_3: 'I also build practical Python tools, scraping pipelines, automation systems, and web applications that bridge academic research and real-world deployment.',
  profile_image_url: 'https://raw.githubusercontent.com/KanwarAfaq/kmafaq/refs/heads/main/src/images/afaqprofile.jpeg',
  about_image_url: 'https://raw.githubusercontent.com/KanwarAfaq/kmafaq/refs/heads/main/src/images/afaqprofile.jpeg',
  cv_url: '',
  email: 'kmafaq786@email.com',
  location: 'Taoyuan, Taiwan',
  github_url: 'https://github.com/KanwarAfaq',
  linkedin_url: 'https://linkedin.com/in/kanwarafaq',
  scholar_url: '',
  kaggle_url: '',
  papers_count: 5,
  projects_count: 10,
  datasets_count: 8,
  repos_count: 20,
  formspree_endpoint: 'https://formspree.io/f/mbdegovd',
};

export function useProfileData() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [profileData, timelineData] = await Promise.all([
          getProfileSettings().catch(() => null),
          getProfileTimeline().catch(() => []),
        ]);
        if (profileData) setProfile((prev) => ({ ...prev, ...profileData }));
        setTimeline(Array.isArray(timelineData) ? timelineData : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { profile, timeline, loading };
}
