// let isLoggedIn = true;
const isLoggedIn = localStorage.getItem("token") !== null;

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
