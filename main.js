
let config = {
    noise: {
        seed: 0,
        detail: {
            lod: 8,
            falloff: 0.5,
        },
    },
};

function setup() {
    noCanvas();
    setNoiseConfig(config);
}

function setNoiseConfig(config) {
    noiseSeed(config.noise.seed);
    noiseDetail(config.noise.detail.lod, config.noise.detail.falloff);
}

window.addEventListener('load', function () {

    const width = 800, height = 800;
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let zoff = 0, zoffIncrement = 0.005;

    const camera = { x: 0, y: 0 };
    let amplitudeOffset = 0, amplitudeFactor = 1;

    const colors = [
        { below: 0.2, name: 'deep-sea', red: 20, green: 92, blue: 151 },
        { below: 0.4, name: 'sea', red: 24, green: 135, blue: 226 },
        { below: 0.5, name: 'low-sea', red: 73, green: 137, blue: 255 },
        { below: 0.55, name: 'sand', red: 224, green: 192, blue: 84 },
        { below: 0.7, name: 'grassland', red: 42, green: 151, blue: 9 },
        { below: 0.9, name: 'mountain', red: 129, green: 97, blue: 8 },
        { below: 1.0, name: 'high-mountain', red: 161, green: 136, blue: 67 },
        { below: Infinity, name: 'snow', red: 255, green: 255, blue: 255 },
    ];

    render();

    function render() {
        let incr = 0.005;
        let xoff = camera.x;
        const noiseValues = [];
        for (let x = 0; x < width; x++) {
            let yoff = camera.y;
            for (let y = 0; y < height; y++) {
                let r = noise(xoff, yoff, zoff);
                r = amplitudeFactor * (r - 0.5) + 0.5 + amplitudeOffset;
                noiseValues.push(r);
                yoff += incr;
            }
            xoff += incr;
        }

        const imageData = ctx.createImageData(width, height);
        for (let index = 0; index < (width * height * 4); index += 4) {
            // for (let index = 0; index < (width * height); index++) {
            for (let color of colors) {
                const r = noiseValues[index / 4];
                if (r < color.below) {
                    const shadowFactor = r > 0.55 ? r * 1.75 : 1.0;
                    imageData.data[index + 0] = shadowFactor * color.red;
                    imageData.data[index + 1] = shadowFactor * color.green;
                    imageData.data[index + 2] = shadowFactor * color.blue;
                    imageData.data[index + 3] = 255;
                    // ctx.fillStyle = [
                    //     'rgb(',
                    //     shadowFactor * color.red,
                    //     ', ',
                    //     shadowFactor * color.green,
                    //     ', ',
                    //     shadowFactor * color.blue,
                    //     ')'
                    // ].join('');
                    // ctx.fillRect(Math.floor(index / width), index % width, 1, 1);
                    break;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    document.querySelector('#reload').addEventListener('click', function (event) {

    });

    document.querySelector('#reload').addEventListener('click', function (event) {
        const seed = Number(document.querySelector('#noise-seed').value);
        noiseSeed(seed);

        const octave = Number(document.querySelector('#noise-octave').value);
        const falloff = Number(document.querySelector('#noise-falloff').value);
        noiseDetail(octave, falloff);

        render();
    });

    document.querySelector('#amplitude-offset').addEventListener('input', function (event) {
        amplitudeOffset = Number(event.target.value);
        render();
    });

    document.querySelector('#amplitude-factor').addEventListener('input', function (event) {
        amplitudeFactor = Number(event.target.value);
        render();
    });

    canvas.addEventListener('dblclick', function (event) {
        camera.x = 0;
        camera.y = 0;
        render();
    });

    window.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp': camera.x -= 1; render(); break;
            case 'ArrowDown': camera.x += 1; render(); break;
            case 'ArrowLeft': camera.y -= 1; render(); break;
            case 'ArrowRight': camera.y += 1; render(); break;
        }
    });

});
