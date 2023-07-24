import './App.css';
import React, { useRef, useCallback, useState, useReducer } from 'react';
import axios from 'axios';
import FileDrop from "./components/filedrop.jsx";
import SkinToneColor from './components/skin_tone';
import ProductRecommendation from './components/product_recommendation';

function App() {

  const webcamRef = useRef<any>(null);

  const [skinType, setSkinType] = useState(null);
  const [skinTone, setSkinTone] = useState(null);

  async function base64EncodeFile(file :any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const encodedString = btoa(reader.result as any);
        resolve(encodedString);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsBinaryString(file);
    });
  }

  async function makePredictPostRequest(filename : any, filedata : any) {
    try {
      var encodedFile = await base64EncodeFile(filedata)
      console.log(encodedFile)
      var bodyFormData = new FormData();
      bodyFormData.append('filename', filename);
      bodyFormData.append('filedata' , encodedFile as any);
      console.log(bodyFormData);
      const response = await axios.post('http://localhost:8000/skin',bodyFormData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response.data);
      setSkinType(response.data[0]["type"]);
      setSkinTone(response.data[0]["tone"]);
    } catch (error) {
      console.error(error);
    }
  }
  
  async function goBack(){
    setSkinTone(null);
    setSkinType(null);
  }

  const reducer = (state : any , action  : any) => {
    switch (action.type) {
        case "SET_IN_DROP_ZONE" : 
            return {...state , inDropZone : action.inDropZone}
        case "ADD_FILE_TO_LIST" :
            return {...state, fileList : state.fileList.concat(action.files)}
        default : 
            return state;
    }
}

  const [data , dispatch] = useReducer(reducer , {
      inDropZone : false,
      fileList : []
  });

  const handleSubmit = () => {
    console.log(data.fileList[0]);
    makePredictPostRequest(data.fileList[0]["name"], data.fileList[0]);
  }
  

  return (
    <div className="App">
      <div className='title'>
        Spechio Face AI
      </div>
      <div className='description'>
        Facial Feature extracter and Beauty Product recommendation engine
      </div>
      { skinTone && skinType ? <></> : <FileDrop data={data} dispatch={dispatch} />}
        {data.fileList && data.fileList.length>0 && !skinTone && ! skinType ?
          <button onClick={handleSubmit} type='submit' className='rounded-2xl bg-gradient-to-r from-pent to-quad p-2 px-4 border-2 hover:opacity-80 mt-10 shadow-xl'>Submit</button> 
          : <></> 
      }

        <div className='text-purple-900 bg-gray-400 font-bold mt-2 center above z-10'>
              {skinType && skinTone ? <div className='z-10'>
                <div className=' border-1 border-gray-400 bg-opacity-40 flex flex-col rounded-lg p-4 mb-5'>
              <h2 className='text-md font-bold mb-4 text-quad self-start'>Your Skin </h2>
                <div className='flex flex-col'>
                  <p className=''>
                    Skin Type : {skinType} 
                  </p>
                  <p>
                    Acne Concern : {skinType == "Dry" ? "Low" : "High"}
                  </p>
                  <p>
                    Sensitivity : {skinType == "Dry" ? "Low" : "High"}
                  </p>
                </div>
              <p>
                  Recommended : {skinType == "Dry" ? "Hydrating products with hyaluronic acid, glycerin, and ceramides" : "High"}
              </p>
              <SkinToneColor skinTone={skinTone} />
              </div>
              <button onClick={goBack} type='submit' className='rounded-2xl bg-gradient-to-r from-pent to-quad p-2 px-4 border-2 hover:opacity-80 shadow-xl'>Go Back</button>
              </div> : <></>}
      </div>
    </div>
  );
}

export default App;
