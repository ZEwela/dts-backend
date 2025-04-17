export const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

export const handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request." });
  } else if (err.code === "22007") {
    return res.status(400).send({ msg: "Invalid timestamp format." });
  } else {
    next(err);
  }
};

export function handleServerError(err, req, res, next) {
  console.log("Error: ", err);
  res.status(500).send({ msg: "Internal Server Error." });
}
