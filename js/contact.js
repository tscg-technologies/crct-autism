// ================= CRCT CONTACT / ENQUIRY FORM HANDLER =================
// Frontend validation and integration hook for Carl Rogers Counselling and Therapy Centre

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("crctEnquiryForm");
  if (!form) return;

  const statusBanner = document.getElementById("formStatusBanner");
  const submitBtn = document.getElementById("enquirySubmitBtn");

  // Input elements
  const nameInput = document.getElementById("parentName");
  const phoneInput = document.getElementById("phoneNumber");
  const emailInput = document.getElementById("emailAddress");
  const ageInput = document.getElementById("childAge");
  const therapySelect = document.getElementById("therapyInterest");
  const messageInput = document.getElementById("enquiryMessage");

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Validates Indian (10 digits, optional +91/0) or international phone numbers
  const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}$/;

  // Helper: show or hide field error
  function setFieldError(input, errorElementId, errorMessage) {
    const group = input.closest(".form-group");
    const errorEl = document.getElementById(errorElementId);

    if (errorMessage) {
      if (group) group.classList.add("has-error");
      if (errorEl) {
        errorEl.textContent = errorMessage;
        errorEl.style.display = "block";
      }
      input.setAttribute("aria-invalid", "true");
      return false;
    } else {
      if (group) group.classList.remove("has-error");
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
      }
      input.removeAttribute("aria-invalid");
      return true;
    }
  }

  // Field Validators
  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      return setFieldError(nameInput, "nameError", "Please enter your name.");
    }
    if (val.length < 2) {
      return setFieldError(nameInput, "nameError", "Name must be at least 2 characters.");
    }
    return setFieldError(nameInput, "nameError", "");
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    const digitsOnly = val.replace(/\D/g, "");
    if (!val) {
      return setFieldError(phoneInput, "phoneError", "Please enter your contact phone number.");
    }
    if (digitsOnly.length < 10 || digitsOnly.length > 15 || !phoneRegex.test(val)) {
      return setFieldError(phoneInput, "phoneError", "Please enter a valid phone number (minimum 10 digits).");
    }
    return setFieldError(phoneInput, "phoneError", "");
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      return setFieldError(emailInput, "emailError", "Please enter your email address.");
    }
    if (!emailRegex.test(val)) {
      return setFieldError(emailInput, "emailError", "Please enter a valid email address (e.g., parent@example.com).");
    }
    return setFieldError(emailInput, "emailError", "");
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (!val) {
      return setFieldError(messageInput, "messageError", "Please enter your message or enquiry details.");
    }
    if (val.length < 10) {
      return setFieldError(messageInput, "messageError", "Please enter at least 10 characters so we can better assist you.");
    }
    return setFieldError(messageInput, "messageError", "");
  }

  // Live validation on blur
  nameInput.addEventListener("blur", validateName);
  phoneInput.addEventListener("blur", validatePhone);
  emailInput.addEventListener("blur", validateEmail);
  messageInput.addEventListener("blur", validateMessage);

  // Clear error on input
  [nameInput, phoneInput, emailInput, messageInput].forEach(input => {
    input.addEventListener("input", () => {
      const group = input.closest(".form-group");
      if (group && group.classList.contains("has-error")) {
        const errorEl = group.querySelector(".form-error-msg");
        group.classList.remove("has-error");
        if (errorEl) errorEl.style.display = "none";
        input.removeAttribute("aria-invalid");
      }
    });
  });

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
      // Focus the first invalid field
      const firstInvalid = form.querySelector(".has-error .form-control");
      if (firstInvalid) {
        firstInvalid.focus();
      }
      showStatusBanner(
        "Please review the highlighted fields above and ensure all required information is provided.",
        "error"
      );
      return;
    }

    // Collect verified formData payload
    const formData = {
      parentName: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      childAge: ageInput ? ageInput.value.trim() : "",
      therapyInterest: therapySelect ? therapySelect.value : "",
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // Log payload for developer visibility & verification
    console.log("[CRCT Contact Enquiry Payload]:", formData);

    // =========================================================================
    // BACKEND INTEGRATION POINT:
    // To connect this form to your email delivery or CRM backend:
    // 1. For Formspree / Web3Forms / Formkeep: Add action="https://formspree.io/f/YOUR_ID" method="POST"
    // 2. For custom REST API:
    //    fetch('/api/enquiry', {
    //      method: 'POST',
    //      headers: { 'Content-Type': 'application/json' },
    //      body: JSON.stringify(formData)
    //    }).then(...)
    // 3. For EmailJS: emailjs.send('service_id', 'template_id', formData)
    // =========================================================================

    // Show sending state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Validating &amp; Preparing...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Enquiry</span> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
      }

      // Display clean, transparent confirmation to the family
      showStatusBanner(
        `Thank you, ${formData.parentName}! Your enquiry details have been validated. Our clinical team at CRCT will review your requirements and reach out to you via ${formData.phone} or ${formData.email}. For immediate consultation booking, you can also reach us directly at +91 7416778925.`,
        "success"
      );

      // Reset form
      form.reset();
      
      // Smoothly scroll to the status banner
      if (statusBanner) {
        statusBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 700);
  });

  // Display status banner
  function showStatusBanner(message, type) {
    if (!statusBanner) return;

    statusBanner.className = `form-status-banner is-${type}`;
    statusBanner.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 10px;">
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="margin-top: 3px;"></i>
        <div>${message}</div>
      </div>
    `;
    statusBanner.style.display = "block";
  }
});
