import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    useLoginMutation,
    useOrderMutation, } from "../reducers/storeApi"
import { Order } from "../models/order.model";
import { UserResponse } from "../models/user.model";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../reducers/tokenSlice";

const initialState = {
    name: "",
    email: "",
    password: "",
};

const LoginUser = () => {
    const [formValue, setFormValue] = useState(initialState);
    const [login] = useLoginMutation();
    const { token } = useSelector((state: any) => state.token)
    const { token_store } = useSelector((state: any) => state.token)
    const dispatch = useDispatch();
    // const [token, setToken] = useState("")
    const [order] = useOrderMutation();
    const { email, password } = formValue;
    const navigate = useNavigate();
    const { id } = useParams();
    const login_btn = <input
        type="submit"
        value={id ? "Comprar" : "Iniciar sesión"}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4 cursor-pointer"/>
    const logout_btn = <button
        onClick={() => { dispatch(setToken("")); navigate("/") }}
        className={token ? "bg-white hover:bg-gray-300 text-blue-500 font-bold py-2 px-4 rounded-xl mt-4 cursor-pointer" : "hidden"}>Cerrar sesión</button>
    // TODO: https://gemini.google.com/app/63027e556602c9b2

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Por favor, agregue un valor para cada campo de entrada");
        } else {
            console.log("Comenzando login...");
            
            const response_login = login({
                email: formValue.email,
                password: formValue.password
            }).unwrap().catch((error: UserResponse) => error);
            
            const access_token = (await response_login).access_token
            console.log(access_token);
            
            
            
            
            if (access_token) {
                dispatch( setToken(access_token) )
                console.log(token_store);
                // setToken(access_token)
                if (id){
                let buy_item: Order = {user_token: access_token, new_item: id}
                await order(buy_item)
                toast.success("Producto Agregado Exitosamente");
            }
                console.log(`access_token: ${access_token}`);
                navigate("/");
                // history.pushState({user_token: access_token}, "", "/")
                
                // useLinkClickHandler("/", {state:access_token})
            } else {
                // navigate("/");
                // console.log(`setToken: ${token},\naccess_token: ${access_token}`);
                toast.error("Falló al iniciar sesión");
            }
        }
    };

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        let { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    };

    return (
        <div className="mt-16 flex justify-center">
            {/* <p>{token}</p> */}
            <form
                className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 max-w-sm"
                onSubmit={handleSubmit}
                >
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="test@test.com"
                    value={email || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••"
                    value={password || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                <Link to="/" className='pe-1'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4">
                        Volver
                    </button>
                </Link>
                <Link to={id ? `/register/${id}` : `/register`} className='pe-1'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4">
                        Registrarse
                    </button>
                </Link>
                
                {/* <input
                    type="submit"
                    value={id ? "Comprar" : "Iniciar sesión"}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4 cursor-pointer"
                /> */}
                
                {email ? login_btn : logout_btn}

                {/* {token != "" ? <button 
                onClick={() => { dispatch(setToken("")); navigate("/") }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4 cursor-pointer">Cerrar sesión</button> : <div></div>} */}
                
            </form>
        </div>
    );
};

export default LoginUser;
