import { useState } from 'react'

const CreateBlog = ({addBlog,notification}) => {
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')  
  
  const handleAddBlog = (e) => {
    e.preventDefault()

    addBlog({title,author,url})

    notification(`A new blog "${title}" by "${author}" added`,'success')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleAddBlog}>
      <label htmlFor='newBlogTitle'>title</label>
      <input id='newBlogTitle' onChange={(e) => setTitle(e.target.value)} value={title}/><br/>
      <label htmlFor='newBlogAuthor'>author</label>
      <input id='newBlogAuthor' onChange={(e) => setAuthor(e.target.value)} value={author}/><br/>
      <label htmlFor='newBlogURL'>url</label>
      <input id='newBlogURL' onChange={(e) => setUrl(e.target.value)} value={url}/><br/>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlog