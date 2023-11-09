import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './ShowProducts.css'
const categories = ["Furniture", "Electronics", "Clothing", "Books", "RealEstate"];

export default function ShowProducts({ updateCartItemCount }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const { page } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const cartId = localStorage.getItem("cartId");
  const [order, setOrder] = useState("name");
  const [filter, setFilter] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleQuickAddToCart = (product) => {
    axios
      .post(`http://localhost:8000/api/cart/add-to-cart`, {
        cartId,
        productId: product._id,
        quantity: 1,
      }, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          console.log("Product added to the cart");
          const updatedCartItemCount = response.data.cart.items.length;
          updateCartItemCount(updatedCartItemCount);
        } else {
          console.error("Error adding the product to the cart");
        }
      })
      .catch((error) => {
        console.log("Axios error:", error);
        const errorMessage = error.response?.data.message || "An error occurred while adding to the cart.";
        setProducts((prevProducts) => {
          const updatedProducts = prevProducts.map((p) => {
            if (p._id === product._id) {
              return { ...p, error: errorMessage };
            }
            return p;
          });
          return updatedProducts;
        });
      });
  };

  const handleSortByCategory = (category) => {
    const sortedProducts = [...products].sort((a, b) => a.category.localeCompare(b.category));
    setProducts(sortedProducts);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/product?page=${page}`
        );

        if (response.status === 200) {
          const data = response.data;
          const approvedProducts = data.products.filter(
            (product) => product.verificationStatus === "Approved"
          );

          const filteredProducts = approvedProducts.filter((product) =>
            selectedCategories.length === 0 || selectedCategories.includes(product.category)
          );
          const filteredAndSearchedProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(filter.toLowerCase())
          );

          setProducts(filteredAndSearchedProducts);
          setPagesCount(data.pagesCount);
        } else {
          console.error("Error fetching products");
        }
      } catch (error) {
        console.error("Axios error:", error);
      }
    };

    fetchProducts();
  }, [page, filter,selectedCategories]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}/details`);
  };

  const toggleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="showProducts">
      <h2>Shop Now</h2>
      <br />

<div className="search_wrap search_wrap_6">
  <div className="search_box">
  <input
        onChange={(e) => setFilter(e.target.value)}
        type="text"
        placeholder="Search a product by name "
        className="input"
      />
      <div className="btn">
      <p className="search-p">Search</p>
    </div>
  </div>
</div>
<div className="category-filter">
  <h3 className="black">Filter by Category:</h3>
  <ul className="category-list d-flex">
    {categories.map((category) => (
      <li key={category} className="category-item">
        <label className="category-label">
          <input
            type="checkbox"
            className="category-checkbox"
            value={category}
            checked={selectedCategories.includes(category)}
            onChange={() => toggleCategorySelection(category)}
          />
          <span className="checkmark"></span>
          {category}
        </label>
      </li>
    ))}
  </ul>
</div>

      <div className="products-list">
        
      </div>

      <div className='container-fluid'>
  <div className="row">
    {products.map((product) => (
      <div className="col-md-3 col-10 mt-5" key={product._id}>
        <div className="card">
          <img className='mx-auto img-thumbnail' src={product.productImage} alt={product.name} />
          <div className="card-body text-center mx-auto d-flex">
            <div className='cvp'>
              <h5 className="card-title font-weight-bold">{product.name}</h5>
              <p className="card-text">Price: ${product.price}</p>
              <p className="card-text">Category: {product.category}</p>

              {product.error && <p className="error-message">{product.error}</p>}

              <Link to={`/product/${product._id}/details`} className="btn details px-auto">View Details</Link><br />
              <button href="#" className="btn cart px-auto">ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="pagination">
  {Array.from({ length: pagesCount }).map((_, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(index + 1)}
      className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
    >
      {index + 1}
    </button>
  ))}
</div>
    </div>
  );
}
