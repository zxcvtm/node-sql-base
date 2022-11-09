const generateDatabaseDateTime = (date) => {
  return date.toISOString().replace("T"," ").substring(0, 19);
}
module.exports = {generateDatabaseDateTime}