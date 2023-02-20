const fs = require('fs/promises');
const path = require('path');

exports.saveGame = (saveData) => {
  console.log(`-----`);
  console.log(`Saving...`);
  console.log(`-----`);
  return fs
    .writeFile(
      path.join(__dirname, '.', 'data', 'save-data.json'),
      JSON.stringify(saveData, null, 2)
    )
    .then(() => {
      console.log(`Saved!\n\n`);
      return true;
    });
};
