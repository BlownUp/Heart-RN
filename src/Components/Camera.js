const Camera = function () {
    let width = 0;
    let height = 0;

    const createObjects = function () {


        const video = document.createElement('video');
        video.id = 'video';
        video.width = width;
        video.width = height;
        video.autoplay = true;
        document.body.appendChild(video);
    }


    return {
        video: null,
        context: null,

        startCamera: function (w = 680, h = 480) {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                width = w;
                height = h;
                createObjects();
                this.video = document.getElementById('video');
                (function (video) {
                    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                        video.srcObject = stream;
                        video.play();
                    });
                })(this.video)

            }
        },
        takeSnapshot: function () {
            return new Promise((resolve, reject) => {
                try {
                    const video = document.getElementById("video");

                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataURL = canvas.toDataURL();
                    resolve(dataURL);
                } catch (err) {
                    reject(err);
                }
            })
        }

    }
}();

export default Camera;
