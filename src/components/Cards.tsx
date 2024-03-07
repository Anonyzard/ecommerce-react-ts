import React from 'react';
import { Item } from '../models/item.model';
import { Link } from 'react-router-dom';

const Product: React.FC<Item> = ({ id, name, image, price }) => {
    // const topage=`/details/${id}`
    return (
        <div className="p-4 ">
            <div className="max-w-xl mx-fit h-22 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl flex">
                <div className='w-6/12 h-13'>
                    <img className="w-fit h-fit object-center" src={image} alt={name} />
                </div>
                <div className="p-4 w-10/12">
                    <h2 className="text-4xl md:text-4xl text-left font-semibold" > {name} </h2>
                    {/* <p className="text-gray-600"> {description} </p> */}
                    <p className="text-gray-600 text-xl md:text-2xl"> ${price} </p>
                </div>
                <div className='w-2/12 py-4 px-1'>
                    <Link to={`/details/${id}`} >
                        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            Ver
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// export default Card;
export default Product;