const readline = require('readline');



class GroupingMutation {
  constructor(length, width, pieces) {
    this.pi = this.generateNestedArray(length, width); // Initial 2D nested array
    this.n = this.pi.length; // Length of the array
    this.pieces = pieces; // Pieces to be placed
    this.sheetUsage = []; // Sheet usage information
  }

  generateNestedArray(length, width) {
    const nestedArray = [];
    for (let i = 0; i < length; i++) {
      const row = new Array(width).fill(' '); // Initialize all positions as empty
      nestedArray.push(row);
    }
    return nestedArray;
  }

  checkFit(sheet, cut) {
    return cut.length <= sheet.waste.length && cut.width <= sheet.waste.width;
  }

  placePiece(sheet, cut) {
    const piece = { length: cut.length, width: cut.width };
    sheet.cuts.push(piece);
    sheet.waste.length -= cut.length;
    sheet.waste.width -= cut.width;
  }

  rotatePiece(piece) {
    return { length: piece.width, width: piece.length };
  }

  calculateSheetUsage() {
    const sortedCuts = this.pieces.sort((a, b) => a.length * a.width - b.length * b.width);
    const sheets = [];

    for (const cut of sortedCuts) {
      let placed = false;

      for (const sheet of sheets) {
        if (this.checkFit(sheet, cut)) {
          this.placePiece(sheet, cut);
          placed = true;
          break;
        }
      }

      if (!placed) {
        const newSheet = this.createSheet();
        this.placePiece(newSheet, cut);
        sheets.push(newSheet);
      }
    }

    // Combine consecutive cuts within the same sheet
    for (const sheet of sheets) {
      const combinedCuts = [];
      let currentCut = sheet.cuts[0];

      for (let i = 1; i < sheet.cuts.length; i++) {
        const nextCut = sheet.cuts[i];

        if (currentCut.width === nextCut.width && currentCut.length + nextCut.length <= sheet.waste.length) {
          // Combine the current cut with the next cut
          currentCut.length += nextCut.length;
        } else {
          // Add the current cut to the combined cuts list
          combinedCuts.push(currentCut);
          currentCut = nextCut;
        }
      }

      // Add the last cut to the combined cuts list
      combinedCuts.push(currentCut);

      // Replace the cuts with the combined cuts
      sheet.cuts = combinedCuts;
    }

    this.sheetUsage = sheets;
    return this.sheetUsage;
  }

  createSheet() {
    return {
      cuts: [],
      waste: { length: this.pi.length, width: this.pi[0].length },
    };
  }
}

function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const totalLength = parseInt(await promptUser('Enter the total length: '));
  const totalWidth = parseInt(await promptUser('Enter the total width: '));

  let validPieces = false;
  let cutValues = [];
  let pieceCount = 1;

  while (!validPieces) {
    const cutLength = parseInt(await promptUser(`Enter the cut ${pieceCount} length: `));
    const cutWidth = parseInt(await promptUser(`Enter the cut ${pieceCount} width: `));

    if (cutLength > 0 && cutWidth > 0 && cutLength <= totalLength && cutWidth <= totalWidth) {
      cutValues.push({ length: cutLength, width: cutWidth });
      pieceCount++;

      const continuePrompt = await promptUser('Do you want to enter another cut? (Y/N) ');
      if (continuePrompt.toLowerCase() === 'n') {
        validPieces = true;
      }
    } else {
      console.log('Invalid cut values. Please try again.');
    }
  }

  const groupingMutation = new GroupingMutation(totalLength, totalWidth, cutValues);
  const sheetUsage = groupingMutation.calculateSheetUsage();

  console.log('Sheet Usage:');
  sheetUsage.forEach((sheet, index) => {
    console.log(`Sheet ${index + 1}:`);
    sheet.cuts.forEach((cut, cutIndex) => {
      console.log(`Cut ${cutIndex + 1}: ${cut.length}x${cut.width}`);
    });
    console.log(`Waste: ${sheet.waste.length}x${sheet.waste.width}`);
    console.log('------------------');
  });
  console.log(`Total Sheets: ${sheetUsage.length}`);
}
main();
