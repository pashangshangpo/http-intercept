const localKey = '$http-intercept-url'

export const getUrl = () => {
  return JSON.parse(localStorage.getItem(localKey)) || {}
}

export const replaceQuery = (url) => {
  const { origin, pathname } = new URL(url)

  return origin + pathname
}

export const setUrl = (key, value) => {
  localStorage.setItem(localKey, JSON.stringify({
    ...getUrl(),
    [key]: replaceQuery(value)
  }))
}

export const resetUrl = () => {
  localStorage.removeItem(localKey)
}

export const getRedirectUrl = (url) => {
  return getUrl()[replaceQuery(url)] || replaceQuery(url)
}
