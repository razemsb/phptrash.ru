export interface Tech {
  id: string
  name: string
  icon: string[]
  color: string
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  link: string
  techs: string[]
}

export interface ContactLink {
  id: string
  label: string
  href: string
  icon: string[]
}
