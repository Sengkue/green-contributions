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
            profileDiv.innerHTML = `
                <h2>${data.login}</h2>
                <img src="${data.avatar_url}" alt="${data.login}'s avatar" width="100">
                <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
                <h3>Contributions:</h3>
                <img src="https://ghchart.rshah.org/${username}" alt="${data.login}'s contributions" style="border-radius: 0; box-shadow: none; width: 100%; max-width: 600px;" />
            `;
            downloadBtn.style.display = 'block';
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const contributionChart = document.querySelector('#profile img:last-of-type');
    const chartSrc = contributionChart.src; // Store the original source
    contributionChart.style.display = 'block'; // Show it temporarily

    // Create a temporary image element to avoid CORS issues
    const tempImg = new Image();
    tempImg.crossOrigin = 'Anonymous'; // Set cross-origin for the temporary image
    tempImg.src = chartSrc;

    tempImg.onload = function() {
        // Append to body for capturing
        document.body.appendChild(tempImg);
        html2canvas(document.getElementById('profile'), { useCORS: true }).then(function(canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'github_profile.png';
            link.click();
            
            // Clean up
            document.body.removeChild(tempImg);
            contributionChart.style.display = 'none'; // Hide original contribution chart
        });
    };

    tempImg.onerror = function() {
        console.error('Could not load the contribution chart for download.');
        contributionChart.style.display = 'none'; // Hide original if there's an error
    };
});
