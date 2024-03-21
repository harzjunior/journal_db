// admin.js

document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndPopulateUserTable();
});

// Function to fetch and populate user table
function fetchDataAndPopulateUserTable() {
  fetch("/users")
    .then((response) => response.json())
    .then((data) => {
      const userTableBody = document.querySelector("#userTable tbody");
      userTableBody.innerHTML = ""; // Clear existing rows

      // Populate the user table body with the fetched user data
      data.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
              <td>${user.user_id}</td>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>${new Date(user.created_at).toISOString().split("T")[0]}</td>
              <td>${new Date(user.updated_at).toISOString().split("T")[0]}</td>
              <td>
              <span>✓</span>
              <input type="checkbox" class="approveCheckbox" data-user-id="${
                user.user_id
              }" />
              <span>✗</span>
              <input type="checkbox" class="disapproveCheckbox" data-user-id="${
                user.user_id
              }" />
              <span>⏸️</span>
              <input type="checkbox" class="suspendCheckbox" data-user-id="${
                user.user_id
              }" />
              <span>🗑️</span>
              <input type="checkbox" class="deleteCheckbox" data-user-id="${
                user.user_id
              }" />
              <span>↻</span>
              <input type="checkbox" class="resetCheckbox" data-user-id="${
                user.user_id
              }" />
              </td>
            `;
        userTableBody.appendChild(row);
      });

      // Add event listeners to handle admin actions
      document.querySelectorAll(".approveCheckbox").forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            approveUser(this.dataset.userId);
          }
        });
      });

      document.querySelectorAll(".disapproveCheckbox").forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            disapproveUser(this.dataset.userId);
          }
        });
      });

      document.querySelectorAll(".suspendCheckbox").forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            suspendUser(this.dataset.userId);
          }
        });
      });

      document.querySelectorAll(".deleteCheckbox").forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            deleteUser(this.dataset.userId);
          }
        });
      });

      document.querySelectorAll(".resetCheckbox").forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            resetPassword(this.dataset.userId);
          }
        });
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

// Call the function to fetch and populate user table
fetchDataAndPopulateUserTable();

// Appropriate server-side routes actions
function approveUser(userId) {
  fetch(`/approve-user/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      console.log(`User with ID ${userId} approved successfully.`);
      // Log the action on the server
      logUserAction(userId, "approve");
      fetchDataAndPopulateUserTable(); // Refresh user table after approval
    })
    .catch((error) => console.error("Error approving user:", error.message));
}

function disapproveUser(userId) {
  fetch(`/disapprove-user/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      console.log(`User with ID ${userId} disapproved successfully.`);
      // Log the action on the server
      logUserAction(userId, "disapprove");
      fetchDataAndPopulateUserTable(); // Refresh user table after disapproval
    })
    .catch((error) => console.error("Error disapproving user:", error.message));
}

function suspendUser(userId) {
  fetch(`/suspend-user/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      console.log(`User with ID ${userId} suspended successfully.`);
      // Log the action on the server
      logUserAction(userId, "suspend");
      fetchDataAndPopulateUserTable(); // Refresh user table after suspension
    })
    .catch((error) => console.error("Error suspending user:", error.message));
}

function deleteUser(userId) {
  fetch(`/delete-user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      console.log(`User with ID ${userId} deleted successfully.`);
      // Log the action on the server
      logUserAction(userId, "delete");
      fetchDataAndPopulateUserTable(); // Refresh user table after deletion
    })
    .catch((error) => console.error("Error deleting user:", error.message));
}

function resetPassword(userId) {
  fetch(`/reset-password/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      console.log(`Password for user with ID ${userId} reset successfully.`);
      // Log the action on the server
      logUserAction(userId, "reset_password");
      fetchDataAndPopulateUserTable(); // Refresh user table after password reset
    })
    .catch((error) =>
      console.error("Error resetting password:", error.message)
    );
}

// Function to log user actions
function logUserAction(userId, action) {
  fetch(`/log-user-action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ userId, action }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      console.log(
        `Action ${action} for user with ID ${userId} logged successfully.`
      );
    })
    .catch((error) =>
      console.error("Error logging user action:", error.message)
    );
}
