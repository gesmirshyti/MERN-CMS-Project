import React, { useState, useEffect } from "react";
import { useParams, useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import './ProductDetails.css'
export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    useEffect(() => {

        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/product/${id}/details`);
                if (response.status === 200) {
                    const data = response.data;
                    setProduct(data);

                    if (data.owner._id === userId) {

                        setIsOwner(true);
                    }
                } else {
                    console.error("Error fetching product details");
                }
            } catch (error) {
                console.error("Axios error:", error);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleUpdateProduct = () => {

        navigate(`/product/${id}/update`);
    };

    const handleDeleteProduct = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/product/${id}/delete`);
            if (response.status === 200) {
                console.log("Product deleted successfully");
                navigate(`/product/1`);
            } else {
                console.error("Error deleting the product");
            }
        } catch (error) {
            console.error("Axios error:", error);
        }
    };


    return (
        <div>
<section>
<h1>Details of Product: </h1>
  {product ? (
    <div className="details-container flex">

      <div className="left">
        <div className="main_image">
        <img src={product.productImage} alt={product.name} className="slide" />
        </div>
      </div>
      <div className="right">
      

        <h3>{product.name}</h3>
        <h4>          
          <normal>Price : {product.price}$</normal>
        </h4>
        <p>{product.description}</p>
        <h5>Owner of Product: <Link to={`/business/${userId}`} className="link">{product.owner.companyName}</Link></h5>

        <h5>Quantity : {product.numberInStock}</h5>
        <h5>Category : {product.category}</h5>

        {isLoggedIn && isOwner && (
          <button onClick={handleUpdateProduct} className="btn cart px-auto">Update Product</button>
        )}
        {isLoggedIn && isOwner && (
          <button onClick={handleDeleteProduct} className="btn cart px-auto">Delete Product</button>
        )}
        <button className="btn cart px-auto">Add to Bag</button>
      </div>
    </div>
  ) : (
    <p>Loading product details...</p>
  )}
</section>

        </div>
    );
}
