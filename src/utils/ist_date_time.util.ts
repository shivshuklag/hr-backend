function getCurrentDateTimeIST() {
  // Get the current time in UTC
  const now = new Date();

  // Convert UTC time to IST (UTC + 5:30)
  const offsetIST = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istTime = new Date(now.getTime() + offsetIST);

  return istTime;
}
