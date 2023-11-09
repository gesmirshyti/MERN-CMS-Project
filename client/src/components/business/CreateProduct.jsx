import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CreateProduct.css'
export default function CreateProduct() {
    const userId = localStorage.getItem("userId");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [numberInStock, setNumberInStock] = useState("");
    const [category, setCategory] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleNumberInStockChange = (e) => {
        setNumberInStock(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setProductImage(imageFile);
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("numberInStock", numberInStock);
        formData.append("category", category);
        formData.append("userId", userId);
        formData.append("productImage", productImage);

        try {
            const response = await fetch("http://localhost:8000/api/product/create", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log("Product created:", result);
                setName("");
                setDescription("");
                setPrice("");
                setNumberInStock("");
                setCategory("");
                setProductImage(null);
                navigate("/product/1");
            } else {
                const errorData = await response.json();
                console.error("Error creating product:", errorData);
                if (errorData.errors) {
                    setValidationErrors(errorData.errors);
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setValidationErrors({ internal: 'Internal Server Error' });
        }
    };

    return (
        <div className="createProduct">
            <h2>Create a product</h2> <br />
            {validationErrors.accounttype && <div className='error-message'>{validationErrors.accounttype.message}</div>}
            <form onSubmit={handleCreateProduct}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <label htmlFor="name">Name*</label>
                    {validationErrors.name && <div className='error-message'>{validationErrors.name.message}</div>}
                </div>

                <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        style={{ height: "100px" }}
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                    <label htmlFor="description">Description*</label>
                    {validationErrors.description && <div className="error-message">{validationErrors.description.message}</div>}
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">$</span>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={price}
                        onChange={handlePriceChange}
                    />
                    <span className="input-group-text">.00</span>
                </div>
                {validationErrors.price && (
  <div className="error-message">
    {validationErrors.price.message}
  </div>
)}
                <div className="form-floating mb-3">
                    <input
                        type="number"
                        className="form-control"
                        name="numberInStock"
                        value={numberInStock}
                        onChange={handleNumberInStockChange}
                    />
                    <label htmlFor="numberInStock">Quantity*</label>
                    {validationErrors.numberInStock && <p className='error-message'>{validationErrors.numberInStock.message}</p>}
                </div>
                <select
                    className="form-select mb-3"
                    name="category"
                    value={category}
                    onChange={handleCategoryChange}
                    
                >
                    <option value="">Select a Category for the Product*</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="RealEstate">Real Estate</option>
                </select>
                {validationErrors.category && <p className='error-message'>{validationErrors.category.message}</p>}
               
                <div className="upload-profile-container mb-3">
  <label htmlFor="profile-picture" className="upload-label">
    <span>Upload Product Picture</span>
    <input
      type="file"
      id="profile-picture"
      name="profilePicture"
      accept="image/jpeg, image/png"
      onChange={handleImageChange}
    />
  </label>
  {productImage && (
    <img
      width={70}
      height={70}
      src={productImage}
      alt="Profile Picture"
      className="rounded-full"
    />
  )}
{validationErrors.productImage && <div className='error-message'>{validationErrors.productImage.message}</div>}
</div>
                <div className="d-grid gap-2 d-md-flex mb-3">
                    <button type="submit" className="btn btn-outline-success">
                        Publish
                    </button>
                </div>
                
            </form>
        </div>
    );
}
