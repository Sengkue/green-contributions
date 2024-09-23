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
