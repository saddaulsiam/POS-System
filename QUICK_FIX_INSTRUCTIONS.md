# IMMEDIATE FIX - Copy and Paste This

## Open Browser Console (Press F12) and run:

```javascript
// Step 1: Clear everything
localStorage.clear();
sessionStorage.clear();

// Step 2: Verify it's cleared
console.log("User:", localStorage.getItem("user"));
console.log("Token:", localStorage.getItem("token"));
// Both should show: null

// Step 3: Reload page
location.href = "/login";
```

## Then Login Again

1. Username: `admin`
2. Password: (your admin password)
3. After login, go to `/loyalty-admin`

---

## If Still Getting 403 Error

The backend might be checking the wrong field. Let me check what the admin user ID is and verify the token is being
decoded correctly.

**Try this in browser console AFTER logging in again:**

```javascript
// Check your current user data
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

console.log("User Object:", user);
console.log("User Role:", user?.role);
console.log("Token:", token);

// Decode the JWT token manually
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const tokenData = parseJwt(token);
console.log("Token Data:", tokenData);
console.log("Token User ID:", tokenData.userId);
```

**Send me the output!** This will show if the token has the correct role after fresh login.
