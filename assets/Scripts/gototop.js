// Go to Top Button functionality
(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        
        // Get the button
        let mybutton = document.getElementById("goTopBtn");
        
        // If button doesn't exist, create it
        if (!mybutton) {
            mybutton = document.createElement('button');
            mybutton.id = "goTopBtn";
            mybutton.innerHTML = "↑";
            mybutton.title = "Go to top";
            mybutton.onclick = topFunction;
            document.body.appendChild(mybutton);
            
            // Add CSS styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                #goTopBtn {
                    display: none;
                    position: fixed;
                    bottom: 20px;
                    right: 30px;
                    z-index: 99;
                    border: none;
                    outline: none;
                    background-color: #555;
                    color: white;
                    cursor: pointer;
                    padding: 15px;
                    border-radius: 10px;
                    font-size: 18px;
                    width: 50px;
                    height: 50px;
                }
                #goTopBtn:hover {
                    background-color: #333;
                }
            `;
            document.head.appendChild(style);
        }

        // Show/hide button on scroll
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                mybutton.style.display = "block";
            } else {
                mybutton.style.display = "none";
            }
        };
    });

    // Scroll to top function
    function topFunction() {
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
    }
})();
