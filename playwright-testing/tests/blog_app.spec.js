const { test, expect, beforeEach, describe } = require('@playwright/test')

const user = {
    username: 'testuser',
    name:     'test user',
    password: 'password'
}

describe('Blog app', () => {
    beforeEach(async({ page, request })=> {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', { data: user })
        
        page.goto('/')
    })
    test('login form is shown',async ({ page }) => {
        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
        await expect(page.getByTestId('login-button')).toBeVisible()

    })

    test('login with correct username and password is successful', async({ page }) => {
        await page.getByTestId('username').fill(user.username)
        await page.getByTestId('password').fill('password')
        await page.getByTestId('login-button').click()

        await expect(page.getByTestId('notification')).toHaveText(`${user.username} logged in`)
    })

    test('login with incorrect username and password fails', async({ page }) => {
        await page.getByTestId('username').fill(user.username)
        await page.getByTestId('password').fill('wrongpassword')
        await page.getByTestId('login-button').click()

        await expect(page.getByTestId('notification')).toHaveText(`Invalid username or password`)
    })
})