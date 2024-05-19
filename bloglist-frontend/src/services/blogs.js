import axios from 'axios'
const baseUrl = '/api/blogs'

// let token = null
let authHeader = null

// const setToken = newToken => {
//   token = `Bearer ${newToken}`
// }

const setAuthHeader = (newToken) => {
  authHeader = {
    headers: {
      Authorization: `Bearer ${newToken}`
    }
  }
}

const getAll = async () => {
  const blogs = await axios.get(baseUrl)
  return blogs.data
}

const create = async ( { title,author,url } ) => {
  // const config = {
  //   headers: {
  //   Authorization: token
  //   }
  // }
  console.log('autho ',authHeader)
  const blog = await axios.post(baseUrl, { title,author,url } ,authHeader)

  return blog.data
}

const update = async ( { id,title,author,url,likes,user } ) => {
  const blog = await axios.put(`${baseUrl}/${id}`,{ title,author,url,likes })

  return blog.data
}

const remove = async (id) => {
  const deleted = await axios.delete(`${baseUrl}/${id}`,authHeader)
  console.log('deleted = ',deleted)
}

export default { setAuthHeader,getAll,create,update,remove }