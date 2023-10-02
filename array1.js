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
                            // Add the new matrix to the temporary array
                            matrices.push(matrix.map(row => [...row]));

                            // Reset the matrix for the next iteration
                            matrix = [[0, 0], [0, 0]];

                            // Check if the user wants to add another matrix
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

    // Function to handle the response
    function handleResponse(response) {
        if (response.trim().toLowerCase() === 'y') {
            // If the user wants to add another matrix, continue adding
            addMatrix();
        } else {
            // If the user is done, push the collected matrices into linearArray.matrices
            linearArray.matrices = matrices;

            // Save the linear array to local storage
            matricesArray.push(linearArray);
            saveToLocalStorage();

            // Display the result
            displayResult();

            // Close the readline interface
            rl.close();
        }
    }

    // Function to display the result
    function displayResult() {
        console.log(`Array ID ${linearArray.id}:`);
        console.log('Matrices:');
        for (let i = 0; i < matrices.length; i++) {
            console.log(`Matrix ${i + 1}:`);
            for (let row of matrices[i]) {
                console.log(row.join('\t'));
            }
            console.log();
        }

        console.log('Linear Array:');
        console.log(JSON.stringify(linearArray));
    }

    // Start adding the first matrix
    addMatrix();
    
}




function displayMatricesAndArrays() {
    console.log("All Matrices and Linear Arrays:");

    matricesArray.forEach((linearArray) => {
        console.log(`Linear Array ID ${linearArray.id}:`);

        // Display matrices
        console.log("Matrices:");
        linearArray.matrices.forEach((matrix, index) => {
            console.log(`Matrix ${index + 1}:`);
            matrix.forEach(row => {
                console.log(row.join('\t'));
            });
          
            console.log(); // Add a new line for better separation
        });
          // show respec linear array
          console.log('Array Format:');
          const linearArrayCopy = {
            id: linearArray.id,
            matrices: linearArray.matrices.map(matrix => matrix.map(row => [...row]))
        };
          console.log(JSON.stringify(linearArrayCopy).replace(/\n|\r/g, ''));
    

        console.log(); // Add a new line for better separation
    });

    create2DMatrix();
}



function showAllLinearArrays() {
    console.log("All Linear Arrays:");

    matricesArray.forEach((linearArray) => {
        console.log(`Linear Array ID ${linearArray.id}:`);

        const linearArrayCopy = {
            id: linearArray.id,
            matrices: linearArray.matrices.map(matrix => matrix.map(row => [...row]))
        };

        console.log('Array Format:');
        console.log(JSON.stringify(linearArrayCopy, null, 2).replace(/\n|\r/g, ''));

        console.log(); // Add a new line for better separation
    });

    create2DMatrix();
}






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
                    // show respective linear array
  
                });
                console.log(); 
                // Add a new line for better separation
            });
        } else {
            console.log('Linear Array not found. Please enter a valid linear array ID.');
        }
        // show the resp id linear array
        console.log('Array Format:');
        const matrixObjCopy = {
            id: matrixObj.id,
            matrices: matrixObj.matrices.map(matrix => matrix.map(row => [...row]))
        };
        console.log(JSON.stringify(matrixObjCopy, null, 2).replace(/\n|\r/g, ''));
        console.log(); // Add a new line for better separation

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
            // Retrieve matricesArray from local storage
            const matricesArray = localStorage.getItem('matricesArray') ? JSON.parse(localStorage.getItem('matricesArray')) : [];

            let found = false;

            // Search every matrix in every linear array
            matricesArray.forEach((linearArray) => {
                const matrixArray = linearArray.matrices;
                let linearArrayPosition = 0;

                matrixArray.forEach((matrix, matrixIndex) => {
                    matrix.forEach((row, rowIndex) => {
                        row.forEach((element, colIndex) => {
                            if (element === searchNumber) {
                                // Calculate linear array position
                                linearArrayPosition = (matrixIndex * matrix.length + rowIndex) * row.length + colIndex + 1;

                               
                                // Display the searched element in the matrix
                                console.log(`Matrix ${matrixIndex + 1}:`);
                                matrix.forEach(row => {
                                    console.log(row.join('\t'));
                                });
                                console.log(); // Add a new line for better separation
                                console.log('Array Format:');
                                const linearArrayCopy = {
                                    id: linearArray.id,
                                    matrices: linearArray.matrices.map(matrix => matrix.map(row => [...row]))
                                };
                                console.log(JSON.stringify(linearArrayCopy).replace(/\n|\r/g, ''));
                                // Display the position in linear array
                                console.log(`Position in Linear Array: Linear Array ID ${linearArray.id}, Matrix ${matrixIndex + 1}, Element Index: ${linearArrayPosition}.`);
                                console.log(); // Add a new line for better separation
                               
                                found = true;
                            }
                        });
                    });
                });
            });

            if (!found) {
                console.log(`Number ${searchNumber} not found in any matrices.`);
            }
        } else {
            console.log('Invalid input. Please enter a valid number.');
        }

        create2DMatrix();
    });
}




// Start the program
create2DMatrix();
