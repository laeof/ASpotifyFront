export class ColorService {
  extractColor(imageElement: HTMLImageElement): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.src = imageElement.src;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context?.drawImage(img, 0, 0);

        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData?.data;

        if (pixelData == null) {
          reject('No pixel data');
          return;
        }

        const colorFrequency: Map<number, number> = new Map();
        const step = 4 * 3; // Обрабатывать каждый третий пиксель

        for (let i = 0; i < pixelData.length; i += step) {
          const r = pixelData[i] >> 2;  // Уменьшение точности до 6 бит
          const g = pixelData[i + 1] >> 2; // Уменьшение точности до 6 бит
          const b = pixelData[i + 2] >> 2; // Уменьшение точности до 6 бит

          const color = (r << 12) | (g << 6) | b; // 18-битный ключ для цвета
          colorFrequency.set(color, (colorFrequency.get(color) || 0) + 1);
        }

        let mostFrequentColor = 0;
        let maxFrequency = 0;

        colorFrequency.forEach((frequency, color) => {
          if (frequency > maxFrequency) {
            mostFrequentColor = color;
            maxFrequency = frequency;
          }
        });

        const r = (mostFrequentColor >> 12) & 0x3F;
        const g = (mostFrequentColor >> 6) & 0x3F;
        const b = mostFrequentColor & 0x3F;

        // Коэффициент затемнения (0.7 делает цвет темнее)
        const darkeningFactor = 0.7;
        const darkR = Math.max(0, Math.min(255, Math.floor(r * 4 * darkeningFactor)));
        const darkG = Math.max(0, Math.min(255, Math.floor(g * 4 * darkeningFactor)));
        const darkB = Math.max(0, Math.min(255, Math.floor(b * 4 * darkeningFactor)));

        resolve(`rgb(${darkR}, ${darkG}, ${darkB})`);
      };

      img.onerror = (error) => reject(error);
    });
  }
}