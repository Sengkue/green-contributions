document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const downloadBtn = document.getElementById('downloadBtn');

    // Fetch GitHub user details
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            // Display the user profile details along with the contribution chart
            profileDiv.innerHTML = `
                <h2>${data.login}</h2>
                <img src="${data.avatar_url}" alt="${data.login}'s avatar" width="100">
                <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
                <h3>Contributions:</h3>
                <img src="https://ghchart.rshah.org/${username}" alt="${data.login}'s contributions" class="contribution-chart" />
            `;
            downloadBtn.style.display = 'block'; // Show the download button
        })
        .catch(error => {
            // Show error message if user not found
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none'; // Hide download button on error
        });
});

// Function to download the profile section as an image
document.getElementById('downloadBtn').addEventListener('click', function() {
    html2canvas(document.getElementById('profile'), { useCORS: true }).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'github_profile.png'; // Set download name
        link.click(); // Trigger download
    });
});
