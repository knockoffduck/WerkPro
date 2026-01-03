const { Client, Databases } = require('appwrite');
try {
  const client = new Client();
  const db = new Databases(client);
  console.log('Has createRow:', typeof db.createRow === 'function');
  console.log('Has createDocument:', typeof db.createDocument === 'function');
  console.log('DB Prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(db)));
} catch (e) {
  console.error(e);
}
