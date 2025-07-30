import React, { useState, useRef, useEffect, KeyboardEvent, FocusEvent } from 'react';
import { EditableTextProps } from '@/types/canvas';

export default function EditableText({
  value,
  placeholder,
  maxLength,
  onSave,
  onCancel,
  isEditing,
  onStartEdit,
  className = '',
  style = {}
}: EditableTextProps) {
  const [editValue, setEditValue] = useState(value);
  const [isInternalEditing, setIsInternalEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const editing = isEditing || isInternalEditing;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = () => {
    if (!editing) {
      setIsInternalEditing(true);
      onStartEdit();
    }
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    onSave(trimmedValue);
    setIsInternalEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsInternalEditing(false);
    onCancel();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    // Small delay to allow clicking save button
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        handleSave();
      }
    }, 100);
  };

  const charsRemaining = maxLength - editValue.length;
  const isNearLimit = charsRemaining < 25;
  const isOverLimit = charsRemaining < 0;

  if (editing) {
    return (
      <div className={`relative ${className}`} style={style}>
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full resize-none border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isOverLimit ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          rows={Math.max(2, Math.ceil(editValue.length / 50))}
        />
        <div className={`absolute -bottom-6 right-0 text-xs ${
          isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'
        }`}>
          {charsRemaining} chars
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer hover:bg-gray-100 hover:bg-opacity-20 rounded-md p-1 transition-colors min-h-[2rem] flex items-center ${className}`}
      style={style}
      title="Click to edit"
    >
      {value || (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
    </div>
  );
}