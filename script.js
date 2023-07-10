// Declare variables
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');
const submit = document.querySelector('#submit');
const register = document.querySelector('#register');
const mandatory = document.querySelectorAll('.formInput');

// This is to still keep the data that was already saved in the local storage even if the webpage has been refreshed
let registrationArr = JSON.parse(localStorage.getItem('userList')) || []; 

// Function to show error message
function showError(inputField, errorMessage) {
  const formField = inputField.parentElement;
  const errorMsg = formField.querySelector('small');
  formField.classList.add('error');
  errorMsg.textContent = errorMessage;
}

// Function to remove error message
function removeError(inputField) {
  const formField = inputField.parentElement;
  const errorMsg = formField.querySelector('small');
  formField.classList.remove('error');
  errorMsg.textContent = '';
}

// Function to validate the form
function validateForm(e) {
  e.preventDefault();
  let inputField = true;

  // Check first name
  if (firstName.value.trim() === '') {
    showError(firstName, 'Please enter your first name.');
    firstName.classList.add('is-invalid');
    inputField = false;
  } else {
    removeError(firstName);
  }

  // Check last name
  // The trim() method removes whitespace from both the beginning and end of a string
  if (lastName.value.trim() === '') {
    showError(lastName, 'Please enter your last name.');
    lastName.classList.add('is-invalid');
    inputField = false;
  } else {
    removeError(lastName);
  }

  /* Explanation for valid email 
  ^          asserts the start of the string.
  [^\s@]+    matches one or more characters that are not whitespace or "@".
  @          matches the "@" symbol.
  [^\s@]+    matches one or more characters that are not whitespace or "@".
  \.         matches the "." symbol.
  (?:gmail\.com|yahoo\.com)      is a non-capturing group that matches either "gmail.com" or "yahoo.com".
  $          asserts the end of the string.
  /i         at the end makes the regular expression case-insensitive.
  
  So, this regular expression ensures that the email format follows these rules:

  It must have characters before and after the "@" symbol.
  The domain must be either "gmail.com" or "yahoo.com".
  For example, it will match email addresses like "john@example.com" or "jane@gmail.com" but will not match email addresses like "johndoe@gmail.net" or "user@yahoo.co.uk".
  */

  // Check email format
  const emailValue = email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailValue)) {
    showError(email, 'Please enter a valid email address.');
    email.classList.add('is-invalid');
    inputField = false;
  } else {
    removeError(email);
  }

  // Check password
  const passwordValue = password.value;
  const passwordErrorMessage = validation(passwordValue);
  if (passwordErrorMessage) {
    showError(password, passwordErrorMessage);
    password.classList.add('is-invalid');
    inputField = false;
  } else {
    removeError(password);
  }

  // Check confirm password
  if (confirmPassword.value !== passwordValue) {
    showError(confirmPassword, 'Passwords do not match.');
    confirmPassword.classList.add('is-invalid');
    inputField = false;
  } else {
    removeError(confirmPassword);
  }

  // Check if email already exists
  const emailExists = registrationArr.some(user => user.email === emailValue);
  if (emailExists) {
    showError(email, 'Email already exists.');
    inputField = false;
  }

  if (inputField) {
    const registrationObj = {
      id: Date.now(),
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    // To push the collected infos inside the array
    registrationArr.push(registrationObj);
    localStorage.setItem('userList', JSON.stringify(registrationArr));

    // Clear form fields after successful registration
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';

    alert('Registration successful!');
  }
}

// Function to check password requirements
function validation(passwordValue) {
  if (passwordValue === '') {
    return 'Password must not be empty.';
  } else if (passwordValue.length < 8) {
    return 'Password must be at least 8 characters long.';
  } else if (!/\d/.test(passwordValue)) {
    return 'Password must contain at least one number.';
  } else if (!/[a-z]/.test(passwordValue)) {
    return 'Password must contain at least one lowercase letter.';
  } else if (!/[A-Z]/.test(passwordValue)) {
    return 'Password must contain at least one uppercase letter.';
  } else if (!/[^A-Za-z0-9]/.test(passwordValue)) {
    return 'Password must contain at least one special character.';
  } else {
    return null;
  }
}

// Function to remove the error every nect sign up
function refresh(inputField) {
  if (inputField.value !== '') {
    removeError(inputField);
    inputField.classList.remove('is-invalid'); // To remove the style
  }
}

// Attach event listener to the submit button
register.addEventListener('submit', (e) => {
  e.preventDefault();
  validateForm(e);

  // These are to call the resfresh function so that whenever the inputField returns true, the error style will be removed
  refresh(firstName);
  refresh(lastName);
  refresh(email);
  refresh(password);
  refresh(confirmPassword);
});