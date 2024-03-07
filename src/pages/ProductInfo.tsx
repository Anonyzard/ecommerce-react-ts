import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContactQuery } from "../reducers/contactsApi";
import { toast } from "react-toastify";

const UserInfo = () => {
  const { id } = useParams();
  const { data, error } = useContactQuery(id!);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong");
    }
  }, [error]);

  return (
    <div className="mt-16">
      <div className="bg-white p-8 rounded shadow-md max-w-md mx-auto">
        <div className="text-xl font-bold mb-4">User Contact Detail</div>
        <div className="space-y-4"> {/* Aumenté el espacio vertical entre elementos */}
          <div>
            <strong>ID:</strong>
            <span>{id}</span>
          </div>

          <div>
            <strong>Name:</strong>
            <span>{data && data.name}</span>
          </div>

          <div>
            <strong>Description:</strong>
            <span>{data && data.description}</span>
          </div>

          <div>
            <strong>Price:</strong>
            <span>{data && data.price}</span>
          </div>
        </div>

        <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserInfo;
