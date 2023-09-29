const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to create a 2x2 matrix and store in a linear array
function create2DMatrix() {
    let matricesArray = [];

    function askForElement(i, j, matrix, linearArray) {
        rl.question(`Enter element at position (${i + 1}, ${j + 1}): `, (answer) => {
            try {
                const element = parseInt(answer.trim());
                if (!isNaN(element)) {
                    matrix[i][j] = element;
                    linearArray.push(element);

                    if (j < 1) {
                        askForElement(i, j + 1, matrix, linearArray);
                    } else if (i < 1) {
                        askForElement(i + 1, 0, matrix, linearArray);
                    } else {
                        matricesArray.push([...matrix]); // Save a copy of the matrix
                        console.log("Original Matrix:", matrix);
                        console.log("Linear Array:", linearArray);

                        rl.question('Do you want to create another matrix? (y/n): ', (response) => {
                            if (response.toLowerCase() === 'y') {
                                askForElement(0, 0, [[0, 0], [0, 0]], []);
                            } else {
                                console.log('Matrices Array:', matricesArray);
                                rl.question('Enter a number to search: ', (searchNumber) => {
                                    searchNumber = parseInt(searchNumber);
                                    if (!isNaN(searchNumber)) {
                                        searchNumberInMatrices(searchNumber, matricesArray);
                                        searchNumberInLinearArray(searchNumber, matricesArray);
                                        rl.close();
                                    } else {
                                        console.log('Invalid input. Please enter a valid number.');
                                        rl.close();
                                    }
                                });
                            }
                        });
                    }
                } else {
                    console.log("Invalid input. Please enter a valid number.");
                    askForElement(i, j, matrix, linearArray);
                }
            } catch (error) {
                console.log("Error parsing input. Please enter a valid number.");
                askForElement(i, j, matrix, linearArray);
            }
        });
    }

    function searchNumberInMatrices(searchNumber, matricesArray) {
        let found = false;

        for (let i = 0; i < matricesArray.length; i++) {
            for (let row = 0; row < matricesArray[i].length; row++) {
                for (let col = 0; col < matricesArray[i][row].length; col++) {
                    if (matricesArray[i][row][col] === searchNumber) {
                        console.log(`Number ${searchNumber} found in matrix at position (${row + 1}, ${col + 1}) of matrix ${i + 1}.`);
                        found = true;
                    }
                }
            }
        }

        if (!found) {
            console.log(`Number ${searchNumber} not found in matrices.`);
        }
    }

    function searchNumberInLinearArray(searchNumber, matricesArray) {
        let found = false;

        for (let i = 0; i < matricesArray.length; i++) {
            const linearArr = matricesArray[i].flat();
            for (let j = 0; j < linearArr.length; j++) {
                if (linearArr[j] === searchNumber) {
                    console.log(`Number ${searchNumber} found in linear array of matrix ${i + 1} at position ${j + 1}.`);
                
                    found = true;
                }
            }
        }

        if (!found) {
            console.log(`Number ${searchNumber} not found in linear arrays.`);
        }
    }

    // Start asking for elements
    askForElement(0, 0, [[0, 0], [0, 0]], []);
}

// Prompt user to create the first matrix
create2DMatrix();
