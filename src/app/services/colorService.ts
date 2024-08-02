import { ElementRef } from "@angular/core";

export class ColorService {
    extractColor(imageElement: HTMLImageElement) {
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
    
            // Создаем объект для отслеживания цветов и их частот
            const colorFrequency: { [key: string]: number } = {};
    
            // Проходим по пикселям и считаем цвета
            for (let i = 0; i < pixelData.length; i += 4) {
              const color = `rgb(${pixelData[i]}, ${pixelData[i + 1]}, ${pixelData[i + 2]})`;
    
              // Увеличиваем частоту цвета
              if (color in colorFrequency) {
                colorFrequency[color] += 1;
              } else {
                colorFrequency[color] = 1;
              }
            }
    
            // Находим самый частый цвет
            let mostFrequentColor = '';
            let maxFrequency = 0;
    
            for (const color in colorFrequency) {
              if (colorFrequency[color] > maxFrequency) {
                mostFrequentColor = color;
                maxFrequency = colorFrequency[color];
              }
            }
    
            resolve(mostFrequentColor);
          };
    
          img.onerror = (error) => reject(error);
        });
      }
}
