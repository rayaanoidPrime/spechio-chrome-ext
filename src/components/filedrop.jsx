import React, { Dispatch, useReducer } from "react";
import { FilePreview } from "./filepreview";
import '../App.css';



const FileDrop   = ({data , dispatch}) => {

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type : "SET_IN_DROP_ZONE",
            inDropZone : true,
            files : []
        })
    }

    const handleDragLeave = (e ) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            inDropZone : false ,
            type : "SET_IN_DROP_ZONE",
            files : []
        })
    }

    const handleDragOver = (e ) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
        dispatch({
            inDropZone : true,
            type : "SET_IN_DROP_ZONE",
            files : []
        })

    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let files = [...e.dataTransfer.files]
        if (files && files.length>0){
            
            const exisitingFiles = data.fileList.map((f)=>f.name);
            files = files.filter((f) => !exisitingFiles.includes(f.name))

            dispatch({
                files : files,
                type : "ADD_FILE_TO_LIST",
                inDropZone : false
            });

            dispatch({
                type : "SET_IN_DROP_ZONE",
                inDropZone : false,
                files : []
            });
        }

    }

    const handleFileSelect = (e ) => {
        
        let files = [...(e.target.files)];

        if(files && files.length>0){

            const exisitingFiles = data.fileList.map((f)=>f.name);
            files = files.filter((f) => !exisitingFiles.includes(f.name));
            dispatch({
                type: "ADD_FILE_TO_LIST",
                files : files,
                inDropZone : false
            })

        }
    }

    return(
        <div className="filecontainer">
            <h1 className="draglabel">Drag And Drop</h1>
            <div className={`items-center border-1 shadow-xl ${data.inDropZone === true ? "border-sky-800 bg-gray-100 " : "border-gray-400 bg-gray-400 "} rounded-lg p-4 h-auto w-96 mb-auto flex justify-center`}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragOver={(e)=> handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                >
                <div className="text-center ">
                    <FilePreview fileData={data} />
                    <label htmlFor="fileSelect" className="text-center border-1 bg-indigo-900 opacity-80 hover:opacity-100 px-3 rounded-xl hover:bg-indigo-600 text-white py-05 hover:cursor-pointer mb-auto">Select File</label>
                    <input id="fileSelect" onChange={(e) => handleFileSelect(e)} type="file" multiple className=" absolute top-[-9999px] " />
                    <p className="mt-1 text-sm text-gray-600">Drag and drop your files here</p>  
                </div>
            </div>
        </div>
    )
}

export default FileDrop;