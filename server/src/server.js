const app = require("./app");

/*
  Serverio paleidimo failas.

  app.js faile mes susikuriam Express aplikaciją.
  server.js faile ją paleidžiam su app.listen().
*/

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

/*
  Unhandled promise rejection klaidos.

  Pvz. jeigu kažkur async kode įvyksta klaida,
  bet mes jos nepagaunam su try/catch arba catchAsync,
  tada Node gali mesti unhandledRejection.

  Čia gražiai išjungiam serverį.
*/
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION");
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

/*
  Uncaught exception klaidos.

  Pvz. jeigu kažkur kode yra rimta sinchroninė klaida.
  Tokios klaidos dažnai reiškia, kad aplikacija nebėra stabilios būsenos.
*/
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err.name, err.message);

  process.exit(1);
});