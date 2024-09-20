document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');

    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            profileDiv.innerHTML = `
                <h2>${data.login}</h2>
                <img id="userAvatar" src="${data.avatar_url}" alt="${data.login}'s avatar" width="100">
                <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <p><strong>Followers:</strong> ${data.followers}</p>
                <p><strong>Following:</strong> ${data.following}</p>
                <a href="${data.html_url}" target="_blank">View Profile</a>
                <br>
                <button id="downloadBtn">Download Avatar</button>
            `;

            // Add download functionality
            document.getElementById('downloadBtn').addEventListener('click', function() {
                const avatarUrl = data.avatar_url;
                const link = document.createElement('a');
                link.href = avatarUrl;
                link.download = `${data.login}-avatar.png`;
                link.click();
            });
        })
        .catch(error => {
            profileDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
});
