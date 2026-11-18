
import { useState } from "react";
import Camera from "./components/Camera"
import Strip from "./components/Strip"

function App(){
  const [show, setShow] = useState(true);
  const [photos, setPhotos] = useState([]);

  function addPhoto(dataUrl){
    if (photos.length < 4){
      setPhotos([...photos, dataUrl])
    }
  }

  function startOver(){
    setPhotos([]);
  }
  return (
  <>
    <button onClick={()=> setShow(!show)}>
      {show? 'Hide Camera' : 'Show Camera'}
    </button>

    {show && <Camera onCapture={addPhoto} photoCount={photos.length}/>}
    <Strip photos={photos} onStartOver={startOver}/>
  </>
  
)
}

export default App;