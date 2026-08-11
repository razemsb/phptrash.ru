export type HubProject = {
  id: string
  title: string
  slug: string
  status: 'live' | 'wip' | 'soon'
  blurb: string
  tags: string[]
  /** Path on subdomain (`/slug/`) or absolute URL */
  path: string
}

export const projects: HubProject[] = [
  {
    id: 'devguide',
    title: 'DevGuide',
    slug: 'devguide',
    status: 'live',
    blurb: 'Справочник для разработчиков: статьи, примеры кода, полезные ссылки.',
    tags: ['Vue 3', 'PHP', 'Rest API', 'JS', 'CSS'],
    path: '/devguide/',
  },
]
