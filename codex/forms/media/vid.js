document.getElementById('addVideo').addEventListener('click', function() {
    document.getElementById('videoUploadSection').style.display = 'flex';
});

document.getElementById('closevideoUploadSection').addEventListener('click', function() {
    document.getElementById('videoUploadSection').style.display = 'none';
});

function toggleDescription(id) {
    var description = document.getElementById(id);
    if (description.style.display === "none" || description.style.display === "") {
        description.style.display = 'block';
    } else {
        description.style.display = 'none';
    }
}

function displayVideo(input) {
    var videoBox = document.getElementById('videoBox');
    var file = input.files[0];
    var url = URL.createObjectURL(file);
    
    // Create a new video element
    var video = document.createElement('video');
    video.id = 'uploadedVideo';
    video.src = url;
    video.controls = true;
    video.controlsList = 'nodownload';
    video.className = 'responsive-video';

    // Clear any existing content in the box and add the new video element
    videoBox.innerHTML = '';
    videoBox.appendChild(video);

    // Show the video box
    videoBox.style.display = 'flex';

    // Show the next button
    document.getElementById('nextButton').style.display = 'block';

    // Process and display frames
    video.addEventListener('loadeddata', function() {
        captureFrames(video);
    });
}

function displayThumbnail(input) {
    var thumbnailBox = document.getElementById('thumbnailBox');
    var file = input.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        // Create a new img element
        var img = document.createElement('img');
        img.id = 'chosenThumbnail';
        img.src = e.target.result;
        img.alt = 'Thumbnail';
        img.className = 'responsive-thumbnail';
        
        // Clear any existing content in the box and add the new img element
        thumbnailBox.innerHTML = '';
        thumbnailBox.appendChild(img);

        // Show the thumbnail box
        thumbnailBox.style.display = 'flex';
    }
    
    reader.readAsDataURL(file);
}

function goToNext() {
    // Change the circle's color to green and font to white
    var circle = document.getElementById('circle1');
    circle.classList.add('active');

    // Hide circle-1 content including the paragraph
    document.getElementById('circle1Content').style.display = 'none';
    document.querySelector('.step-1').style.display = 'none';

    // Show circle-2 content
    document.getElementById('circle2Content').style.display = 'block';
    document.querySelector('.step-2').style.display = 'block';
}

function showCircleContent(circleNumber) {
    // Hide all circle contents
    var circleContents = document.querySelectorAll('.circle-content');
    circleContents.forEach(function(content) {
        content.style.display = 'none';
    });

    // Hide all step paragraphs
    var stepParagraphs = document.querySelectorAll('.step-1, .step-2');
    stepParagraphs.forEach(function(paragraph) {
        paragraph.style.display = 'none';
    });

    // Show the selected circle content
    var selectedCircleContent = document.getElementById('circle' + circleNumber + 'Content');
    if (selectedCircleContent) {
        selectedCircleContent.style.display = 'block';
    }

    // Show the appropriate step paragraph
    var selectedStepParagraph = document.querySelector('.step-' + circleNumber);
    if (selectedStepParagraph) {
        selectedStepParagraph.style.display = 'block';
    }
}
function captureFrames(video) {
    var frameBox = document.getElementById('frameContainer');
    frameBox.innerHTML = ''; // Clear any existing frames

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var interval = 5; // Time interval in seconds between frames
    var duration = video.duration;
    var currentTime = 0;
    var frameCount = 0;

    video.currentTime = currentTime;

    video.addEventListener('seeked', function capture() {
        if (currentTime < duration) {
            // Set canvas size to video size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Create an image element
            var img = document.createElement('img');
            img.src = canvas.toDataURL('image/jpeg');
            img.className = 'frame-box-img';
            img.dataset.time = currentTime; // Store the frame time in data attribute

            // Add single click event listener
            img.addEventListener('click', function() {
                video.currentTime = img.dataset.time;
            });

            // Add double click event listener
            img.addEventListener('dblclick', function() {
                video.currentTime = img.dataset.time;
                video.play();
            });

            // Append the frame to the frame container
            frameBox.appendChild(img);
            frameCount++;

            // Increment current time by interval and seek to the new time
            currentTime += interval;
            video.currentTime = currentTime;
        } else {
            video.removeEventListener('seeked', capture);

            // Check if there are more frames than can be displayed in the visible area
            if (frameCount > 5) { // Adjust this number based on how many frames fit without scrolling
                // Display scroll buttons
                document.getElementById('prevFrame').style.visibility = 'visible';
                document.getElementById('nextFrame').style.visibility = 'visible';
            } else {
                // Hide scroll buttons
                document.getElementById('prevFrame').style.visibility = 'hidden';
                document.getElementById('nextFrame').style.visibility = 'hidden';
            }
        }
    });
}

function prevFrame() {
    var frameContainer = document.getElementById('frameContainer');
    frameContainer.scrollLeft -= 100; // Adjust scroll amount as needed
}

function nextFrame() {
    var frameContainer = document.getElementById('frameContainer');
    frameContainer.scrollLeft += 100; // Adjust scroll amount as needed
}
