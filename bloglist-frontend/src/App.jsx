import { useState, useEffect,useRef } from 'react'
import Blog from './components/Blog'
import Toggle from './components/Toggle'
import CreateBlog from './components/CreateBlog'
import Login from './components/Login'

import blogService from './services/blogs'
import loginService from './services/login'
import Message from './components/Message'
import './assets/main.css'

const App = () => {

  const localStorageUserKey = 'blogAppUser'
  const [blogs, setBlogs] = useState([])
  const [user,setUser] = useState(null)
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState([])
  const blogFormRef = useRef()

  useEffect(() => {
    console.log('get blogs')

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedIn = JSON.parse(window.localStorage.getItem(localStorageUserKey))
    console.log('logged in? ',loggedIn)
    if (loggedIn) {
      setUser(loggedIn)
      // blogService.setToken(loggedIn.token)
      blogService.setAuthHeader(loggedIn.token)
    }
  },[])

  // console.log('username - ',username,password,user)

  const notification = (text,type) => {
    setMessage([text,type])
    setTimeout(() => {
      setMessage([])
    },5000)
  }

  const handleLogin = async e => {
    e.preventDefault()
    console.log('handle submit')

    try {
      const loggedInUser = await loginService.login({ username,password })
      console.log('logged in user ',loggedInUser)

      if (loggedInUser) {
        window.localStorage.setItem(localStorageUserKey,JSON.stringify(loggedInUser))
        blogService.setAuthHeader(loggedInUser.token)
        setUser(loggedInUser)
        setPassword('')
        setUsername('')
        notification(`${loggedInUser.username} logged in`,'success')
      }

    } catch(err) {
      console.log('error logging in ',err.response.data.error)
      notification(err.response.data.error,'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(localStorageUserKey)
    blogService.setAuthHeader('')
    setUser(null)

  }

  const handleAddBlog = async newBlogObject => {
    const newBlog = await blogService.create(newBlogObject)
    blogFormRef.current.setShow()

    newBlog.user = {
      name: user.name,
      username: user.username
    }
    const newBlogs = blogs.concat(newBlog)

    setBlogs(newBlogs)

  }

  const handleRemoveBlog = async blogID => {
    const deleted = await blogService.remove(blogID)
    console.log('deleted blog? ',deleted)
    setBlogs(blogs.filter(b => b.id !== blogID))
  }

  const handleLike = async (blog) => {
    await blogService.update({
      'id':   blog.id,
      'title':  blog.title,
      'author': blog.author,
      'url':  blog.url,
      'likes':  blog.likes + 1,
      'user':   blog.id
    })

    const updatedBlogs = blogs.map( b => b.id !== blog.id ? b : { ...b, likes: b.likes+1 } )
    setBlogs(updatedBlogs)
  }

  const showBlogs = () => {
    blogs.sort((a,b) => b.likes - a.likes)
    console.log('uname ',user.username)
    return (
      <div data-testid='testBlogList' className='blog-list'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={handleLike} username={user.username} remove={handleRemoveBlog}/>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      {user && <h2 className='display-flex'>{user.username} logged in &nbsp; <button type="button" onClick={handleLogout}>logout</button></h2>}

      <Message message={message} />

      {!user ?
        <Login
          handleLogin={handleLogin}
          setPassword={setPassword}
          setUsername={setUsername}
          username={username}
          password={password}
        />
        :
        <>
          <Toggle showText='add blog' hideText='cancel' ref={blogFormRef}>
            <CreateBlog
              addBlog={handleAddBlog}
              notification={notification} />
          </Toggle>
          {showBlogs()}
        </>
      }
    </div>
  )
}

export default App