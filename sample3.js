
function setup() {
    noCanvas();
    noiseSeed(0);
}

window.addEventListener('load', function () {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const height = 512;
    const width = 1024;

    const radius = 1.5;
    const xoff = 1500;
    const yoff = 1609;
    const zoff = 2807;

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

    const colorMap = [];
    for (let index = 0; index < 256; index++) {
        for (let color of colors) {
            if (index / 256 < color.below) {
                colorMap.push([color.red, color.green, color.blue]);
                break;
            }
        }
    }

    generate();

    function generate() {
        const imageData = ctx.createImageData(width, height);
        for (let index = 0; index < (height * width * 4); index += 4) {
            const i = (index / 4) % width; // from 0 to width
            const j = Math.floor((index / 4) / width); // from 0 to height

            // See: https://en.wikipedia.org/wiki/Spherical_coordinate_system
            const theta = (j / height) * Math.PI;
            const phi = (i / width) * Math.PI * 2;

            // See: https://en.wikipedia.org/wiki/Spherical_coordinate_system#Coordinate_system_conversions
            const x = xoff + radius * Math.sin(theta) * Math.cos(phi);
            const y = yoff + radius * Math.sin(theta) * Math.sin(phi);
            const z = zoff + radius * Math.cos(theta);

            const value = Math.floor(noise(x, y, z) * 255);

            imageData.data[index + 0] = colorMap[value][0];
            imageData.data[index + 1] = colorMap[value][1];
            imageData.data[index + 2] = colorMap[value][2];
            imageData.data[index + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    document.querySelector('#reload').addEventListener('click', function (event) {
        const seed = Number(document.querySelector('#noise-seed').value);
        noiseSeed(seed);

        const octave = Number(document.querySelector('#noise-octave').value);
        const falloff = Number(document.querySelector('#noise-falloff').value);
        noiseDetail(octave, falloff);

        generate();
    });
});
