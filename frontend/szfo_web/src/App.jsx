import img from "./image.json"
import "./main.css"
import React, { useState, useEffect, useCallback} from "react";
import {useDropzone} from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid';
import axios, { Axios } from "axios"
import FormData from 'form-data'



function App() {
  

  const [message, setMessage] = React.useState([]);
  const [images, setImages] = React.useState([])
  const [lenDef, setLenDef] = React.useState();
  const bodyFormData = new FormData();
  const [servAnsw, setServAnsw] = React.useState([]);
  const instance = axios.create({
    baseURL: '/api/',
    timeout: 1000,
  });



  const sendFiles = () => {
    let id = document.getElementById("laptopId").value
    message.map((photo) => {
      bodyFormData.append("images", photo)
    })
    const sendVideos = {
      "images": message
    }
    const headersSendVideos = {
      "cookies": localStorage.getItem("userId"),
      "unique_id": id
    }
    axios.post("/api/upload_file", bodyFormData, {
      params: headersSendVideos,
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .then((response) =>{
      setImages(response.data)
    })
  }


  let sendConfirm = () => {
    let req = []
    for (let i = 0; i < images.length; i++) {
      let id = images[i].code
      let setScr = []
      let setPixels = []
      let setScrew = []
      let setKeys = []
      let setChips = []
      let setLock = []

      for (let k = 0; k<images[i].defect.scrathes.length; k++) {
        if (document.getElementById(JSON.stringify({"conId": id,"defect": "scrathes","defectId": k})).checked) {
          setScr.push(document.getElementById(JSON.stringify({"conId": id,"defect": "scrathes","defectId": k})).value)}}
      for (let k = 0; k<images[i].defect.broken_pixels.length; k++) {
        if (document.getElementById(JSON.stringify({"conId": id,"defect": "broken_pixels","defectId": k})).checked) {
          setPixels.push(document.getElementById(JSON.stringify({"conId": id,"defect": "broken_pixels","defectId": k})).value)}}
      for (let k = 0; k<images[i].defect.no_screws.length; k++) {
        if (document.getElementById(JSON.stringify({"conId": id,"defect": "no_screws","defectId": k})).checked) {
          setScrew.push(document.getElementById(JSON.stringify({"conId": id,"defect": "no_screws","defectId": k})).value)}}
      for (let k = 0; k<images[i].defect.problems_keys.length; k++) {
        if (document.getElementById(JSON.stringify({"conId": id,"defect": "problems_keys","defectId": k})).checked) {
          setKeys.push(document.getElementById(JSON.stringify({"conId": id,"defect": "problems_keys","defectId": k})).value)}}
      for (let k = 0; k<images[i].defect.chips.length; k++) {
        if (document.getElementById(JSON.stringify({"conId": id,"defect": "chips","defectId": k})).checked) {
          setChips.push(document.getElementById(JSON.stringify({"conId": id,"defect": "chips","defectId": k})).value)}}
      for (let k = 0; k<images[i].defect.lock.length; k++) {
        if (document.getElementById(JSON.stringify({"conId": id,"defect": "lock","defectId": k})).checked) {
          setLock.push(document.getElementById(JSON.stringify({"conId": id,"defect": "lock","defectId": k})).value)}}
      
      req.push({
        "code" : id,
        "defect" : {
          "lock" : setLock,
          "scrathes" : setScr,
          "broken_pixels": setPixels,
          "no_screws": setScrew,
          "problems_keys" : setKeys,
          "chips" : setChips
        }
      })
        }
    let id = document.getElementById("laptopId").value
    console.log(req)
    axios.post("/api/confirm", req, {
      params: {
        "cookies": localStorage.getItem("userId"),
        "unique_id": id
      }
    })
    .then((response) => {
      if (response.data.status === "quality control passed") {setServAnsw({status: "Контроль пройден"})}
      else {setServAnsw(response.data)
      }
    })
  }


  const onDrop = useCallback(acceptedFiles => {
    setMessage(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})   


  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      localStorage.setItem("userId", uuidv4())
    }
    else {
      console.log("LOgged bu ID")
    }
  })

  const parseDataFromForm = () => {
    console.log("parsing")
  }


  return (
    <div className="App">
      <div className="fileUpload" {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p style={{color: "#7B68EE"}}>А теперь отпустите...</p> :
            <div style={{width: "700px"}}>
              <button className="btnUpload">Выберите файлы</button>
              <p style={{marginTop: "5px", textAlign: "center"}}>или перетащите их сюда</p>
              <p style={{marginTop: "40px", textAlign: "center"}}>*только png</p>
            </div>
        }
      </div>
      {message.map((data) => {
        return (
          <p className="inputLabel" style={{marginLeft: "10%"}}>{data.name}</p>
        )
      })}
      <div style={{marginTop: "30px"}}>
        <label for="laptopId" className="inputLabel" style={{marginLeft: "10%"}}>Серийный номер: </label>
        <input id="laptopId" className="inputText"></input>
        <button style={{marginBottom: "100px"}} className="btnUpload" onClick={() => sendFiles()}>Отправить файлы</button>
      </div>
      <div className="laptops">
        {images.map((image, key) => {
          console.log(key+'lock')
          return (
              <div className="laptopImages">
                <img src={image.code} className="crop-container"/>
                <div className="div" style={{textAlign: "center", lineHeight: "175%"}}>
                  <p className="defects">Плохо вкручен винт: {image.defect.lock.join(", ")} </p>
                  <p className="defects">Царапины: {image.defect.scrathes.join(", ")} </p>
                  <p className="defects">Битые пиксели: {image.defect.broken_pixels.join(", ")} </p>
                  <p className="defects">Нет винта: {image.defect.no_screws.join(", ")} </p>
                  <p className="defects">Сломана клавиша: {image.defect.problems_keys.join(", ")} </p>
                  <p className="defects">Сколы: {image.defect.chips.join(", ")} </p>
                </div>

                <hr></hr>

                  {image.defect.lock.map((num, key2) => {
                    return (
                      <div className="" style={{textAlign: "left", marginLeft: "1vh", backgroundColor: "white", color: "black"}}>
                        <input value={num} onChange={() => parseDataFromForm(image.code, )}type="checkbox" id={JSON.stringify({"conId": image.code,"defect": "lock","defectId": key2})}></input>
                        <label for={{conId: key,defectId: "lock"}} onChange={() => parseDataFromForm}>Плохо вкручен винт {num ? num:""}</label>
                      </div>
                    )
                  })}
                {image.defect.scrathes.map((num, key2) => {
                    return (
                      <div className="" style={{textAlign: "left", marginLeft: "1vh", backgroundColor: "white", color: "black"}}>
                        <input value={num} type="checkbox" id={JSON.stringify({"conId": image.code,"defect": "scrathes","defectId": key2})}></input>
                        <label for={{conId: key,defectId: "scratch"}}>Царапина {num ? num:""}</label>
                      </div>
                    )
                  })}
                {image.defect.broken_pixels.map((num, key2) => {
                    return (
                      <div className="" style={{textAlign: "left", marginLeft: "1vh", backgroundColor: "white", color: "black"}}>
                        <input value={num} type="checkbox" id={JSON.stringify({"conId": image.code,"defect": "broken_pixels","defectId": key2})}></input>
                        <label for={{conId: key,defectId: "broken_pixels"}}>Битый пиксель {num ? num:""}</label>
                      </div>
                    )
                  })}
                {image.defect.no_screws.map((num, key2) => {
                    return (
                      <div className="" style={{textAlign: "left", marginLeft: "1vh", backgroundColor: "white", color: "black"}}>
                        <input value={num} type="checkbox" id={JSON.stringify({"conId": image.code,"defect": "no_screws","defectId": key2})}></input>
                        <label for={{conId: key,defectId: "no_screws"}}>Нет винта {num ? num:""}</label>
                      </div>
                    )
                  })}
                {image.defect.problems_keys.map((num, key2) => {
                    return (
                      <div className="" style={{textAlign: "left", marginLeft: "1vh", backgroundColor: "white", color: "black"}}>
                        <input value={num} type="checkbox" id={JSON.stringify({"conId": image.code,"defect": "problems_keys","defectId": key2})}></input>
                        <label for={{conId: key,defectId: "problems_keys"}}>Сломана клавиша {num ? num:""}</label>
                      </div>
                    )
                  })}
                {image.defect.chips.map((num, key2) => {
                    return (
                      <div className="" style={{textAlign: "left", marginLeft: "1vh", backgroundColor: "white", color: "black"}}>
                        <input value={num} type="checkbox" id={JSON.stringify({"conId": image.code,"defect": "chips","defectId": key2})}></input>
                        <label for={{conId: key,defectId: "chips"}}>Скол {num}</label>
                      </div>
                    )
                  })}

              </div>
          )})}
    </div>
    {(() => {
        if (images.length > 0) {
          return (
            <div className="center" style={{marginBottom: "100px"}}>
              <button className="btnUpload" onClick={() => sendConfirm()}>Отправить</button>   
              <p className="inputLabel" style={{textAlign: "center"}}>{servAnsw.status}</p>
              <p className="inputLabel" style={{textAlign: "center"}}>{servAnsw.lock != undefined ? "Плохо закручен винт:" + servAnsw.lock : ""}</p>
              <p className="inputLabel" style={{textAlign: "center"}}>{servAnsw.scrathes != undefined ? "Царапины:" + servAnsw.scrathes:""}</p>
              <p className="inputLabel" style={{textAlign: "center"}}>{servAnsw.broken_pixels != undefined? "Битые пиксели:" + servAnsw.broken_pixels:""}</p>
              <p className="inputLabel" style={{textAlign: "center"}}>{servAnsw.no_screws ? "Нет винта:" + servAnsw.no_screws:""}</p>
              <p className="inputLabel" style={{textAlign: "center"}}>{servAnsw.problems_keys ? "Сломана клавиша:" + servAnsw.problems_keys:""}</p>
              <p className="inputLabel" style={{textAlign: "center"}}>{servAnsw.chips ? "Сколы:" + servAnsw.chips:""}</p>
            </div>
          )
        } 
      })()}
    


    </div>
  );
}

export default App;
