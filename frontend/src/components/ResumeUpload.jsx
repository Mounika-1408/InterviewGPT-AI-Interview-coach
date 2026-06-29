import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './ResumeUpload.css'

export default function ResumeUpload({ onFileSelect, file }) {
  const onDrop = useCallback(accepted => {
    if (accepted.length > 0) onFileSelect(accepted[0])
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1
  })

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}>
      <input {...getInputProps()} />
      {file ? (
        <div className="dropzone-file">
          <FileIcon />
          <div>
            <p className="file-name">{file.name}</p>
            <p className="file-size">{(file.size / 1024).toFixed(1)} KB · Click to replace</p>
          </div>
        </div>
      ) : (
        <div className="dropzone-prompt">
          <UploadIcon />
          <p className="dropzone-title">{isDragActive ? 'Drop your resume here' : 'Upload your resume'}</p>
          <p className="dropzone-sub">Drag & drop or click to browse · PDF or TXT</p>
        </div>
      )}
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
    </svg>
  )
}
