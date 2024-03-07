import { Order } from '../models/order.model';
import { useBuyMutation, useLast_orderQuery, useUserQuery } from '../reducers/storeApi';
import { toast } from 'react-toastify';

const OrderState = (token: any) => {
    console.log(token);
    const [buy] = useBuyMutation()
    
    if (token.token){
        const {data, currentData, refetch} = useLast_orderQuery(token.token)
        var user_id = `${currentData?.user_id}`
        const {data: user} = useUserQuery(user_id)

        if (data?.completed == false){
            // setTotalPrice(total)
            async function handleBuy() {
                const order:Order = {user_token: token.token!, completed: true}
                const newTotal = (await buy(order).unwrap()).total || 0
                refetch()
                if (newTotal != 0){
                    toast.success("Compra completada!");
                } else {
                    toast.error("Ups! Hubo un error en la compra")
                }
            }
        console.log(currentData);
        
        return (
            <div className="p-4 ">
                <div className="p-4 max-w-xl mx-fit h-22 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl flex">
                    <div className='w-7/12 h-13'>
                        <h1 className='font-bold'>Orden de compra</h1>
                        <p>ID de orden: {currentData?.id}</p>
                        <p>Usuario: {user?.firstname} {user?.lastname}</p>
                        {/* <p>Items: {[currentData?.items?.map((item) => {return item.id})].toString()}</p> */}
                        <p>Total: ${currentData?.total}</p>
                        <button onClick={handleBuy} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Completar compra</button>
                    </div>
                </div>
            </div>
        );} else {
            return (
                <div></div>
            )
    }}
};

export default OrderState;