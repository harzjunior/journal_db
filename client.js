const isLoggedIn = true;

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
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// If the user is authenticated, fetch data and show book input fields
if (isLoggedIn) {
  fetchDataAndPopulateTable();
}
