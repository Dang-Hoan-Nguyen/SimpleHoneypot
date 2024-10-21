document.addEventListener('DOMContentLoaded', () => {
    const fileDatabase = [
        { name: 'John Doe', type: 'Not important', contact: 'someone@somewhere.com', attachment: '/jd.txt' },
        { name: 'Bilbo', type: 'Real estate litigation', contact: 'someone@somewhere.com', attachment: '/bb.txt' },
        { name: 'Someone else', type: 'Real estate litigation', contact: 'someone@somewhere.com', attachment: '/se.txt' },
        { name: 'A', type: 'Cilvil dispute', contact: 'someone@somewhere.com', attachment: '/a.txt' },
        { name: 'Thorin', type: 'Contract Breach', contact: 'someone@somewhere.com', attachment: '/t.txt' },
        { name: 'Alice and Bob', type: 'Data leak', contact: 'someone@somewhere.com', attachment: '/anb.txt' },
    ];

    const fileTbody = document.getElementById('file-tbody');
    const searchInput = document.getElementById('file-search');
    const currentUserElement = document.getElementById('current-user');

    let currentUser = 'User';

    const renderFiles = (files) => {
        // fileTbody.innerHTML = '';
        files.forEach((file, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${file.name}</td>
                <td>${file.type}</td>
                <td>${file.contact || '--'}</td>
                <td><a style="cursor: pointer;" href=${file.attachment}>${file.attachment || '--'}</a></td>
            `;
            fileTbody.appendChild(row);
        });
    };

    const searchFiles = () => {
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm === 'login:winnieadmin') {
            currentUser = 'Admin';
            currentUserElement.textContent = 'Admin';
            alert('Access level elevated to Admin');
        }

        const filteredFiles = fileDatabase.filter(file => file.name.toLowerCase().includes(searchTerm));
        renderFiles(filteredFiles);
    };

    const createFolder = () => {
        const folderName = prompt('Enter the name of the new folder:');
        if (folderName) {
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            fileDatabase.push({ name: folderName, type: 'Folder', contact: '0 MB', attachment: now });
            renderFiles(fileDatabase);
        }
    };

    const deleteSelected = () => {
        const selected = document.querySelectorAll('input[type="checkbox"]:checked');
        selected.forEach(checkbox => {
            const index = checkbox.getAttribute('data-index');
            fileDatabase.splice(index, 1);
        });
        renderFiles(fileDatabase);
    };

    const handleFileClick = (event) => {
        event.preventDefault();
        const fileName = event.target.getAttribute('data-name');
        alert(`Simulating download of ${fileName}`);
        // Simulate a download or open action here
        // For a real application, you might handle file downloads or opens differently
    };

    // Bind the search function to the search button click
    document.querySelector('button').addEventListener('click', searchFiles);

    // Bind the search function to the Enter key
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchFiles();
        }
    });

    // Bind the create folder function to the button click
    document.querySelector('.file-actions button:nth-of-type(1)').addEventListener('click', createFolder);

    // Bind the delete selected function to the button click
    document.querySelector('.file-actions button:nth-of-type(2)').addEventListener('click', deleteSelected);

    // Bind the file click handler
    fileTbody.addEventListener('click', (event) => {
        if (event.target.closest('.file-link')) {
            handleFileClick(event);
        }
    });

    // Initial render of all files
    renderFiles(fileDatabase);
});
