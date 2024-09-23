document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const downloadBtn = document.getElementById('downloadBtn');

    // Clear previous profile content and hide the profile div initially
    profileDiv.innerHTML = '';
    profileDiv.style.display = 'none';
    downloadBtn.style.display = 'none';

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
                <img src="${data.avatar_url}" alt="${data.login}'s avatar" width="100">
                <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
                <h3 id="contributionsText">Contributions:</h3>
                <img id="contributionChart" src="https://ghchart.rshah.org/${username}" alt="${data.login}'s contributions" style="border-radius: 0; box-shadow: none; width: 100%; max-width: 600px;" />
            `;
            profileDiv.style.display = 'block'; // Show profile card
            downloadBtn.style.display = 'block'; // Show download button
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>No data!</p>`;
            profileDiv.style.display = 'block'; // Show the message
            downloadBtn.style.display = 'none'; // Hide download button
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const contributionChart = document.getElementById('contributionChart');
    const contributionsText = document.getElementById('contributionsText');

    // Hide the contribution chart and its text before downloading
    contributionChart.style.display = 'none';
    contributionsText.style.display = 'none';

    // Check if the contribution chart has loaded
    contributionChart.onload = function() {
        html2canvas(document.getElementById('profile'), { useCORS: true }).then(function(canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'github_profile.png';
            link.click();

            // Show the contribution chart and its text again after downloading
            contributionChart.style.display = 'block';
            contributionsText.style.display = 'block';
        });
    };

    // If the image is already loaded, trigger the onload function
    if (contributionChart.complete) {
        contributionChart.onload();
    }
});
