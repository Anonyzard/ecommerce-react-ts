import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function AppBar() {
    const { token } = useSelector((state: any) => state.token)
    return (
        <div className="flex-row bg-gray-700 w-full fixed">

            <div className="justify-center flex ml-10"
            style={{  padding: '1rem', color: '#fff', textAlign: 'center' }}>
                <Link to="/" className="text-3xl flex-1">
                    <h1>{"My Store"}</h1>
                </Link>
                <Link className="text-white text-right self-center" to="/login">
                    <p className={token ? "text-xl border border-transparent border-b-green-500" : "text-xl"}>👤</p>
                </Link>
            </div>
        </div>
    );
}

export default AppBar;