// search.js
function fetchAndDisplayFiles() {
  fetch('http://localhost:3000/files')
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching file:', error);
    });
}

function searchFiles() {
  const searchBar = document.querySelector('#searchBar');
  const fileList = document.getElementById('fileListItems');

  searchBar.addEventListener('input', (e) => {
    const searchString = e.target.value.toLowerCase();
    const files = fileList.querySelectorAll('li');
    files.forEach(file => {
      if (file.textContent.toLowerCase().includes(searchString)) {
        file.style.display = 'list-item';
      } else {
        file.style.display = 'none';
      }
    });
  });
}

// Call the functions
fetchAndDisplayFiles();
searchFiles();
