// Search functionality
document
  .getElementById("searchInput")
  .addEventListener("input", function (event) {
    const searchTerm = event.target.value.trim().toLowerCase();

    // Fetch data from the server and filter based on the search term
    fetch("/journals")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.querySelector("#journalTable tbody");
        tableBody.innerHTML = ""; // Clear existing table rows

        data.forEach((journal) => {
          // Check if the book title contains the search term
          if (journal.journal_title.toLowerCase().includes(searchTerm)) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${journal.journal_id}</td><td>${journal.journal_title}</td><td>${journal.journal_total_page}</td>
              <td>${journal.rating}</td><td>${journal.isbn}</td><td>${journal.published_date}</td><td>${journal.publisher_id}</td>`;
            tableBody.appendChild(row);
          }
        });
      })
      .catch((error) =>
        console.error("Error fetching and filtering data:", error)
      );
  });
