import PropTypes from 'prop-types'

const Login = ({ handleLogin,setPassword,setUsername,username,password }) => {

  return (
    <>
      <h1>log into application</h1>
      <form onSubmit={handleLogin}>
        <div className="row">
          <label htmlFor="username">Username</label>
          <input data-testid="username" type="text" id="username" onChange={({ target }) => setUsername(target.value)} value={username} />
        </div>
        <div className="row">
          <label htmlFor="password">Password </label>
          <input data-testid="password" type="password" id="password" onChange={({ target }) => setPassword(target.value)} value={password} />
        </div>
        <button data-testid="login-button" className="row" type="submit">login</button>
      </form>
    </>
  )

}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default Login