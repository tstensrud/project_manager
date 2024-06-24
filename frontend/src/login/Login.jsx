function Login() {

    return(
        <>
        <div className="login-div">
        <h1 className="app-content-subTitleheaderText">Structor TS romskjema</h1>
        <h1 className="app-content-subTitleheaderText">Logg inn</h1>
        <form className="custom-form profile-form" method="POST" role="form" action="">
            <input className="form-control" type="email" name="email" id="email" placeholder="e-mail" /> <br />
            <input className="form-control" type="password" name="password" id="password" placeholder="passord" />
            <p>
                <button type="submit" className="form-button">
                    Logg inn
                </button>
            </p>
            <p>

            </p>
        </form>
    </div>
    </> 
    );
}

export default Login