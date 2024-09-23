document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const downloadBtn = document.getElementById('downloadBtn');

    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            // Fetch the GitHub contributions chart as a Blob
            fetch(`https://ghchart.rshah.org/${username}`)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        const base64data = reader.result;
                        // Inject profile and contribution chart (Base64 format) into the DOM
                        profileDiv.innerHTML = `
                            <h2>${data.login}</h2>
                            <img src="${data.avatar_url}" alt="${data.login}'s avatar" width="100">
                            <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                            <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                            <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                            <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
                            <h3>Contributions:</h3>
                            <img src="${base64data}" alt="${data.login}'s contributions" style="border-radius: 0; box-shadow: none; width: 100%; max-width: 600px;" />
                        `;
                        downloadBtn.style.display = 'block';
                    };
                    reader.readAsDataURL(blob); // Convert blob to base64
                });
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    html2canvas(document.getElementById('profile'), { useCORS: true }).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'github_profile.png';
        link.click();
    });
});
