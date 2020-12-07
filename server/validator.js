const maxLength = 50;
const checkEmail = (email) => {
  if (email) {
    const email_pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email.match(email_pattern))
      return true;
  }
  return false;
}

const checkPassword = (password) => {
  if (password.length > 0 && password.length <= maxLength)
    return true;
  return false;
}

const checkId = (id) => {
  if (id > 0 && id.toString().length === 9)
    return true;
  return false;
}

const checkString = (value) => {
  if (value.length > 0 && value.length <= maxLength)
    return true;
  return false;
}

const checkPrice = (value) => {
  if (value > 0 && !isNaN(value))
    return true;
  return false;
}

module.exports = { checkEmail, checkPassword, checkId, checkString, checkPrice };

