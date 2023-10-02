

    const outputContainer = document.getElementById('outputContainer');

    function addNewMatrix() {
    const id = ++lastUsedId; // Increment the ID
    let matrices = [];
    let linearArray = { id, matrices: [] }; // Linear array with parent ID

    function addMatrix() {
        let matrix = [[0, 0], [0, 0]];

        function askForElement(i, j) {
            const answer = prompt(`Enter element at position (${i + 1}, ${j + 1}):`);

            if (answer === null) {
                // User clicked "Cancel"
                alert('Matrix creation canceled.');
                create2DMatrix();
                return;
            }

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
                        const response = prompt('Do you want to add another matrix? (y/n):');
                        handleResponse(response);
                    }
                } else {
                    alert("Invalid input. Please enter a valid number.");
                    askForElement(i, j);
                }
            } catch (error) {
                alert("Error parsing input. Please enter a valid number.");
                askForElement(i, j);
            }
        }

        // Start asking for elements
        askForElement(0, 0);
    }

    // Function to handle the response
    function handleResponse(response) {
        if (response === null) {
            // User clicked "Cancel"
            alert('Matrix creation canceled.');
            create2DMatrix();
            return;
        }

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
        }
    }

    // Function to display the result
    function displayResult() {
        const outputContainer = document.getElementById('outputContainer');
        outputContainer.innerHTML = `<p>Array ID ${linearArray.id}:</p>`;
        outputContainer.innerHTML += '<p>Matrices:</p>';
        for (let i = 0; i < matrices.length; i++) {
            outputContainer.innerHTML += `<p>Matrix ${i + 1}:</p>`;
            for (let row of matrices[i]) {
                outputContainer.innerHTML += `<p>${row.join('\t')}</p>`;
            }
        }

        outputContainer.innerHTML += '<p>Linear Array:</p>';
        outputContainer.innerHTML += `<p>${JSON.stringify(linearArray)}</p>`;
    }

    // Start adding the first matrix
    addMatrix();
}
function displayMatricesAndArrays() {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = "<p>All Matrices and Linear Arrays:</p>";

    matricesArray.forEach((linearArray) => {
        let htmlContent = `<div class="linear-array">`;
        htmlContent += `<p>Linear Array ID ${linearArray.id}:</p>`;
        htmlContent += "<div class='matrix-container'>";

        linearArray.matrices.forEach((matrix, index) => {
            htmlContent += `<div class="matrix"><p>Matrix ${index + 1}:</p>`;
            matrix.forEach(row => {
                htmlContent += `<p>${row.join('\t')}</p>`;
            });
            htmlContent += '</div>';
        });

        htmlContent += '<p>Array Format:</p>';
        const linearArrayCopy = {
            id: linearArray.id,
            matrices: linearArray.matrices.map(matrix => matrix.map(row => [...row]))
        };
        htmlContent += `<p>${JSON.stringify(linearArrayCopy).replace(/\n|\r/g, '')}</p>`; // Array format inside the linear-array div

        htmlContent += '</div>'; // Close the matrix-container div
        htmlContent += '</div>'; // Close the linear-array div

        outputContainer.innerHTML += htmlContent;
    });

    // No need to add '</div>' here, it's added inside the loop

}

function showAllLinearArrays() {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = "<p>All Linear Arrays:</p>";

    matricesArray.forEach((linearArray) => {
        const linearArrayDiv = document.createElement('div');
        linearArrayDiv.classList.add('linear-array');
        linearArrayDiv.innerHTML = `<p>Linear Array ID ${linearArray.id}:</p>`;

        const linearArrayCopy = {
            id: linearArray.id,
            matrices: linearArray.matrices.map(matrix => matrix.map(row => [...row]))
        };

        const arrayFormatDiv = document.createElement('div');
        arrayFormatDiv.innerHTML = '<p>Array Format:</p>';
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(linearArrayCopy, null, 2).replace(/\n|/g, '');
        arrayFormatDiv.appendChild(preElement);

        linearArrayDiv.appendChild(arrayFormatDiv);
        outputContainer.appendChild(linearArrayDiv);
    });
}

function selectIndividualArray() {
    const id = parseInt(prompt('Enter the linear array ID to view:'));
    const matrixObj = matricesArray.find(obj => obj.id === id);

    if (matrixObj) {
        const linearArrayDiv = document.createElement('div');
        linearArrayDiv.classList.add('linear-array');
        linearArrayDiv.innerHTML = `<p>Linear Array ID: ${matrixObj.id}</p><p>Matrices:</p>`;

        matrixObj.matrices.forEach((matrix, index) => {
            const matrixDiv = document.createElement('div');
            matrixDiv.classList.add('matrix');
            matrixDiv.innerHTML = `<p>Matrix ${index + 1}:</p>`;

            matrix.forEach(row => {
                const rowElement = document.createElement('p');
                rowElement.textContent = row.join('\t');
                matrixDiv.appendChild(rowElement);
            });

            linearArrayDiv.appendChild(matrixDiv);
        });

        const arrayFormatDiv = document.createElement('div');
        arrayFormatDiv.innerHTML = '<p>Array Format:</p>';
        const preElement = document.createElement('pre');
        const matrixObjCopy = {
            id: matrixObj.id,
            matrices: matrixObj.matrices.map(matrix => matrix.map(row => [...row]))
        };
        preElement.textContent = JSON.stringify(matrixObjCopy, null, 2).replace(/\n|\r/g, '');
        arrayFormatDiv.appendChild(preElement);

        linearArrayDiv.appendChild(arrayFormatDiv);
        outputContainer.innerHTML = ''; // Clear previous content
        outputContainer.appendChild(linearArrayDiv);
    } else {
        outputContainer.innerHTML = '<p>Linear Array not found. Please enter a valid linear array ID.</p>';
    }
}

    function addMatrixToLinearArray() {
        const id = parseInt(prompt('Enter the linear array ID to which you want to add a matrix:'));
        const targetArray = matricesArray.find(obj => obj.id === id);

        if (targetArray) {
            let matrix = [[0, 0], [0, 0]];

            function askForElement(i, j) {
                const answer = prompt(`Enter element at position (${i + 1}, ${j + 1}):`);
                try {
                    const element = parseInt(answer.trim());
                    if (!isNaN(element)) {
                        matrix[i][j] = element;
                        if (j < 1) {
                            askForElement(i, j + 1);
                        } else if (i < 1) {
                            askForElement(i + 1, 0);
                        } else {
                            targetArray.matrices.push([...matrix]);
                            alert(`Matrix added to linear array ID ${id} successfully!`);
                        }
                    } else {
                        alert("Invalid input. Please enter a valid number.");
                        askForElement(i, j);
                    }
                } catch (error) {
                    alert("Error parsing input. Please enter a valid number.");
                    askForElement(i, j);
                }
            }

            askForElement(0, 0);
        } else {
            alert('Linear Array not found. Please enter a valid linear array ID.');
        }
    }

    function searchElement() {
        const searchNumber = parseInt(prompt('Enter a number to search:'));

        if (!isNaN(searchNumber)) {
            let found = false;
            let outputHTML = '';

            matricesArray.forEach((linearArray) => {
                const matrixArray = linearArray.matrices;
                let linearArrayPosition = 0;

                matrixArray.forEach((matrix, matrixIndex) => {
                    matrix.forEach((row, rowIndex) => {
                        row.forEach((element, colIndex) => {
                            if (element === searchNumber) {
                                linearArrayPosition = (matrixIndex * matrix.length + rowIndex) * row.length + colIndex + 1;
                                outputHTML += `<div class="matrix"><p>Matrix ${matrixIndex + 1}:</p>`;
                                matrix.forEach(row => {
                                    outputHTML += `<p>${row.join('\t')}</p>`;
                                });
                                outputHTML += '<p>Array Format:</p>';
                                const linearArrayCopy = {
                                    id: linearArray.id,
                                    matrices: linearArray.matrices.map(matrix => matrix.map(row => [...row]))
                                };
                                outputHTML += `<p>${JSON.stringify(linearArrayCopy).replace(/\n|\r/g, '')}</p>`;
                                outputHTML += `<p>Position in Linear Array: Linear Array ID ${linearArray.id}, Matrix ${matrixIndex + 1}, Element Index: ${linearArrayPosition}.</p></div>`;
                                found = true;
                            }
                        });
                    });
                });
            });

            outputHTML = found ? outputHTML : `<p>Number ${searchNumber} not found in any matrices.</p>`;
            outputContainer.innerHTML = outputHTML;
        } else {
            alert('Invalid input. Please enter a valid number.');
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('matricesArray', JSON.stringify(matricesArray));
    }

    const matricesArray = localStorage.getItem('matricesArray') ? JSON.parse(localStorage.getItem('matricesArray')) : [];
    let lastUsedId = matricesArray.length > 0 ? matricesArray[matricesArray.length - 1].id : 0;

    if (matricesArray.length === 0) {
        matricesArray.push({ id: ++lastUsedId, matrices: [] });
        saveToLocalStorage();
    }
