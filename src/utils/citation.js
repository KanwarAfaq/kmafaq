export const generateBibtex = (paper) => {
  return `@article{${paper.slug},
  author = {${paper.authors}},
  title = {${paper.title}},
  journal = {${paper.journal}},
  year = {${paper.year}},
  url = {${paper.url}}
}`
};