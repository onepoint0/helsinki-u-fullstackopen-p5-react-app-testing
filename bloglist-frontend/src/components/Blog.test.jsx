import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

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
  return container
}
/*
test('Blog renders title and author but not likes or url by default ',() => {

  const newBlog = {
    id: 12345,
    title: 'testing blog title',
    author: 'testing author',
    url: 'testing url',
    likes: 'testing likes ',
  }
  const username = 'testing user'

  const handleLike = vi.fn()
  const handleRemove = vi.fn()

  const { container } = render(<Blog blog={newBlog} handleLike={handleLike} remove={handleRemove} username={username} />)

  const blog = container.querySelector('.blog')

  expect(blog).toHaveTextContent(`${newBlog.title} ${newBlog.author}`)
  expect(blog).not.toHaveTextContent(newBlog.url)
  expect(blog).not.toHaveTextContent(newBlog.likes)
})
*/
test('Blog\'s URL and number of likes are shown when the \'view\' button is clicked',async () => {
/*
  const newBlog = {
    id: 12345,
    title: 'testing blog title',
    author: 'testing author',
    url: 'testing url',
    likes: 'testing likes ',
  }
  const username = 'testing user'

  const handleLike = vi.fn()
  const handleRemove = vi.fn()

  // const clickHandler = vi.fn()

  const { container } = render(<Blog blog={newBlog} handleLike={handleLike} remove={handleRemove} username={username} />)
*/
  const container =  createBlog(newBlog,username)

  let blog = container.querySelector('.blog')
    
  expect(blog).not.toHaveTextContent(newBlog.url)

  // const viewButton = container.querySelector('.viewBlogButton')
  const viewButton = screen.getByText('View')
  // console.log(viewButton)

  const user = userEvent.setup()

  const click = await user.click(viewButton)

  // console.log(click)
  screen.debug(viewButton)
  screen.debug(blog)

  // blog = container.querySelector('.blog')
  // expect(blog).toHaveTextContent(newBlog.url)

})