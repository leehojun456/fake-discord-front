export const emailHide = (email, bool) => {
  if (!email) return "";
  if (bool) {
    const [username, domain] = email.split("@");
    const hiddenUsername = "*".repeat(username.length);
    return `${hiddenUsername}@${domain}`;
  } else {
    return email;
  }
};
