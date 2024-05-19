import axios from 'axios'
const rootUrl = '/api/login'

const login = async ( { username,password } ) => {

  const user = await axios.post(rootUrl, { username,password } )

  return user.data
}

export default { login }
