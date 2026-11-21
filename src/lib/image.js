export function resizeToDataUrl(file, maxWidth = 900) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const scale = Math.min(1, maxWidth / img.width)
            const canvas = document.createElement('canvas')
            canvas.width = Math.round(img.width * scale)
            canvas.height = Math.round(img.height * scale)
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(img.src)
            resolve(canvas.toDataURL('image/webp', 0.8))
        }
        img.onerror = reject
        img.src = URL.createObjectURL(file)
    })
}