import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    useRegisterMutation,
    useLoginMutation,
    useOrderMutation,
} from "../reducers/storeApi"
import { Order } from "../models/order.model";
import { UserRegister, UserResponse } from "../models/user.model";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../reducers/tokenSlice";

const initialState = {
    name: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    check_password: "",
};

const RegisterUser = () => {
    const [formValue, setFormValue] = useState(initialState);
    const [register] = useRegisterMutation();
    const [login] = useLoginMutation();
    const { token_store } = useSelector((state: any) => state.token)
    const dispatch = useDispatch();
    // const [token, setToken] = useState("")
    const [order] = useOrderMutation();
    const { name, lastname, phone, email, password, check_password } = formValue;
    const navigate = useNavigate();
    const { id } = useParams();
    // TODO: https://gemini.google.com/app/63027e556602c9b2

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!name || !lastname || !phone || 
            !email || !password || !check_password) {
            toast.error("Por favor, agregue un valor para cada campo de entrada");
        } else {
            console.log("Comenzando registro...");
            if (password == check_password){
            const response_register = register({
                firstname: formValue.name,
                lastname: formValue.lastname,
                phone: formValue.phone,
                email: formValue.email,
                password: formValue.password
            }).unwrap().catch((error: UserRegister) => error);
            const register_msg = (await response_register)
            console.log(register_msg);
            

            if (register_msg.message != "User created successfully."){
                toast.error(register_msg.message)
            } else {
            toast.success("Usuario creado exitosamente")
            const response_login = login({
                email: formValue.email,
                password: formValue.password
            }).unwrap().catch((error: UserResponse) => error);

            const access_token = (await response_login).access_token
            console.log(access_token);

            if (access_token) {
                let buy_item: Order = { user_token: access_token, new_item: id }
                dispatch(setToken(access_token))
                console.log(token_store);

                localStorage.setItem("token", access_token)
                // setToken(access_token)
                await order(buy_item)
                console.log(`access_token: ${access_token}`);
                navigate("/", { state: { user_token: access_token } });
                // history.pushState({user_token: access_token}, "", "/")

                toast.success("Producto Agregado Exitosamente");
                // useLinkClickHandler("/", {state:access_token})
            } else {
                // navigate("/");
                // console.log(`setToken: ${token},\naccess_token: ${access_token}`);
                toast.error("Falló al iniciar sesión");
            }}}
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
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="name"
                    value={name || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                    Surname
                </label>
                <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="lastname"
                    value={lastname || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                    Phone
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="number"
                    value={phone || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            
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

                <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                    Verificar contraseña
                </label>
                <input
                    type="password"
                    id="check_password"
                    name="check_password"
                    placeholder="••••••"
                    value={check_password || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                <Link to="/" className='pe-1'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4">
                        Volver
                    </button>
                </Link>
                {/* <Link to="/" state={{ token }}> */}
                <input
                    type="submit"
                    value={id ? "Registrarse y comprar" : "Registrarse"}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4 cursor-pointer"
                />
                {/* </Link> */}
            </form>
        </div>
    );
};

export default RegisterUser;
