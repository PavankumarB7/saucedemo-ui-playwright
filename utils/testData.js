export const users = {
  standard: {
    username: "standard_user",
    password: "secret_sauce",
  },
  lockedOut: {
    username: "locked_out_user",
    password: "secret_sauce",
  },
  invalid: {
    username: "invalid_user",
    password: "wrong_password",
  },
};

export const errorMessages = {
  lockedOut: "Epic sadface: Sorry, this user has been locked out.",
  invalidCredentials:
    "Epic sadface: Username and password do not match any user in this service",
  usernameRequired: "Epic sadface: Username is required",
  passwordRequired: "Epic sadface: Password is required",
};

export const checkoutInfo = {
  firstName: "Test",
  lastName: "User",
  zipCode: "12345",
};
