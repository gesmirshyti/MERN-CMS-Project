import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import '../components/business/CreateProduct.css'
export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [numberInStock, setNumberInStock] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/product/${id}/details`);
        if (response.status === 200) {
          const data = response.data;
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setNumberInStock(data.numberInStock);
          setCategory(data.category);
          setProductImage(data.productImage);
        } else {
          console.error("Error fetching product details");
        }
      } catch (error) {
        console.error("Axios error:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("numberInStock", numberInStock);
    formData.append("category", category);
    formData.append("productImage", productImage);

    try {
      const response = await fetch(`http://localhost:8000/api/product/${id}/update`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (response.status === 200) {
        const result = await response.json();
        console.log("Product updated:", result);

        setName("");
        setDescription("");
        setPrice("");
        setNumberInStock("");
        setCategory("");
        setProductImage(null);
        navigate("/product/1");
      } else if (response.status === 400) {
        const errorData = await response.json();
        setValidationErrors(errorData.errors);
      } else {
        console.log("Error updating product");
      }
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="createProduct">
    <h2>Update Product</h2> <br />
    <form onSubmit={handleSubmit}>
      <div className="form-floating mb-3">
        <input
          type="text"
          id="name"
          className="form-control"

          name="name"
          value={name}
          onChange={handleNameChange}
        />
                            <label htmlFor="name">Name*</label>

        {validationErrors.name && (
          <div className="error-message">{validationErrors.name.message}</div>
        )}
      </div>
      <div className="form-floating mb-3">
        <textarea
          id="description"
          name="description"
          className="form-control"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
                            <label htmlFor="description">Description*</label>
        {validationErrors.description && (
          <div className="error-message">{validationErrors.description.message}</div>
        )}
      </div>
      <div className="input-group mb-3">
      <span className="input-group-text">$</span>
        <input
          type="number"
          id="price"
          name="price"
          className="form-control"
          value={price}
          onChange={handlePriceChange}
        />
                            <span className="input-group-text">.00</span>

        {validationErrors.price && (
          <div className="error-message">{validationErrors.price.message}</div>
        )}
      </div>
      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"

          id="numberInStock"
          name="numberInStock"
          value={numberInStock}
          onChange={handleNumberInStockChange}
        />
                            <label htmlFor="numberInStock">Quantity*</label>

        {validationErrors.numberInStock && (
          <div className="error-message">{validationErrors.numberInStock.message}</div>
        )}
      </div>
      <div className="form-floating mb-3">
        <input
          type="file"
          id="productImage"
          name="productImage"
          className="form-control"
          onChange={handleImageChange}
        />
                            <label htmlFor="productImage">Image*</label>
                            <img src={productImage} alt={name} width={100} height={100} />

        {validationErrors.productImage && (
          <div className="error-message">{validationErrors.productImage.message}</div>
        )}
      </div>
      <div className="form-group mb-3">
        <select
          className="form-select"
          name="category"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Select a Category for the Product</option>
          <option value="Furniture">Furniture</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="RealEstate">Real Estate</option>
        </select>
        {validationErrors.category && (
          <div className="error-message">{validationErrors.category.message}</div>
        )}
      </div>
      <div className="d-grid gap-2 d-md-flex ">
        <button type="submit" className="btn btn-outline-success" disabled={isSubmitting}>
          Update Product
        </button>
      </div>
    </form>
  </div>
  );
}
