
import { STRIP_WIDTH, STRIP_HEIGHT, PHOTO_WIDTH, PHOTO_HEIGHT, PHOTO_X, PHOTO_YS} from '../constants';
import { useRef, useState, useEffect } from 'react';




function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
    
}

function Strip({photos, onStartOver}) {
    const canvasRef = useRef(null);
    const [stripSrc, setStripSrc] = useState(null);

    useEffect(() => {
        if (photos.length<4){
            return;
        }

        let cancelled = false;
        async function compose(){
            const canvas = canvasRef.current;
            canvas.width = STRIP_WIDTH;
            canvas.height = STRIP_HEIGHT;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#F6EEDC';
            ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

            const images = await Promise.all(photos.map(loadImage));
            if (cancelled){
                return;
            }

            images.forEach((img, index) => {
                const sh = img.height;
                const sw = img.height * (PHOTO_WIDTH/PHOTO_HEIGHT);
                const sx = (img.width - sw)/2; // TODO: handle portrait cameras
                const sy = 0;
                ctx.drawImage(img, sx, sy, sw, sh, PHOTO_X, PHOTO_YS[index], PHOTO_WIDTH, PHOTO_HEIGHT);
            })

            const dataUrl = canvas.toDataURL('image/png');

            setStripSrc(dataUrl);


        }
        compose();

        return () => {
            cancelled=true;
        };
    }, [photos]);

    return (
        <>
            
        <ul>
            {photos.map((photo, index)=> 
            <li key={index}><img src={photo} alt={`Photo ${index + 1}`} width="200"/></li>
            )}
        </ul>
        {photos.length>0 && 
        <button onClick={onStartOver} disabled={photos.length<4}>
            Start Over
        </button>}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {photos.length === 4 && stripSrc && <img src={stripSrc} style={{ width: 200 }} />}
        </>
        
    )
}

export default Strip;