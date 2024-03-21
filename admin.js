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
    })
    .catch((error) => console.error("Error fetching users:", error));
}

// Add event listener to the table body to handle checkbox changes
document
  .querySelector("#userTable tbody")
  .addEventListener("change", function (event) {
    const checkbox = event.target;
    const userId = checkbox.dataset.userId;
    const checkboxesInRow = checkbox.parentElement.querySelectorAll(
      'input[type="checkbox"]'
    );

    if (checkbox.checked) {
      checkboxesInRow.forEach((cb) => {
        if (cb !== checkbox) {
          cb.disabled = true;
        }
      });

      // Perform the corresponding action
      if (checkbox.classList.contains("approveCheckbox")) {
        approveUser(userId);
      } else if (checkbox.classList.contains("disapproveCheckbox")) {
        disapproveUser(userId);
      } else if (checkbox.classList.contains("suspendCheckbox")) {
        suspendUser(userId);
      } else if (checkbox.classList.contains("deleteCheckbox")) {
        deleteUser(userId);
      } else if (checkbox.classList.contains("resetCheckbox")) {
        resetPassword(userId);
      }
    } else {
      // Enable all checkboxes in the row if the clicked checkbox is unchecked
      checkboxesInRow.forEach((cb) => {
        cb.disabled = false;
      });
    }
  });

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
      // Refresh user table after the action is completed
      fetchDataAndPopulateUserTable();
    })
    .catch((error) =>
      console.error("Error logging user action:", error.message)
    );
}

// Function to handle server errors
function handleServerError(error, action) {
  console.error(`Error ${action} user:`, error.message);
  // Display error message to the user (optional)
  //alert(`Error ${action} user: ${error.message}`);
}
