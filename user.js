//Users functionality
function fetchDataAndPopulateUserTable() {
  fetch("/users") // Use the appropriate endpoint to fetch user data
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      populateUserTable(data);
    })
    .catch((error) =>
      console.error("Error fetching user data:", error.message)
    );
}

const userTable = document.getElementById("userTable");

function populateUserTable(userData) {
  userTable.innerHTML = ""; // Clear existing table rows

  userData.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${user.id}</td>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.status}</td>
              <td>
                  <button onclick="approveUser(${user.id})" class="approve">Approve</button>
                  <button onclick="disapproveUser(${user.id})" class="disapprove">Disapprove</button>
                  <button onclick="suspendUser(${user.id})" class="suspend">Suspend</button>
                  <button onclick="deleteUser(${user.id})" class="delete">Delete</button>
                  <button onclick="resetPassword(${user.id})" class="reset">Reset Password</button>
              </td>
          `;
    userTable.appendChild(row);
  });
}
