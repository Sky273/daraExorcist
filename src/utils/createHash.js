// One-time script to generate hash for initial admin password
const password = "password";
const JWT_SECRET = "a-secure-random-string-for-jwt-signing1278586774546";

async function generateHash() {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + JWT_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Hashed password:', hashHex);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateHash();
