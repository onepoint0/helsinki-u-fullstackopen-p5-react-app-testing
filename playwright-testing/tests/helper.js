const getLoginForm = async (page) => {
  const username = await page.getByTestId('username')
  const password = await page.getByTestId('password')
  const loginButton = await page.getByTestId('login-button')

  return { username,password,loginButton }
}

const login = async (page,username,password) => {
  const loginForm = await getLoginForm(page)
  await loginForm.username.fill(username)
  await loginForm.password.fill(password)
  await loginForm.loginButton.click()
}

export { getLoginForm, login }