const Login = ({handleSubmit,setPassword,setUsername,username,password}) => {

    return (
        <>
            <h1>log into application</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} value={username} />      
                <br/>
                <label htmlFor="password">Password </label>
                <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <br/>
                <button type="submit">login</button>
            </form>
        </>
    )
    
}
export default Login