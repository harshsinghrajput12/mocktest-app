import React from 'react';

export default function FolderManager({ folders, selectedFolder, onSelect }) {
  return (
    <div>
      <h3>Select Folder</h3>
      {folders.map((folder) => (
        <button
          key={folder.name}
          onClick={() => onSelect(folder)}
          style={{
            backgroundColor: selectedFolder?.name === folder.name ? '#aaa' : '#eee',
            margin: '5px',
          }}
        >
          {folder.name}
        </button>
      ))}
    </div>
  );
}
