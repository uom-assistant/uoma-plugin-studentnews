export type tag = {
  name: string,
  link: string
}

export type author = {
  name: string,
  link: string,
  description: string,
  cleanedDescription?: string,
  avatar: string
}

export type featuredImage = {
  src: string,
  caption: string,
}

export type postPreview = {
  title: string,
  img: string,
  href: string,
  date: string,
}

export type post = {
  id: number,
  title: string,
  href: string,
  link: string,
  img: featuredImage,
  date: string,
  content: string,
  authors: author[],
  tags: tag[]
}
