import { IconType } from 'react-icons'
import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from 'react-icons/lu'

export type FooterLink = {
  title: string
  items: {
    name: string
    link?: string
    icon?: IconType
  }[]
}

export type LandingPage = {
  name: string
  link: string
}

export const footerLinks: FooterLink[] = [
  {
    title: 'Company',
    items: [
      {
        name: 'About',
      },
      {
        name: 'Services',
      },
      {
        name: 'Portfolio',
      },
      {
        name: 'Blog',
      },
      {
        name: 'Contact',
      },
    ],
  },
  {
    title: 'Social Media',
    items: [
      {
        name: 'Facebook',
        icon: LuFacebook,
      },
      {
        name: 'Instagram',
        icon: LuInstagram,
      },
      {
        name: 'Twitter',
        icon: LuTwitter,
      },
      {
        name: 'Linkedin',
        icon: LuLinkedin,
      },
    ],
  },
  {
    title: 'Legal & Press',
    items: [
      {
        name: 'Privacy Policy',
      },
      {
        name: 'Terms & Conditions',
      },
      {
        name: 'Presskit',
      },
    ],
  },
]

export const landingPages: LandingPage[] = [
  {
    name: 'Agency',
    link: '/landing/agency',
  },
  {
    name: 'Agency Two',
    link: '/landing/agency-2',
  },
  {
    name: 'Charity',
    link: '/landing/charity',
  },
  {
    name: 'Company',
    link: '/landing/company',
  },
  {
    name: 'Creative',
    link: '/landing/creative',
  },
  {
    name: 'Ebook',
    link: '/landing/ebook',
  },
  {
    name: 'Finance',
    link: '/landing/finance',
  },
  {
    name: 'Hosting',
    link: '/landing/hosting',
  },
  {
    name: 'Marketing',
    link: '/landing/marketing',
  },
  {
    name: 'Marketing 2',
    link: '/landing/marketing-2',
  },
  {
    name: 'Marketing 3',
    link: '/landing/marketing-3',
  },
  {
    name: 'Photography',
    link: '/landing/photography',
  },
  {
    name: 'Portfolio',
    link: '/landing/portfolio',
  },
  {
    name: 'Portfolio 2',
    link: '/landing/portfolio-2',
  },
  {
    name: 'Startup',
    link: '/landing/startup',
  },
  {
    name: "Web Designer",
    link: "/landing/web-designer"
  }
]
