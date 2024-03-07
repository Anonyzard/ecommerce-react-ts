import { Link, useNavigate, useParams } from 'react-router-dom';
import { useItemQuery, useOrderMutation } from '../reducers/storeApi';
import { useSelector } from 'react-redux';
import { Order } from '../models/order.model';
import { toast } from 'react-toastify';

const ProductInfo = () => {
    // let location = useLocation();
    const navigate = useNavigate()
    const [order] = useOrderMutation();
    const { token } = useSelector((state: any) => state.token)
    const { id } = useParams();
    // const { name, image, description, price } = location.state;
    // const { id } = location.state;
    const { data } = useItemQuery(id!)
    async function handleClick () {
        if (token == "" ){
        navigate(`/buy/${id}`)
    } else {
        try {
            let buy_item: Order = { user_token: token, new_item: id }
            await order(buy_item)
            navigate(`/`)
            toast.success("Producto Agregado Exitosamente");
        } catch (error) {
            navigate(`/buy/${id}`)
        }
    }

    }
    // const prod = data?.map(item => { <Product id={item.id} name={item.name} image={item.image} description={item.description} price={item.price} /> })
    
    return (
        <div className="space-y-4 p-8 bg-grey-500 grid"> {/* Aumenté el espacio vertical entre elementos */}
            <div className="max-w-md mx-auto place-content-center bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg">
                <div className='grid-row-1'>
                    <img className="h-full w-full object-cover" src={data?.image} alt={data?.name} />
                </div>

                <div className='grid-rows-2'>
                    <h1 className='text-4xl place-content-center text-center font-semibold'>{data?.name}</h1>
                    <span>{data?.description}</span>
                </div>

                <div>
                </div>

                <div className='p-1'>

                <Link to="/" className='pe-1'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4">
                        Volver
                    </button>
                </Link>
                {/* <Link to={`/buy/${id}`} className='pe-1'> */}
                    <button onClick={() => handleClick()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4">Comprar ${data?.price}</button>
                {/* </Link> */}
                </div> 
            </div>  
        </div>
    )
    }

export default ProductInfo;