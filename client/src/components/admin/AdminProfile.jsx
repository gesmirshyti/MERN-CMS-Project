import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './Admin.css'
export default function AdminProfile() {
    const [socket] = useState(() => io('http://localhost:8000')); 
    const [posts, setPosts] = useState([]);

 

    useEffect(() => {
        socket.on('post_verification_required', (post) => {
            setPosts((prevPosts) => [...prevPosts, post]);
        });
    
        // Fetch pending products from the API
        axios
            .get('http://localhost:8000/api/admin/verify') // Endpoint to fetch pending products
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching pending products:', error);
            });
    
        return () => {
            socket.off('post_verification_required');
        };
    }, [socket]);
    

    const approvePost = (post) => {
        axios
            .post(`http://localhost:8000/api/admin/approve/${post._id}`) 
            .then(() => {
                setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
                console.log("Post Approved and will be posted :",post._id)
            })
            .catch((error) => {
                console.error('Error approving the post:', error);
            });
    };

    const rejectPost = (post) => {
        axios
            .post(`http://localhost:8000/api/admin/reject/${post._id}`) 
            .then(() => {
                setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
                console.log("Post Rejected and will not be posted :",post._id)
            })
            .catch((error) => {
                console.error('Error rejecting the post:', error);
            });
    };

    return (
        <div className='admin-profile'>
        <h1>Admin Profile</h1>
        <table className="product-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.name}</td>
                <td>
                  <button className='approve' onClick={() => approvePost(post)}>Approve</button>
                  <button className='reject' onClick={() => rejectPost(post)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    );
}
