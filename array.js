const readline = require('readline');
const LocalStorage = require('node-localstorage').LocalStorage;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs');

const localStorage = new LocalStorage('./scratch');
let matricesArray = [];
let lastUsedId = 0;

function saveToLocalStorage() {
    const matricesArrayJSON = JSON.stringify(matricesArray);
    localStorage.setItem('matricesArray', matricesArrayJSON);
    localStorage.setItem('lastUsedId', lastUsedId.toString());
}

function loadFromLocalStorage() {
    const matricesArrayJSON = localStorage.getItem('matricesArray');
    if (matricesArrayJSON) {
        matricesArray = JSON.parse(matricesArrayJSON);
    }

    const lastUsedIdString = localStorage.getItem('lastUsedId');
    lastUsedId = lastUsedIdString ? parseInt(lastUsedIdString) : 0;
}

// Load matricesArray and lastUsedId from local storage on program start
loadFromLocalStorage();

// Function to create a 2x2 matrix and store in a linear array
function create2DMatrix() {
    rl.question('1. Add a new matrix\n2. Show all matrices and linear arrays\n3. Show all linear arrays\n4. Show individual array\n5. Add matrices to a specified array\n6. Search matrices\n7. Exit\nEnter your choice: ', (choice) => {
        switch (parseInt(choice)) {
            case 1:
                addNewMatrix();
                break;
            case 2:
                displayMatricesAndArrays();
                break;
            case 3:
                showAllLinearArrays();
                break;
            case 4:
                selectIndividualArray();
                break;
            case 5:
                addMatrixToLinearArray();
                break;
            case 6:
                searchElement();
                break;
            case 7:
                saveToLocalStorage(); // Save to local storage before exiting
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please enter a valid option.');
                create2DMatrix();
                break;
        }
    });
}

function addNewMatrix() {
    const id = ++lastUsedId; // Increment the ID
    let matrices = [];
    let linearArray = { id, matrices: [] }; // Linear array with parent ID

    function addMatrix() {
        let matrix = [[0, 0], [0, 0]];

        function askForElement(i, j) {
            rl.question(`Enter element at position (${i + 1}, ${j + 1}): `, (answer) => {
                try {
                    const element = parseInt(answer.trim());
                    if (!isNaN(element)) {
                        matrix[i][j] = element;

                        if (j < 1) {
                            askForElement(i, j + 1);
                        } else if (i < 1) {
                            askForElement(i + 1, 0);
                        } else {
                            // Add the new matrix to both the matrices array and the linear array
                            matrices.push([...matrix]);
                            linearArray.matrices.push({ ...matrix, parentId: id });

                            // Reset the matrix for the next iteration
                            matrix = [[0, 0], [0, 0]];

                            rl.question('Do you want to add another matrix? (y/n): ', handleResponse);
                        }
                    } else {
                        console.log("Invalid input. Please enter a valid number.");
                        askForElement(i, j);
                    }
                } catch (error) {
                    console.log("Error parsing input. Please enter a valid number.");
                    askForElement(i, j);
                }
            });
        }

        // Start asking for elements
        askForElement(0, 0);
    }

    // Start adding the first matrix
    addMatrix();
}







function displayMatricesAndArrays() {
    console.log("All Matrices and Linear Arrays:");
    matricesArray.forEach((matrixObj) => {
        console.log(`Array ID ${matrixObj.id}:`);

        // Display matrices
        console.log("Matrices:");
        matrixObj.matrices.forEach((matrix, index) => {
            console.log(`Matrix ${index + 1}:`);
            matrix.forEach(row => {
                console.log(row.join('\t'));
            });
            console.log(); // Add a new line for better separation
        });




        // // Display linear array
        console.log("Linear Array:");
        console.log(JSON.stringify(matrixObj.linearArray));
        
        console.log(); // Add a new line for better separation
    });

    create2DMatrix();
}

function showAllLinearArrays() {
    console.log("All Linear Arrays:");

    matricesArray.forEach((matrixObj) => {
        console.log(`Linear Array ID ${matrixObj.id}:`);

        const linearArray = matrixObj.matrices.map(matrix => matrix.map(row => [...row]));

        console.log('Array Format:');
        console.log(JSON.stringify(linearArray, null, 2).replace(/\n|\r/g, ''));

        console.log(); // Add a new line for better separation
    });

    create2DMatrix();
}





// function showIndividualLinearArray() {
//     rl.question('Enter the linear array ID to display: ', (id) => {
//         id = parseInt(id);
//         const matrixObj = matricesArray.find(obj => obj.id === id);
//         if (matrixObj) {
//             const linearArr = matrixObj.matrices;
//             console.log(`Linear Array ID ${id}: [${linearArr.map(arr => arr.id).join(', ')}]`);
//         } else {
//             console.log('Linear Array not found. Please enter a valid linear array ID.');
//         }
//         create2DMatrix();
//     });
// }

function selectIndividualArray() {
    rl.question('Enter the linear array ID to view: ', (id) => {
        id = parseInt(id);
        const matrixObj = matricesArray.find(obj => obj.id === id);
        if (matrixObj) {
            console.log(`Linear Array ID: ${matrixObj.id}`);
            console.log("Matrices:");
            matrixObj.matrices.forEach((matrix, index) => {
                console.log(`Matrix ${index + 1}:`);
                matrix.forEach(row => {
                    console.log(row.join('\t'));
                });
                console.log(); // Add a new line for better separation
            });
        } else {
            console.log('Linear Array not found. Please enter a valid linear array ID.');
        }
        create2DMatrix();
    });
}

function addMatrixToLinearArray() {
    rl.question('Enter the linear array ID to which you want to add a matrix: ', (id) => {
        id = parseInt(id);
        const targetArray = matricesArray.find(obj => obj.id === id);

        if (targetArray) {
            // Array found, now ask for the elements of the new matrix
            let matrix = [[0, 0], [0, 0]];

            // Reuse the askForElement function
            function askForElement(i, j) {
                rl.question(`Enter element at position (${i + 1}, ${j + 1}): `, (answer) => {
                    try {
                        const element = parseInt(answer.trim());
                        if (!isNaN(element)) {
                            matrix[i][j] = element;

                            if (j < 1) {
                                askForElement(i, j + 1);
                            } else if (i < 1) {
                                askForElement(i + 1, 0);
                            } else {
                                // Add the new matrix to the specified array
                                targetArray.matrices.push([...matrix]);

                                console.log(`Matrix added to linear array ID ${id} successfully!`);
                                create2DMatrix();
                            }
                        } else {
                            console.log("Invalid input. Please enter a valid number.");
                            askForElement(i, j);
                        }
                    } catch (error) {
                        console.log("Error parsing input. Please enter a valid number.");
                        askForElement(i, j);
                    }
                });
            }

            // Start asking for elements
            askForElement(0, 0);
        } else {
            console.log('Linear Array not found. Please enter a valid linear array ID.');
            create2DMatrix();
        }
    });
}

function searchElement() {
    rl.question('Enter a number to search: ', (searchNumber) => {
        searchNumber = parseInt(searchNumber);

        if (!isNaN(searchNumber)) {
            let found = false;

            for (let i = 0; i < matricesArray.length; i++) {
                const matrixArray = matricesArray[i].matrices;
                for (let j = 0; j < matrixArray.length; j++) {
                    const matrix = matrixArray[j];
                    for (let row = 0; row < matrix.length; row++) {
                        for (let col = 0; col < matrix[row].length; col++) {
                            if (matrix[row][col] === searchNumber) {
                                console.log(`Number ${searchNumber} found in matrix at position (${row + 1}, ${col + 1}) of linear array ID ${matricesArray[i].id}, matrix ${j + 1}.`);
                                found = true;
                            }
                        }
                    }
                }
            }

            if (!found) {
                console.log(`Number ${searchNumber} not found in matrices.`);
            }
        } else {
            console.log('Invalid input. Please enter a valid number.');
        }

        // Display all matrices after the search
        displayMatrices(matricesArray);

        create2DMatrix();
    });
}





function displayMatrices(matricesArray) {
    console.log("Matrices:");
    matricesArray.forEach((matrixObj) => {
        const matrix = matrixObj.matrix;
        console.log(`Array ID ${matrixObj.id}:`);
        matrix.forEach(row => {
            console.log(row.join('\t'));
        });
        console.log(); // Add a new line for better separation
    });
}


// Start the program
create2DMatrix();
