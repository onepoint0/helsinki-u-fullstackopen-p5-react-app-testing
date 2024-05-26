import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog,handleLike,username,remove }) => {
  const [showDetails,setShowDetails] = useState(false)
  console.log('blog object ',blog)

  const handleRemove = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      remove(blog.id)
    }
  }
  const BlogDetails = () => {
    return (
      <>
        <div>{blog.url}</div>
        <div>{blog.likes} &nbsp; <button onClick={() => handleLike(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === username && <button className='remove' onClick={handleRemove}>Remove</button>}
      </>
    )

  }

  return (
    <div data-testid='testBlogList' className='blog-list'>
      <div className="blog-row">
        <div className='blog'>{blog.title} {blog.author} &nbsp; <button className='viewBlogButton' onClick={() => setShowDetails(!showDetails)}> {showDetails ? 'Hide' : 'View'}</button></div>
        {showDetails && <BlogDetails />}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired
}

export default Blog