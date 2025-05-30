// Calculate age from DOB
document.getElementById("dob").addEventListener("change", function () {
  const dob = new Date(this.value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  document.getElementById("age").value = age >= 0 ? age : 0;
});

// Speech-to-text functionality
function startDictation(fieldId) {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const result = event.results[0][0].transcript;
    const field = document.getElementById(fieldId);

    if (!field) return;

    if (fieldId === "dob") {
      try {
        const parsedDate = new Date(result);
        if (!isNaN(parsedDate)) {
          const yyyy = parsedDate.getFullYear();
          const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
          const dd = String(parsedDate.getDate()).padStart(2, "0");
          const formatted = `${yyyy}-${mm}-${dd}`;
          field.value = formatted;
          field.dispatchEvent(new Event("change"));
        } else {
          alert("Could not understand the date. Please try again.");
        }
      } catch (e) {
        alert("Invalid date format.");
      }
    } else if (field.tagName === "SELECT") {
      const match = Array.from(field.options).find(
        (option) => option.text.toLowerCase() === result.toLowerCase()
      );
      if (match) {
        field.value = match.value;
      }
    } else {
      field.value = result;
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
}


// Tab navigation logic
function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((el) =>
    el.classList.remove("active")
  );
  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".tab").forEach((el) =>
    el.classList.remove("active")
  );

  switch (tabId) {
    case "customer-info":
      document.querySelector(".tab:nth-child(1)").classList.add("active");
      break;
    case "address-details":
      document.querySelector(".tab:nth-child(2)").classList.add("active");
      break;
    case "product-interest":
      document.querySelector(".tab:nth-child(3)").classList.add("active");
      break;
    case "document-checklist":
      document.querySelector(".tab:nth-child(4)").classList.add("active");
      break;
  }
}

// Attach mic functionality after DOM loads
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".input-with-mic").forEach((group) => {
    const input = group.querySelector("input, select");
    const micBtn = group.querySelector(".mic-btn");

    if (micBtn && input && input.id) {
      micBtn.addEventListener("click", () => startDictation(input.id));
    }
  });
});
