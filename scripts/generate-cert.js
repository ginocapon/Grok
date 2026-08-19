const selfsigned = require("selfsigned");
const fs = require("fs");
const path = require("path");

const certDir = path.join(__dirname, "..", "certificates");
const keyPath = path.join(certDir, "localhost-key.pem");
const certPath = path.join(certDir, "localhost.pem");

async function main() {
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  const pems = await selfsigned.generate(
    [{ name: "commonName", value: "localhost" }],
    {
      keySize: 2048,
      days: 365,
      algorithm: "sha256",
      extensions: [
        {
          name: "subjectAltName",
          altNames: [
            { type: 2, value: "localhost" },
            { type: 2, value: "127.0.0.1" },
            { type: 7, ip: "127.0.0.1" },
          ],
        },
      ],
    }
  );

  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);

  console.log("Certificati HTTPS generati in certificates/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
