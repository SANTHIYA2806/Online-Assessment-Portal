const bcrypt = require("bcrypt");

async function generateHash() {
  const hash = await bcrypt.hash("Admin", 10);
  console.log(hash);
}

generateHash();



// const bcrypt = require("bcrypt");

// (async () => {
//   const ok = await bcrypt.compare(
//     "Admin",
//     "$2b$10$Wpvjp/QF4VgVHS3oDLOvMOpm7cE4XlGY.l9hI9on/ksSHLuPYGNgu"
//   );
//   console.log(ok);
// })();
