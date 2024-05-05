import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
  const blogs = await axios.get(baseUrl)
  return blogs.data
}

const create = async ({title,author,url}) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
console.log('autho ',config)
  const blog = await axios.post(baseUrl,{title,author,url},config)

  return blog.data
}

export default { setToken,getAll,create }