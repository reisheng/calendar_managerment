import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useEventStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { openEventModal } = useEventStore();

  const handleClick = () => {
    onClick?.();
    openEventModal();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-14 h-14 bg-blue-600 hover:bg-blue-700',
        'text-white rounded-full shadow-lg hover:shadow-xl',
        'flex items-center justify-center',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-blue-300',
        'group'
      )}
      title="新增行程"
    >
      <PlusIcon 
        className={cn(
          'w-6 h-6 transition-transform duration-200',
          isHovered && 'scale-110'
        )} 
      />
      
      {/* 提示文字 */}
      <span 
        className={cn(
          'absolute right-full mr-3 px-2 py-1',
          'bg-gray-900 text-white text-sm rounded',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-200',
          'whitespace-nowrap pointer-events-none',
          'before:content-[""] before:absolute before:left-full before:top-1/2',
          'before:-translate-y-1/2 before:border-4',
          'before:border-transparent before:border-l-gray-900'
        )}
      >
        新增行程
      </span>
    </button>
  );
}