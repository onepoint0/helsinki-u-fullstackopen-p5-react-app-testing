const { test, expect, beforeEach, describe } = require('@playwright/test')
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

const createBlog1 = async ( page, blog ) => {
  // this button is in toggle and changes its functionality, don't use a testid here or you'll get bugs
  const addBlog = await page.getByRole('button',{name: 'add blog'}) 
  console.log('expecting add blog button tbv')
console.log('type ',typeof(addBlog))
  await expect(addBlog).toBeVisible()
  await addBlog.click()
  const title = await page.getByTestId('testBlogTitle')

  console.log('expecting title tbv')
  await expect(title).toBeVisible()
  await title.fill(blog.title)
  // await page.getByTestId('testBlogTitle').fill(blog.title)
  await page.getByTestId('testBlogAuthor').fill(blog.author)
  await page.getByTestId('testBlogUrl').fill(blog.url)
  await page.getByTestId('createButton').click()

  const newBlog = await page.locator(`text=${blog.title}\n${blog.author}`) 

  return newBlog
}


const createBlog = async ( page, blog ) => {
  // this button is in toggle and changes its functionality (switches between add blog and cancel in Toggle component)
  // don't use a testid here or you'll get bugs
  await page.getByRole('button',{name: 'add blog'}).click() 
  await page.getByTestId('testBlogTitle').fill(blog.title)
  await page.getByTestId('testBlogAuthor').fill(blog.author)
  await page.getByTestId('testBlogUrl').fill(blog.url)
  await page.getByTestId('createButton').click()

  const newBlog = await page.locator(`text=${blog.title}\n${blog.author}`).waitFor()

  return newBlog
}

const likeBlog = async ( page, order, expected ) => {
  const likeButtons = await page.getByRole('button',{name: 'like'}).all()
  await likeButtons[order].click()

  const numLikes = await likeButtons[order].locator('..')

  const likes = new RegExp(`/^${expected}\s+like/`)
  // const blogListing2 = new RegExp(`^${testBlog2.title}\\s+${testBlog2.author}`);

  await expect(numLikes).toContainText(likes)

}

const createBlogAndView = async( page,blog) => {
  const newBlog = await createBlog( page, blog )
  const view = await newBlog.getByText('View').waitFor()
  await view.click()
  
  return newBlog
}

const getChildButtonFromBlog = async (page,blog,buttonLabel) => {
  const newBlog = await createBlogAndView(page,blog)
  const button = await page.getByRole('button', {name: buttonLabel})
  return button
}

export { getLoginForm, login, createBlog, createBlogAndView, logout, getChildButtonFromBlog, likeBlog }