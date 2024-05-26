const { test, expect, beforeEach, describe } = require('@playwright/test')
import { getLoginForm, login } from './helper'

const user = {
    username: 'testuser',
    name:     'test user',
    password: 'password'
}

const testBlog = {
    title:  'A test blog',
    author: 'test user',
    url:    'http://testurl.com'
}

describe('Blog app', () => {
    beforeEach(async({ page, request })=> {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', { data: user })

        await page.goto('/')
    })
    test('login form is shown',async ({ page }) => {
        // await expect(page.getByTestId('username')).toBeVisible()
        // await expect(page.getByTestId('password')).toBeVisible()
        // await expect(page.getByTestId('login-button')).toBeVisible()
        const form = await getLoginForm(page);
        await expect(form.username).toBeVisible()
        await expect(form.password).toBeVisible()
        await expect(form.loginButton).toBeVisible()
    })

    describe('login', () => {

        test('succeeds with correct credentials', async({ page }) => {
            // await page.getByTestId('username').fill(user.username)
            // await page.getByTestId('password').fill('password')
            // await page.getByTestId('login-button').click()
            
            await login(page,user.username,user.password)
            await expect(page.getByTestId('notification')).toHaveText(`${user.username} logged in`)
        })
        
        test('fails with incorrect credentials', async({ page }) => {
            // await page.getByTestId('username').fill(user.username)
            // await page.getByTestId('password').fill('wrongpassword')
            // await page.getByTestId('login-button').click()
            await login(page,user.username,'wrongpassword')
            await expect(page.getByTestId('notification')).toHaveText(`Invalid username or password`)
        })
    })
        
    describe('when logged in ', () => {
        beforeEach(async ({ page }) => {
            await login(page,user.username,user.password)
        })

        test('a new blog can be created ', async({ page }) => {
            await page.getByTestId('addBlogButton').click()
            await page.getByTestId('testBlogTitle').fill(testBlog.title)
            await page.getByTestId('testBlogAuthor').fill(testBlog.author)
            await page.getByTestId('testBlogUrl').fill(testBlog.url)
            await page.getByTestId('createButton').click()

            expect(page.getByTestId('testBlogList')).toContainText(`${testBlog.title} ${testBlog.author}`)
        })
    })
})