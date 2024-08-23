export class ColorService {

    extractColor(imageElement: HTMLImageElement): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!imageElement.complete) {
                imageElement.addEventListener('load', () => {
                    try {
                        resolve(this.calculateColor(imageElement));
                    } catch (error) {
                        reject(error);
                    }
                });

                imageElement.addEventListener('error', () => {
                    reject(new Error('Error picture loading.'));
                });
            } else {
                try {
                    resolve(this.calculateColor(imageElement));
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    private calculateColor(imageElement: HTMLImageElement): string {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No canvas context');
        }

        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let rSum = 0, gSum = 0, bSum = 0;
        const colorCount: { [key: string]: number } = {};
        let totalPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const alpha = data[i + 3];

            if (alpha == 0)
                continue

            if (r < 20 && g < 20 && b < 20)
                continue

            rSum += r;
            gSum += g;
            bSum += b;
            totalPixels++;

            const colorKey = `${r},${g},${b}`;
            if (colorCount[colorKey]) {
                colorCount[colorKey]++;
            } else {
                colorCount[colorKey] = 1;
            }
        }

        // average color
        let avgR = Math.round(rSum / totalPixels);
        let avgG = Math.round(gSum / totalPixels);
        let avgB = Math.round(bSum / totalPixels);

        // most frequent color
        let mostFrequentColor = "";
        let maxCount = 0;

        for (const color in colorCount) {
            if (colorCount[color] > maxCount) {
                maxCount = colorCount[color];
                mostFrequentColor = color;
            }
        }

        let [mostR, mostG, mostB] = mostFrequentColor.split(',').map(Number);

        avgR = Math.max(mostR, Math.round(avgR)) - 25
        avgG = Math.max(mostG, Math.round(avgG)) - 25
        avgB = Math.max(mostB, Math.round(avgB)) - 25

        // console.log("avgR: ", avgR);
        // console.log("avgG: ", avgG);
        // console.log("avgB: ", avgB);
        //fixme
        if (!(avgR < 40 && avgB < 40 && avgG < 40)) {
            if (avgR > avgG + 5 && avgR > avgB + 5) {
                avgR += 25;
                if (avgR > 140)
                    avgR -= 40;
                avgB -= 50;
                avgG -= 50;
                //r
            }
            if (avgG > avgR + 5 && avgG > avgB + 5) {
                avgG += 25;
                if (avgG > 140)
                    avgG -= 40;
                avgR -= 50;
                avgB -= 50;
                //g
            }
            if (avgB > avgR + 5 && avgB > avgG + 5) {
                avgB += 25;
                if (avgB > 140)
                    avgB -= 40;
                avgR -= 50;
                avgG -= 50;
                //b
            }
        }

        console.log("avgR: ", avgR);
        console.log("avgG: ", avgG);
        console.log("avgB: ", avgB);

        return `rgb(${avgR},${avgG},${avgB})`;
    }
}
