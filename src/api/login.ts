export const login = async (
  ip: string,
  port: number,
  authKey: string
): Promise<boolean> => {
  // TODO: Implement actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Store connection details if successful
      if (authKey === 'admin123') {
        localStorage.setItem('isAuthorized', 'true')
        localStorage.setItem('connection', JSON.stringify({ ip, port }))
        resolve(true)
      } else {
        resolve(false)
      }
    }, 1000)
  })
}

export const isAuthorized = (): boolean => {
  return localStorage.getItem('isAuthorized') === 'true'
}

export const logout = (): void => {
  localStorage.removeItem('isAuthorized')
}
