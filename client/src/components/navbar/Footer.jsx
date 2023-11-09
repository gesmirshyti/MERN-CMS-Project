import React from "react";
import './Footer.css'
export default function Footer(){
    return(
        <footer>
        <div class="footer-content">
            <h3>CMS Website</h3>
            <p>CMS is a new Market Place for All Customers to find the best Product for them.</p>
            <ul class="socials">
                <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                <li><a href="#"><i class="fa fa-youtube"></i></a></li>
                <li><a href="#"><i class="fa fa-linkedin-square"></i></a></li>
            </ul>
        </div>
        <div class="footer-bottom">
            <p>All copyright Reserved &copy;2023 CMS. </p>
        </div>
    </footer>
    )
}