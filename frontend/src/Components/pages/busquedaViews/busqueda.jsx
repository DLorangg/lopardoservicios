import React from 'react'
import Rouben from '../../../Assets/Rouben.otf';

export function Busqueda() {
  return (
    <>
    <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
      `}</style>
    <div className="container my-5">
        <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>BÚSQUEDA</h2>
    </div>
    </>
  )
}
