import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'DevGuide',
    title: 'DevGuide',
    description: 'Справочник для разработчиков: статьи, примеры кода, полезные ссылки.',
    longDescription:
      'Справочник для разработчиков: статьи, примеры кода, полезные ссылки. Собирал как учебный e-commerce на Vue — без лишней магии, зато с понятной структурой компонентов.',
    image: '/projects/devguide.svg',
    link: 'https://dev-guide.ru',
    techs: ['Vue 3', 'PHP', 'Rest API', 'JS', 'CSS'],
  },
  {
    id: 'gamehub',
    title: 'GAMEHUB',
    description: 'Витрина цифровых ключей: фильтры, корзина, нормальный мобильный UX.',
    longDescription:
      'Каталог игр с быстрыми фильтрами и корзиной. Собирал как учебный e-commerce на Vue — без лишней магии, зато с понятной структурой компонентов.',
    image: '/projects/gamehub.svg',
    link: 'https://github.com/razemsb/gamehub',
    techs: ['Vue 3', 'JS', 'CSS'],
  },
  {
    id: 'filemanager',
    title: 'FileManager',
    description: 'Файловый менеджер под локальный стек — XAMPP/MAMP без боли.',
    longDescription:
      'Обход папок, предпросмотр и базовые операции с файлами прямо в браузере. Утилита для себя, когда надо быстро ковырять проект на локалке.',
    image: '/projects/filemanager.svg',
    link: 'https://github.com/razemsb/FileManager',
    techs: ['PHP', 'HTML', 'CSS'],
  },
  {
    id: 'image-convertor',
    title: 'ImageConvertor',
    description: 'Пакетная конвертация в WebP/AVIF — меньше вес, тот же вид.',
    longDescription:
      'Сервис под конвертацию картинок в современные форматы. Цель простая: быстрее грузить страницы без ручной возни в Photoshop.',
    image: '/projects/convertor.svg',
    link: 'https://github.com/razemsb/ImageConvertor',
    techs: ['PHP', 'Laravel'],
  }
]
