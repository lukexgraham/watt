const Login: any = ({ getFeed }: any) => {
    return (
        <>
            <h1>Login</h1>
            <div className="login-box">
                <input type="text" name="user" id="user" />
                <button
                    onClick={() => {
                        window.location.href = "/athletes/66443";
                    }}
                >
                    Login
                </button>
            </div>
        </>
    );
};

export default Login;
