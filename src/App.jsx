import { useState, useEffect } from 'react'
import './App.css'

import supabase from './supabase'

function App() {
  const [videoRequest, setVideoRequest] = useState('')
  const [videoList, setVideoList] = useState([])

  useEffect(() => {
    fetchVideos()
  }, [])
  

  const fetchVideos = async () => {
    const {data, error} = await supabase
      .from('Videos')
      .select("*")

      if(error){
        console.log("Error: ", error)
      }else{
        setVideoList(data)
      }
  }

  const addVideo = async () => {
    const newVideo = {
      videoLink: videoRequest,
      isFinished: false
    }

    const {data, error} = await supabase
    .from('Videos')
    .insert([newVideo])
    .select()
    .single()


    console.log(newVideo)
    console.log(data)

    if(error){
      console.log('error al cargar el video', error)
    }else{
      setVideoList([data, ...videoList])
    }

    setVideoRequest('')
  }

  const toggleDone = async (id, isFinished) => {
    const {error} = await supabase
    .from('Videos')
    .update({isFinished: !isFinished})
    .eq('id', id)

    if (error){
      console.log(error)
    }else {
      setVideoList(videoList.map(v =>
        v.id === id ? {...v, isFinished: !v.isFinished} : v
      ))
    }

  }

  const deleteVideo = async (id) => {
    const {error} = await supabase
    .from('Videos')
    .delete()
    .eq('id', id)

    if (error){
      console.log(error)
    }else {
      setVideoList(videoList.filter(video => video.id !== id ))
    }

  }



  return (
    <div>
      <h1>VIDEO MANAGER</h1>
      <input 
        type="text"
        placeholder='video url'
        value={videoRequest}
        onChange={(e) => setVideoRequest(e.target.value)}
        />
       <button onClick={addVideo}>AGREGAR</button>

       <ul className='video-list'>
        {videoList.map(video => (
          <li key={video.id}>
            <iframe
                  src={`https://www.youtube.com/embed/${
                  video.videoLink.includes('youtu.be/')
                  ? video.videoLink.split('youtu.be/')[1].split('?')[0]
                  : video.videoLink.split('v=')[1]?.split('&')[0]
                  }`}
            ></iframe>
            <button onClick={()=> toggleDone(video.id, video.isFinished)}>
              {video.isFinished ? "visto" : "marcar visto"}
              </button>
            <button onClick={()=> deleteVideo(video.id)}>borrar</button>
          </li>
        ))

        }
       </ul>
    </div>
  )
}

export default App
