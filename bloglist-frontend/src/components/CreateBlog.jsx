import { useState } from 'react'

const CreateBlog = ({ addBlog,notification }) => {
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')

  const handleAddBlog = (e) => {
    e.preventDefault()

    addBlog({ title,author,url })

    notification(`A new blog "${title}" by "${author}" added`,'success')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleAddBlog}>
      <div className='row'><label htmlFor='newBlogTitle'>title</label>
        <input data-testid='testBlogTitle' id='newBlogTitle' onChange={({ target }) => setTitle(target.value)} value={title}/>
      </div>
      <div className='row'><label htmlFor='newBlogAuthor'>author</label>
        <input data-testid='testBlogAuthor' id='newBlogAuthor' onChange={({ target }) => setAuthor(target.value)} value={author}/>
      </div>
      <div className='row'><label htmlFor='newBlogURL'>url</label>
        <input data-testid='testBlogUrl' id='newBlogURL' onChange={({ target }) => setUrl(target.value)} value={url}/>
      </div>
      <div className='row'><button data-testid='createButton' type="submit">create</button></div>
    </form>
  )
}

export default CreateBlog