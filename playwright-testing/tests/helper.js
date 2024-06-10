const { expect } = require('@playwright/test')

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

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

const createBlog = async ( page, blog ) => {
  // this button is in toggle and changes its functionality (switches between add blog and cancel in Toggle component)
  // don't use a testid here or you'll get bugs

  await page.getByRole('button',{name: 'add blog'}).click() 
  await page.getByTestId('testBlogTitle').fill(blog.title)
  await page.getByTestId('testBlogAuthor').fill(blog.author)
  await page.getByTestId('testBlogUrl').fill(blog.url)
  await page.getByTestId('createButton').click()

  return page.getByText(`${blog.title} ${blog.author}`)

}

const createBlogAndView = async( page,blog) => {
  const newBlog = await createBlog( page, blog )
  const view = await newBlog.getByText('View')
  await view.click()
  
  return newBlog
}

const likeBlog = async ( likeButton, initialLikes ) => {
  await likeButton.click()
  // I think these likes are clobbering each other when I click two in a row so wait til they resolve before doing another like
  await expect(likeButton.locator('..')).toContainText(`${initialLikes + 1} like`)

}

export { getLoginForm, login, createBlog, createBlogAndView, logout, likeBlog }