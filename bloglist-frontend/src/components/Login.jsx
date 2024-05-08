const Login = ({handleSubmit,setPassword,setUsername,username,password}) => {

    return (
        <>
            <h1>log into application</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" onChange={({target}) => setUsername(target.value)} value={username} />      
                </div>
                <div className="row">
                    <label htmlFor="password">Password </label>
                    <input type="password" id="password" onChange={({target}) => setPassword(target.value)} value={password} />
                </div>
                <button type="submit">login</button>
            </form>
        </>
    )
    
}
export default Login