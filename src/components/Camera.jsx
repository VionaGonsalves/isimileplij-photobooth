import { useRef, useEffect, useState } from 'react';

function Camera({ onCapture, photoCount }){
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        let activeStream = null;

        async function startCamera(){
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }
                activeStream = stream;

                if (videoRef.current){
                    videoRef.current.srcObject = stream;  
                }

            } catch(err) {
                setError('Camera access denied or unavailable');
                console.error(err);
            }
        }
        startCamera();

        return () => {
            cancelled=true;
            if (activeStream) {
                
                activeStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    function capture(){
        const canvas = canvasRef.current
        const video = videoRef.current
        if (video.videoWidth === 0) {
            return;
        }
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
        if (photoCount+1 <4){
          setSecondsLeft(3);  
        }
        else {setSecondsLeft(null);}
        

    }

    useEffect(()=> {

        if (secondsLeft===null) {
            return;
        }
        const timeoutId = setTimeout(() => {
        if (secondsLeft === 1) {
            // The countdown just finished: take the photo
            capture();
        } else {
            setSecondsLeft(secondsLeft - 1);
        }
    }, 1000);


        return () => {
            clearTimeout(timeoutId);
        }
    }, [secondsLeft])



    const handleStart = () => {
        setSecondsLeft(3);
    }

    if (error) return <p>{error}</p>;

    return (

    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        borderRadius: '8px',
        overflow: 'hidden', 
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          transform: 'scaleX(-1)',
          width: '100%',
          display: 'block',
        }}
      />

      {/* Countdown Overlay (Not mirrored!) */}
      {secondsLeft > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            pointerEvents: 'none',
          }}
        >
          {secondsLeft}
        </div>
      )}
        <button onClick={handleStart} disabled={photoCount > 0 || secondsLeft !==null }>Capture</button>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
    )
}

export default Camera;