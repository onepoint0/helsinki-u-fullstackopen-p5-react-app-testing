const { test, expect, beforeEach, describe } = require('@playwright/test')
import exp from 'constants'
import { createBlog, getLoginForm, login, logout, createBlogAndView,likeBlog } from './helper'

const user1 = {
    username: 'testuser',
    name:     'test user',
    password: 'password'
}

const user2 = {
    username: 'anotheruser',
    name:     'another test user',
    password: 'password2'
}

const testBlog1 = {
    title:  'A test blog',
    author: 'test author',
    url:    'http://testurl.com'
}

const testBlog2 = {
    title:  'A second test blog',
    author: 'second test author',
    url:    'http://secondtesturl.com'
}

// const blogListing1 = `${testBlog1.title}\s+${testBlog1.author}`
const blogListing1 = new RegExp(`^${testBlog1.title}\\s+${testBlog1.author}`);
const blogListing2 = new RegExp(`^${testBlog2.title}\\s+${testBlog2.author}`);

describe('Blog app', () => {
    beforeEach(async({ page, request })=> {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', { data: user1 })
        await request.post('http://localhost:3001/api/users', { data: user2 })

        await page.goto('/')
    })
    test('login form is shown',async ({ page }) => {
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
            
            await login(page,user1.username,user1.password)
            await expect(page.getByTestId('notification')).toHaveText(`${user1.username} logged in`)
        })
        
        test('fails with incorrect credentials', async({ page }) => {
            // await page.getByTestId('username').fill(user.username)
            // await page.getByTestId('password').fill('wrongpassword')
            // await page.getByTestId('login-button').click()
            await login(page,user1.username,'wrongpassword')
            await expect(page.getByTestId('notification')).toHaveText(`Invalid username or password`)
        })
    })
        
    describe('when logged in ', () => {
        beforeEach(async ({ page }) => {
            await login(page,user1.username,user1.password)
        })

        test('a new blog can be created ', async({ page }) => {
            const blog = await createBlog( page, testBlog1.title, testBlog1.author, testBlog1.url)

            const text = `${testBlog1.title}\n${testBlog1.author}`
            await expect(blog).toContainText(text)
        })
        test('a new blog can be liked',async ({ page })=> {

            await createBlogAndView(page, testBlog1)

            // const likeButton = await page.getByText('like')
            const likeButton = await page.getByRole('button',{name: 'like'})

            await likeButton.click()

            const likes = await likeButton.locator('..')
            await expect(likes).toContainText(/^1\s+like/)

        })
        test('a blog post can be removed', async({ page }) => {
            await createBlogAndView(page,testBlog1)

            const blogThere = await page.getByText(blogListing1)
            await expect(blogThere).toBeVisible()

            page.on('dialog', dialog => dialog.accept());

            await page.getByText('Remove').click()

            const blogGone = await page.getByText(blogListing1)
            await expect(blogGone).not.toBeVisible()
        })
        test('delete button is only visible to the user who added the blog', async ({ page }) => {
            await createBlogAndView(page,testBlog1)

            let removeButton = page.getByRole('button',{name: 'Remove'})
            expect(removeButton).toBeVisible()

            await logout(page)
            await login(page,user2.username, user2.password)

            await expect(page.getByTestId('notification')).toHaveText(`${user2.username} logged in`)

            const blog = await page.getByText(blogListing1)
            await expect(blog).toContainText(testBlog1.title)

            await page.getByRole('button',{name: 'View'}).click()

            // first make sure the view has opened successfully
            await expect(blog).toContainText('Hide')

            removeButton = page.getByRole('button',{name: 'Remove'})

            await expect(removeButton).not.toBeVisible()
            
        })
        test.only('blogs are rearranged in descending order by number of likes', async ({ page }) =>{
            const blog1 = await createBlogAndView(page,testBlog1)
            const blog2 = await createBlogAndView(page,testBlog2)

            let likeButtons = await page.getByRole('button',{name: 'like'}).all()
            await likeButtons[1].click()

            const first = await page.locator('.blog').first()
            const last =  await page.locator('.blog').last()
            await expect(first).toContainText(blogListing2)
            await expect(last).toContainText(blogListing1)

            await likeBlog(page,1,1)
            await likeBlog(page,1,1)

            // likeButtons = await page.getByRole('button',{name: 'like'}).all()
            // await likeButtons[1].click()
            // likeButtons = await page.getByRole('button',{name: 'like'}).all()
            // await likeButtons[1].click()

            // await expect(first).toContainText(blogListing1)

            // const 
            // await expect()

            // const blog2LikeButton = await page.getByRole('button',{name: 'like'})
            // await blog2LikeButton.click()

            // // blog 2 should be first - this is baseline as we don't assume they are in the order they are created, altho they prob are!
            // let first = await page.locator('.blog').first()
            // console.log('first = ',first)
            // await expect(first).toContainText(blogListing2)

            // // now blog 2 has one like, so to become first, blog 1 needs 2 x likes
            // await blog1.getByRole('button',{name:'View'})
            // const blog1LikeButton = await blog1.getByRole('button',{name: 'like'})
            // blog1LikeButton.click()
            // blog1LikeButton.click() 

            // first = await page.locator('.blog').first()

            // await expect(first).toContainText(blogListing1)
            // blogs[0].getByText(blogListing1)
            
            // first = await page.locator('.blog').first()
            // await expect(first).toContainText(blogListing1)

        })
    })
})