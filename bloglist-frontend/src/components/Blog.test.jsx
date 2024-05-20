import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import CreateBlog from './CreateBlog'

const newBlog = {
  id: 12345,
  title: 'testing blog title',
  author: 'testing author',
  url: 'testing url',
  likes: 'testing likes ',
  user: {
    name: 'testing user'
  }
}
const username = 'testing user'

const createBlog = (newBlog,username) => {

  const handleLike = vi.fn()
  const handleRemove = vi.fn()
  const { container } = render(<Blog blog={newBlog} handleLike={handleLike} remove={handleRemove} username={username} />)
  return { container, handleLike, handleRemove }
}

test('Blog renders title and author but not likes or url by default ',() => {

  const { container } =  createBlog(newBlog,username)

  expect(container).toHaveTextContent(`${newBlog.title} ${newBlog.author}`)
  expect(container).not.toHaveTextContent(newBlog.url)
  expect(container).not.toHaveTextContent(newBlog.likes)
})

test('Blog\'s URL and number of likes are shown when the \'view\' button is clicked',async () => {

  const { container } =  createBlog(newBlog,username)

  const viewButton = screen.getByText('View')

  const user = userEvent.setup()

  await user.click(viewButton)

  expect(viewButton).toHaveTextContent('Hide')
  expect(container).toHaveTextContent(newBlog.url)
  expect(container).toHaveTextContent(newBlog.likes)

})

test('If the like button is clicked twice, its event handler is called twice',async () => {

  const { container, handleLike } =  createBlog(newBlog,username)

  const viewButton = screen.getByText('View')

  const user = userEvent.setup()

  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLike.mock.calls).toHaveLength(2)
})

test('Form submits correct details when creating a new blog ', async() => {
  const handleAddBlog = vi.fn()
  const notification = vi.fn()
  render(<CreateBlog addBlog={handleAddBlog} notification={notification} />)

  const user = userEvent.setup()

  const titleInput = screen.getByTestId('testBlogTitle')
  await user.type(titleInput, newBlog.title)

  const authorInput = screen.getByTestId('testBlogAuthor')
  await user.type(authorInput, newBlog.author)

  const urlInput = screen.getByTestId('testBlogUrl')
  await user.type(urlInput, newBlog.url)

  const createButton = screen.getByTestId('createButton')
  await user.click(createButton)

  expect(handleAddBlog.mock.calls).toHaveLength(1)

  expect(handleAddBlog.mock.calls[0][0].title).toBe(newBlog.title)
  expect(handleAddBlog.mock.calls[0][0].author).toBe(newBlog.author)
  expect(handleAddBlog.mock.calls[0][0].url).toBe(newBlog.url)
})