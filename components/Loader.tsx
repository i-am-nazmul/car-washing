import React from 'react';

const Loader = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className="flex items-center justify-center rounded-full border border-violet-300 bg-black/50 p-5 shadow-[0_0_18px_rgba(139,92,246,0.35)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-300 border-t-transparent" />
      </div>
    </div>
  )
}

export default Loader