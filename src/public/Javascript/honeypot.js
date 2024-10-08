document.addEventListener('DOMContentLoaded', () => {
    const fileDatabase = [
        { name: 'Client_Contracts', type: 'Folder', size: '5.0 MB', modified: '2024-09-11 10:00:00' },
        { name: 'Payment_Records', type: 'Folder', size: '3.5 MB', modified: '2024-09-10 15:20:00' },
        { name: 'Client_IDs.csv', type: 'File', size: '200 KB', modified: '2024-09-10 12:30:00' },
        { name: 'Court_Files', type: 'Folder', size: '8.2 MB', modified: '2024-09-09 14:22:37' },
        { name: 'Case_001_Documentation.pdf', type: 'File', size: '350 KB', modified: '2024-09-08 16:00:00' },
        { name: 'Client_Payment_History.xlsx', type: 'File', size: '500 KB', modified: '2024-09-07 09:45:00' },
        { name: 'Court_Orders_2024.docx', type: 'File', size: '150 KB', modified: '2024-09-06 11:15:00' },
        { name: 'Client_Contact_List.txt', type: 'File', size: '30 KB', modified: '2024-09-05 13:10:00' }
    ];

    const fileTbody = document.getElementById('file-tbody');
    const searchInput = document.getElementById('file-search');
    const currentUserElement = document.getElementById('current-user');

    let currentUser = 'User';

    const renderFiles = (files) => {
        fileTbody.innerHTML = '';
        files.forEach((file, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="file-checkbox" data-index="${index}"> <img src="${file.type === 'Folder' ? 'foldericon.png' : 'fileicon.png'}" alt="${file.type} Icon" class="icon"> ${file.name}</td>
                <td>${file.type}</td>
                <td>${file.size || '--'}</td>
                <td>${file.modified || '--'}</td>
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
            fileDatabase.push({ name: folderName, type: 'Folder', size: '0 MB', modified: now });
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
