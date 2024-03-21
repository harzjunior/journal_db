// const auth = require("./isAuthenticated");

// const isLoggedIn = auth.isLoggedIn;

// // let isLoggedIn = true;
const isLoggedIn = localStorage.getItem("token") !== null;

//================================================toggle-nav================================================

function toggleButtonsVisibility(loggedIn) {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loggedIn) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
}

// Set initial visibility of buttons
toggleButtonsVisibility(isLoggedIn);

if (isLoggedIn) {
  document.getElementById("authenticatedContent").style.display = "block";
}

// Show add journal input fields when "Post journal" button is clicked
document
  .getElementById("postJournalBtn")
  .addEventListener("click", function () {
    // Check if the user is logged in before showing the form
    if (isLoggedIn) {
      // Toggle the visibility of the add book form
      const addJournalForm = document.getElementById("addJournalForm");
      addJournalForm.style.display =
        addJournalForm.style.display === "none" ? "block" : "none";
    } else {
      // If the user is not logged in, you can redirect to the login page or perform other actions
      document.getElementById("postJournalBtn").style.display = "none";
      alert("Please log in or create an account to post a journal.");
      // Alternatively, you can redirect to the login page
      // window.location.href = "/login"; // Replace "/login" with your login page URL
    }
  });

//================================================journals================================================

// Fetch data from the server and populate the table
function fetchDataAndPopulateTable() {
  fetch("/journals")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#journalTable tbody");
      tableBody.innerHTML = ""; // Clear existing rows

      data.forEach((journal) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${journal.journal_id}</td><td>${
          journal.journal_title
        }</td><td>${journal.journal_total_page}</td>
            <td>${journal.rating}</td><td>${journal.isbn}</td><td>${
          new Date(journal.published_date).toISOString().split("T")[0]
        }</td><td>${journal.publisher_id}</td>`;
        tableBody.appendChild(row);
      });

      // Calculate required data
      const totalJournals = data.length;
      const journalsByPages = data
        .slice()
        .sort((a, b) => a.journal_total_page - b.journal_total_page);
      const journalWithLeastPages = journalsByPages[0].journal_total_page;
      const journalWithMostPages =
        journalsByPages[journalsByPages.length - 1].journal_total_page;
      const totalPublishers = [
        ...new Set(data.map((journal) => journal.publisher_id)),
      ].length;
      const journalRatings = data.map((journal) => journal.rating);
      const journalWithLeastRating = Math.min(...journalRatings);
      const journalWithAverageRating =
        journalRatings.reduce((acc, val) => acc + val, 0) /
        journalRatings.length;
      const journalWithHighestRating = Math.max(...journalRatings);
      const publishedDates = data.map(
        (journal) => new Date(journal.published_date)
      );
      const earliestPublishedDate = new Date(Math.min(...publishedDates))
        .toISOString()
        .split("T")[0];
      const latestPublishedDate = new Date(Math.max(...publishedDates))
        .toISOString()
        .split("T")[0];

      // Populate container
      const currentDateElement = document.querySelector(".container-left code");
      const totalJournalsElement = document.querySelectorAll(
        ".container-left code"
      )[1];
      const journalWithLeastPagesElement = document.querySelectorAll(
        ".container-left code"
      )[2];
      const journalWithMostPagesElement = document.querySelectorAll(
        ".container-left code"
      )[3];
      const totalPublishersElement = document.querySelectorAll(
        ".container-left code"
      )[4];
      const journalWithLeastRatingElement = document.querySelectorAll(
        ".container-right code"
      )[0];
      const journalWithAverageRatingElement = document.querySelectorAll(
        ".container-right code"
      )[1];
      const journalWithHighestRatingElement = document.querySelectorAll(
        ".container-right code"
      )[2];
      const earliestPublishedDateElement = document.querySelectorAll(
        ".container-right code"
      )[3];
      const latestPublishedDateElement = document.querySelectorAll(
        ".container-right code"
      )[4];

      // Update container with calculated data
      currentDateElement.textContent = new Date().toISOString().split("T")[0];
      totalJournalsElement.textContent = totalJournals;
      journalWithLeastPagesElement.textContent = journalWithLeastPages;
      journalWithMostPagesElement.textContent = journalWithMostPages;
      totalPublishersElement.textContent = totalPublishers;
      journalWithLeastRatingElement.textContent =
        journalWithLeastRating.toFixed(1);
      journalWithAverageRatingElement.textContent =
        journalWithAverageRating.toFixed(1);
      journalWithHighestRatingElement.textContent =
        journalWithHighestRating.toFixed(1);
      earliestPublishedDateElement.textContent = earliestPublishedDate;
      latestPublishedDateElement.textContent = latestPublishedDate;
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// If the user is authenticated, fetch data and show book input fields
if (isLoggedIn) {
  fetchDataAndPopulateTable();
}

//===============================================logout=================================================

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Clear the token from localStorage
  localStorage.removeItem("token");

  // Set visibility of buttons after logout
  toggleButtonsVisibility(false);

  // Reload the page to fetch updated data and show book input fields
  location.reload(true);
});

//===============================================logout=================================================

// Handle form submission
document
  .getElementById("addJournalForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Check if the user is logged in before allowing book addition
    if (!isLoggedIn) {
      alert("Please log in or create an account to add a book.");
      return;
    }

    const title = document.getElementById("title").value;
    const totalPages = document.getElementById("totalPages").value;
    const rating = document.getElementById("rating").value;
    const isbn = document.getElementById("isbn").value;
    const publishedDate = document.getElementById("publishedDate").value;
    const publisher = document.getElementById("publisher").value;

    // Send a POST request to add the new book
    fetch("/journals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        totalPages,
        rating,
        isbn,
        publishedDate,
        publisher,
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
        document.getElementById("addJournalForm").reset();

        // remove success notification message
        const successMessage = document.getElementById("successMessage");
        successMessage.classList.remove("hidden");

        successMessage.style.display = "block";

        // Refresh the book list
        fetchDataAndPopulateTable();

        // Hide success notification message after 2 seconds
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 2000);
      })
      .catch((error) =>
        console.error("Error adding new journal:", error.message)
      );
  });
