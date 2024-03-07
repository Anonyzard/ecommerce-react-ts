import { useItemsQuery } from "../reducers/storeApi";
import Product from "../components/Cards";
import OrderState from "../components/Order";
import { useSelector } from "react-redux";

const Home = () => {
    const {token} = useSelector((state: any) => state.token)
    console.log(`Home_token: ${token}`);
    
    const { data, isLoading } = useItemsQuery()
    if (isLoading) {
        return (
            <div className="p-4 ">
                <div className="p-4 max-w-xl mx-fit h-22 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl flex">
                    <p>Cargando...</p>
                </div>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center h-full">
            <div className="lg:w-1/3"></div>
            <div className="mx-fit h-full">
                <OrderState token={token}/>
                
                {data &&
                    data.map((item: any) => (
                            <Product key={item.id} id={item.id} name={item.name} 
                            image={item?.image} price={item.price}/>
                    ))}
            </div>
        </div>
    );
}


export default Home;