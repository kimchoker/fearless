import admin, { ServiceAccount } from "firebase-admin";

let adminDb: admin.database.Database | null = null;

if (!admin.apps.length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    // privateKey: (process.env.PRIVATE_KEY! as string).replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL!,
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCdG4OOJCy7ezoX\n8RDPmtDhRSK+OKqNUqTwccB9Q+KjyqqWHfvgIc0/RGbqIE6RMPN3RCdsgN5wF4np\n7ZUMixflpSFkeDXiCyHP9av7gwmxReqrsz1nWvEBT4PgOpR+kc8OCzNO78DTkyMj\ng7W+vSF+9hHieJaK2GQchG4knlNDOaA/SOQGwaemzr6s6OENrHzCaE3ycvReIs0B\ncNq6scjGHwbvwlKu56ubv+Ea82VX8R0uJggg6rVuVmH50nlvrJ3si2HPgzUMC3N+\n35x/UtKXbL0dLAy6ES163iaNyIQ12bp49gFaET0HLPCfTKJ2t/0lUU+fcjnqp3tZ\nCMl6d3WBAgMBAAECggEABAsp5r8Ci9skLbrininJotUqe6lyJhHWoQHIAM9eJE2k\naCmGlrxO+9gKEzBEfmkbaJZHcpvy4bEg541558MmGOcAC+26Qw6K2tcrm20yEwMB\n8yQxdj0zcRd5nSwrz5HHmcim9AMAqD9oFPdENpf4BmRNZboZY5KmCbv8uN5+dY9K\nJmvGnaa1E1lrsr6tOKcXdqF50bZl7TT3wEfnAqnZ/ALYe6IH/50eZwlG+6aBZ+g7\npAVEY9CT0tTahhGpqD44jCbnMNueVa0IOWVnnw0XBTY8rA5g3QvZfOjKMDU6ByUW\nU9jvT3YsFq+HTL9oIPNpZ7fhWK2nhAueUlTZdV4/YQKBgQDQPFWpygcbBxvwDJD8\nEuUC0H0uq1lxuVZHGUZHurmUT1hg0sdPL9b3hxtw74zBV9pQz7Tlx9czU2zwGi7j\nMmxhNlAcBPqARdXYZd9ZtFcErhR0ev08i+hw4ac0x2Wa4ldyUvrebUHm/Z8EBGDD\n8dn0fNSeyKvGDYgteONF2xHb4QKBgQDBJOoupIvO5TMO83SbhqI39CNGSqNRjyee\ncQAHtsbJYQmIPecRwnEsaM78vxeeILoElZX00bo+Iahc6HmVd10OuLvVtC1XQScJ\nejLUkEiaPaHQar3nrsFVp9A5ogNH0k2qQyWo55+8H4O6wTiUExUUyN2CWKVnbl4w\njwYsNEnNoQKBgQCimVoymGRwAF8aVFWp338fcXkuRfIz0QrDvcKZI/7hBgv2nt+u\nv6ZV5hPRXdxE5Lq+O1H/0soBc/UujuNp2Oe0CNsI5gJMwzs2HGYI/76rEts6EQdI\njd7Utf8AQWrfRDoQNSdbI2lAW24djuWYW3Nba1YDHqKypcJd73VYCLWrQQKBgQCo\nifHgKa3mKJLZZRBH9r/vW5a8a70AGo9T7v87u/7TE14iCQJtuOLRAdQ9MPMHBT/N\naEqmi6ydMvmbuTD/gF0vz3v5C3TVQwExf/SDEDSKg2WEXODCHviOKhXFdN6v+Y/U\nFyvxq8zzd/yXJqycadpnfK/uYjRTgTen3+ZfBHGygQKBgQC6nWZr+WyLc1eSxXTx\nPBcNfGyb+MDYzUiWnAQuO5K5nDv9me+qO9aFoBA+UghlQPO3KZmP3j3OAzCcyoJW\nlG0oV/Z18o4XLb0JUdYLQ4lJFgyZacvKK4zDyyCWIOEPRf67r3t0c63krpky+zIs\nWE4Lz4tNuqDv1u0nDiZIxHRgZA==\n-----END PRIVATE KEY-----\n"
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  });
  console.log("Firebase Admin Apps:", admin.apps.length);


  adminDb = admin.database();
} else {
  adminDb = admin.app().database();
}

export default adminDb;

