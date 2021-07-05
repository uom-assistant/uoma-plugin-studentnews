export type languageListItem = {
  iso: string,
  timeFormat: (yr: string, mo: string, da: string) => string,
  strings: {
    readonly [index: string]: string
  }
}

export type languageList = {
  [index: string]: languageListItem
}
