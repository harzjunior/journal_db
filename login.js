// Handle user login
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const loginUsernameInput = document.getElementById("loginUsername");
    const loginPasswordInput = document.getElementById("loginPassword");
    const errorMessages = document.getElementById("errorMessages");

    const loginUsername = loginUsernameInput.value;
    const loginPassword = loginPasswordInput.value;

    // Clear any existing error messages
    errorMessages.innerHTML = "";

    // Send a POST request to authenticate the user
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginUsername,
        loginPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // Display error message
          errorMessages.innerHTML = "Invalid username or password.";

          // Add a class to the input fields when authentication fails
          loginUsernameInput.classList.add("error");
          loginPasswordInput.classList.add("error");

          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the server sends a token upon successful login
        const token = data.token;
        // Store the token securely (e.g., in localStorage) for future authenticated requests
        localStorage.setItem("token", token);

        // Optional: Redirect to a different page or update UI for authenticated user
        console.log("User logged in successfully!");

        // Clear the input fields and remove the error class and messages
        loginUsernameInput.value = "";
        loginPasswordInput.value = "";
        loginUsernameInput.classList.remove("error");
        loginPasswordInput.classList.remove("error");
        errorMessages.innerHTML = "";

        // Clear the input fields
        document.getElementById("loginForm").reset();

        // Reload the page to fetch updated data and show book input fields
        // location.reload(true);

        // Redirect to the home page
        window.location.href = "index.html";
      })
      .catch((error) => console.error("Error logging in:", error.message));
  });
