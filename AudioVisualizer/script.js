const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileUpload');

let audioSource;
let analyser;
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rotationAngle = 0;

file.addEventListener('change',function(){
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    const audioCtx = new AudioContext();
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();

    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 64 * 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;


    function updateRotation() {
        rotationAngle += 0.1; 
        if (rotationAngle >= Math.PI * 2) {
            rotationAngle -= Math.PI * 2; 
        }
    }

    function animate() {
        let ctx = canvas.getContext('2d');
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
    
        var colourProfile = document.getElementById("colourProfile").value;
        var barWidth = canvas.width / bufferLength;
        let barHeight;
        let x = 0;
    
        if (colourProfile === "profile4") {
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 3.3;
            var innerRadius = 100; 
            var outerRadius = Math.min(canvas.width, canvas.height) / 2;
        
            var maxBarHeight = Math.max(...dataArray);

            ctx.strokeStyle = 'rgba(50, 100, 120)';
            ctx.lineWidth = 100; 

            for (let i = 0; i < bufferLength; i++) {
                var angle = (i / bufferLength) * Math.PI * 2;
                var normalizedValue = dataArray[i] / maxBarHeight; // Normalize the value
                var barLength = normalizedValue * (outerRadius - innerRadius) + innerRadius; // Adjust bar length to create a ring shape

                var particleX = centerX + Math.cos(angle) * barLength;
                var particleY = centerY + Math.sin(angle) * barLength;

                ctx.beginPath();
                ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            }

            } else if (colourProfile === "profile3") {
                    
                    const barWidth = canvas.width / bufferLength;
                    const triangleWidth = barWidth * 25; 
                    let barHeight;
                    let x = 0;
                
                    for (let i = 0; i < bufferLength; i++) {
                        barHeight = (dataArray[i] * 2);
                
                        let red, green, blue;
                        red = 10 - barHeight;
                        green = barHeight;
                        blue = 255 - barHeight;
                
                        var y1 = canvas.height - barHeight;
                        var y2 = canvas.height - barHeight - 20; 
                        var x3 = x + triangleWidth / 2;
                        var x1 = x3 - triangleWidth / 2; 
                        var x2 = x3 + triangleWidth / 2;

                        var rotatedX1 = Math.cos(rotationAngle) * (x1 - x3) - Math.sin(rotationAngle) * (y1 - y2) + x3;
                        var rotatedY1 = Math.sin(rotationAngle) * (x1 - x3) + Math.cos(rotationAngle) * (y1 - y2) + y2;
                        var rotatedX2 = Math.cos(rotationAngle) * (x2 - x3) - Math.sin(rotationAngle) * (y1 - y2) + x3;
                        var rotatedY2 = Math.sin(rotationAngle) * (x2 - x3) + Math.cos(rotationAngle) * (y1 - y2) + y2;
                        var rotatedX3 = x3;
                        var rotatedY3 = y2;

                        ctx.beginPath();
                        ctx.moveTo(rotatedX1, rotatedY1);
                        ctx.lineTo(rotatedX2, rotatedY2);
                        ctx.lineTo(rotatedX3, rotatedY3);
                        ctx.closePath();
                        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
                        ctx.fill();
                
                        x += barWidth;
                    }
                } else if(colourProfile === "profile2") {
                    
                    
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    analyser.getByteFrequencyData(dataArray);
                    const waveAmplitude = Math.max(...dataArray); 

                    const waveSpeed = 0.005; 
                    const waveFrequency = 0.02; 
                    const waveOffset = performance.now() * waveSpeed;

                    ctx.beginPath();
                    ctx.moveTo(0, canvas.height); 

                    for (let x = 0; x < canvas.width; x += 5) {
                        const normalizedIndex = Math.floor(x / canvas.width * bufferLength);
                        const normalizedValue = dataArray[normalizedIndex] / 255; 
                        const y = canvas.height - 100 + Math.sin(x * waveFrequency + waveOffset) * waveAmplitude * normalizedValue;
                        ctx.lineTo(x, y); 
                    }

                    ctx.lineTo(canvas.width, canvas.height); 
                    ctx.lineTo(0, canvas.height); 
                    ctx.closePath();

                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    gradient.addColorStop(0, '#FF6347'); 
                    gradient.addColorStop(0.5, '#FFD700'); 
                    gradient.addColorStop(1, '#87CEEB'); 

                    ctx.fillStyle = gradient; 
                    ctx.fill(); 
                } else {

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] * 2);
    
                let red, green, blue;
                switch (colourProfile) {
                    case "profile1":
                        red = 255;
                        green = 255;
                        blue = 255;
                        break;
                    default:
                        red = 255;
                        green = 255;
                        blue = 255;
                        break;
                }
                ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += (barWidth);
            }
        }
        updateRotation();
        requestAnimationFrame(animate);
    }
    
    animate();
    canvas.style.zIndex = "2";
})

function changeColourProfile (){
    var colourProfile = document.getElementById("colourProfile").value;
    var themeContainer = document.getElementById("themeContainer");
    var videoContainer = document.getElementById("profile4-video-container");
    var audioControls = document.getElementById("audio-controls");

    canvas.classList.remove('profile1','profile2','profile3','profile4');

    canvas.classList.add(colourProfile);

    switch (colourProfile) {
        case "profile1":
            themeContainer.style.backgroundColor = "#fff"; 
            themeContainer.style.color = "black";
            audioControls.style.backgroundColor = "darkgrey";
            videoContainer.style.display = "none";
            video.removeAttribute("autoplay"); 
            break;
        case "profile2":
            themeContainer.style.backgroundColor = "orange"; 
            themeContainer.style.color = "purple";
            audioControls.style.backgroundColor = "rgb(90, 34, 139)";
            videoContainer.style.display = "none";
            video.removeAttribute("autoplay"); 
            break;
        case "profile3":
            themeContainer.style.backgroundColor = "rgb(137, 196, 244)";
            themeContainer.style.color = "white";
            audioControls.style.backgroundColor = "rgb(137, 196, 244)";
            videoContainer.style.display = "none";
            video.removeAttribute("autoplay"); 
            break;
        case "profile4":
            themeContainer.style.backgroundColor = "black"; 
            themeContainer.style.color = "white";
            audioControls.style.backgroundColor = "rgb(131,137,150)";
            videoContainer.style.display = "block";
            video.setAttribute("autoplay", "");
            
            break;
        default:
            break;
    }
}

changeColourProfile();



