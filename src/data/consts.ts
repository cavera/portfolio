import { Brands } from '@/components/Icons/Brands'
import { Mail } from 'iconoir-react'

export const ROL = 'Front-end developer'
export const ALSO = 'UI designer'

export const CAVERA = {
  name: 'Leonardo Fonseca',
  nick: 'cavera',
  about_image: 'https://res.cloudinary.com/dwrxp5sqk/image/upload/v1715440642/cavera/profile_rm.jpg',
  twitter: '@cavera_de',
  portfolio: {
    url: 'https://portfolio-cavera.vercel.app/',
    name: `${ROL} (${ALSO} too)`,
    description: "Leonardo Fonseca's Portfolio",
  },
  links: [
    {
      icon: Brands.github,
      link: 'https://github.com/cavera',
    },
    {
      icon: Brands.behance,
      link: 'https://behance.net/cavera',
    },
    {
      icon: Brands.linkedin,
      link: 'https://linkedin.com/in/leonardo-ui/',
    },
    {
      icon: Brands.codepen,
      link: 'https://codepen.io/cavera',
    },
    {
      icon: Brands['500px'],
      link: 'https://500px.com/p/LeonardoFonseca',
    },
    {
      icon: Mail,
      link: 'mailto:cavera.de@gmail.com',
    },
  ],
}

export const siteLanguage = 'en_US'
export const siteType = 'website'
export const siteKeywords = ['Next.js', 'React', 'JavaScript', 'Figma', 'UI Design', 'Front-end', 'Frontend', 'Graphic Design', 'e-learning', 'CSS', 'Portfolio', 'Eficacia', 'lider', 'developer', 'freelancer', 'remote', 'TypeScript', 'Git', 'Ready', '1500', 'IA', 'AI', 'C1,TI', 'Maquetación', 'From idea to solution', 'Portafolio', 'Asesoría', 'Soporte SAP', 'Sudáfrica', 'Colombia', 'India', 'Perú', 'España', 'Certified', 'Tech', 'tech', 'TECH', 'TIC', 'UI Designer', 'Visual Studio Code', 'UI', 'Design,Tecnología']
export const siteColorScheme = 'normal'

export const CV_BLOCK_ID = '53f20ffa-1d72-4bf9-b9f6-81efbe1f8aa3'

export const DEFAULT_PROJECT_BG = '/images/default_bg.jpg'

export const CV_URL = CAVERA.portfolio.url + 'cv/FrontEnd_Leonardo_Fonseca.pdf'

export const TITLES = {
  ABOUT: 'About',
  CONTACT: 'Contact',
  PORTFOLIO: 'Projects',
}
