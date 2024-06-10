const { test, expect, beforeEach, describe } = require('@playwright/test')
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

test.describe.configure({ mode: 'serial' });

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
            await login(page,user1.username,user1.password)
            await expect(page.getByTestId('notification')).toHaveText(`${user1.username} logged in`)
        })
        
        test('fails with incorrect credentials', async({ page }) => {
            await login(page,user1.username,'wrongpassword')
            await expect(page.getByTestId('notification')).toHaveText(`Invalid username or password`)
        })
    })
        
    describe('when logged in ', () => {
        beforeEach(async ({ page }) => {
            await login(page,user1.username,user1.password)
        })

        test('a new blog can be created ', async({ page }) => {
            const blog = await createBlog( page, testBlog1)

            await expect(blog).toBeVisible()
        })
        test('a new blog can be liked',async ({ page })=> {

            await createBlogAndView(page, testBlog1)

            const likeButton = await page.getByRole('button',{name: 'like'})

            await likeBlog(likeButton,0)

            const likes = await likeButton.locator('..')
            await expect(likes).toContainText(/^1\s+like/)

        })
        test('a blog post can be removed by the user who created it', async({ page }) => {
            await createBlogAndView(page,testBlog1)

            const blogThere = await page.getByText(`${testBlog1.title} ${testBlog1.author}`)
            await expect(blogThere).toBeVisible()

            page.on('dialog', dialog => dialog.accept());

            await page.getByText('Remove').click()

            const blogGone = await page.getByText(`${testBlog1.title} ${testBlog1.author}`)
            await expect(blogGone).not.toBeVisible()
        })
        test('delete button is only visible to the user who added the blog', async ({ page }) => {
            await createBlogAndView(page,testBlog1)

            let removeButton = page.getByRole('button',{name: 'Remove'})
            expect(removeButton).toBeVisible()

            await logout(page)
            await login(page,user2.username, user2.password)

            await expect(page.getByTestId('notification')).toHaveText(`${user2.username} logged in`)

            const blog = await page.getByText(`${testBlog1.title} ${testBlog1.author}`)
            await expect(blog).toContainText(testBlog1.title)

            await page.getByRole('button',{name: 'View'}).click()

            // first make sure the view has opened successfully
            await expect(blog).toContainText('Hide')

            removeButton = await page.getByRole('button',{name: 'Remove'})

            await expect(removeButton).not.toBeVisible()
            
        })
        test('blogs are rearranged in descending order by number of likes', async ({ page }) =>{
            const blog1 = await createBlogAndView(page,testBlog1)
            const blog2 = await createBlogAndView(page,testBlog2)

            const blogs = await page.locator('.blog').all()

            const blog1LikeButton = blog1.locator('..').getByRole('button',{name: 'like'})
            await expect(blog1LikeButton).toBeVisible()

            const blog2LikeButton = blog2.locator('..').getByRole('button',{name: 'like'})
            await expect(blog2LikeButton).toBeVisible()

            console.log('like b2 ')
            await likeBlog(blog2LikeButton,0)

            // blog 2 should be at top
            await expect(blogs[0]).toContainText(`${testBlog2.title} ${testBlog2.author}`)

            // change order to blog 1 first and test in case initial order was a fluke
            await likeBlog(blog1LikeButton,0)
            await likeBlog(blog1LikeButton,1)

            // blog 1 should be at top
            await expect(blogs[0]).toContainText(`${testBlog1.title} ${testBlog1.author}`)
        })

    })
})