import { useState, useEffect } from 'react'
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

  useEffect(() => {
    console.log('get blogs')

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedIn = JSON.parse(window.localStorage.getItem(localStorageUserKey))
    setUser(loggedIn)
    blogService.setToken(loggedIn.token)
  },[])

  // console.log('username - ',username,password,user)

  const notification = (text,type) => {
    setMessage([text,type])
    setTimeout(() => {
      setMessage([])
    },5000)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log('handle submit')

    try {
      const loggedInUser = await loginService.login({username,password})
      console.log('logged in user ',loggedInUser)

      if (loggedInUser) {
        window.localStorage.setItem(localStorageUserKey,JSON.stringify(loggedInUser))
        blogService.setToken(loggedInUser.token)
        setUser(loggedInUser)
        setPassword('')
        setUsername('')
        notification(`${loggedInUser.username} logged in`,'success')
      }

    } catch(err) {
      console.log('error logging in ',err)
      notification(`logged failed`,'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(localStorageUserKey)
    blogService.setToken('')
    setUser(null)

  }

  const handleAddBlog = async newBlogObject => {
    const newBlog = await blogService.create(newBlogObject)
    console.log('new blog = ',newBlog)
    const newBlogs = blogs.concat(newBlog)
    setBlogs(newBlogs)
    // notification(`A new blog "${title}" by "${author}" added`,'success')

  }

  const showBlogs = () => (
    blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )
  )

  return (
    <div>
      <h1>Blogs</h1>
      {user && <h2>{user.username} logged in<button type="button" onClick={handleLogout}>logout</button></h2>}

      <Message message={message}s />

      {!user ?
          <Login 
            handleSubmit={handleSubmit} 
            setPassword={setPassword} 
            setUsername={setUsername} 
            username={username} 
            password={password} 
            /> 
          : 
          <>
            <Toggle showText='add blog' hideText='cancel'>
            <CreateBlog 
              addBlog={handleAddBlog} 
              notification={notification}
              // title={title}
              // setTitle={setTitle} 
              // author={author} 
              // setAuthor={setAuthor}
              // url={url} 
              // setUrl={setUrl}
            />
            </Toggle>
            {showBlogs()}
          </>
        } 
    </div>
  )
}

export default App