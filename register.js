// Handle user registration
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const registerUsername = document.getElementById("registerUsername").value;
    const registerPassword = document.getElementById("registerPassword").value;
    const registerEmail = document.getElementById("registerEmail").value;
    const registerRole = document.getElementById("registerRole").value;

    // Send a POST request to register the user
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUsername,
        registerPassword,
        registerEmail,
        registerRole,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // Clear the form fields
        document.getElementById("registerForm").reset();
        console.log(data); // Log the response for debugging
        alert("User registered successfully!");
        // Redirect to the home page
        window.location.href = "login.html";
      })
      .catch((error) =>
        console.error("Error registering user:", error.message)
      );
  });
