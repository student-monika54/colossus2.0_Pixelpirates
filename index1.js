document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Remember Me:", rememberMe);



        // Redirects to the desired page
        window.location.href = "landing.html";
    });
});


/*green house page*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".select-btn").forEach(button => {
        button.addEventListener("click", function () {
            alert("Plant Selected!");
        });
    });

    document.querySelector(".harvest-btn").addEventListener("click", function () {
        alert("Time to Harvest!");
    });
});



// Handle Exchange Requests
document.querySelectorAll('.exchange-btn').forEach(button => {
    button.addEventListener('click', () => {
        const plantInfo = button.closest('.crop-card').querySelector('h3').textContent;
        alert(`You have requested to exchange for: ${plantInfo}`);
        
      
        fetch('/request-exchange', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({plant: plantInfo})
        }).then(response => {
            if (response.ok) alert('Exchange request sent successfully!');
        });
    });
});

// Handle Chat Functionality
document.querySelectorAll('.chat-btn').forEach(button => {
    button.addEventListener('click', () => {
        const plantInfo = button.closest('.crop-card').querySelector('h3').textContent;
        alert(`Starting chat about: ${plantInfo}`);
        
        // Example: Redirect to a chat page (uncomment below when needed)
        // window.location.href = `/chat?plant=${encodeURIComponent(plantInfo)}`;
    });
});

// Highlight Badges Dynamically
document.querySelectorAll('.badge').forEach(badge => {
    if (badge.textContent.includes('Verified')) {
        badge.style.backgroundColor = 'green';
        badge.style.color = 'white';
    } else if (badge.textContent.includes('Premium')) {
        badge.style.backgroundColor = 'gold';
        badge.style.color = 'black';
    }
});

// Filter Plants by Type
document.querySelector('.filter-dropdown').addEventListener('change', (event) => {
    const selectedFilter = event.target.value.toLowerCase();
    document.querySelectorAll('.crop-card').forEach(card => {
        if (selectedFilter === '' || card.querySelector('h3').textContent.toLowerCase().includes(selectedFilter)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

