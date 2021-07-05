export type tag = {
  name: string,
  link: string
}

export type post = {
  title: string,
  href: string,
  img: string,
  date: string,
  content: string,
  tags: tag[]
}
