'use client';
import React from 'react'
import {Plus} from 'lucide-react'


interface FloatingButtonProps {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
    onClick: () => void
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ position, onClick}) => {
    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
    }

    return (
        <button 
            className={`fixed ${positionClasses[position]} bg-primary-blue hover:bg-primary-blue-hover text-white hover:text-gray-400 active:scale-95 rounded-xl p-1.5 shadow-lg transition-all duration-300 cursor-pointer outline-none`}
            onClick={onClick}
        >
            <Plus className='w-8 h-8'/>
        </button>
    )
}

export default FloatingButton