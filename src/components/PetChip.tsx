import React from 'react';

interface PetChipProps {
  label: string;
  className?: string;
}

export function PetChip({ label, className = '' }: PetChipProps) {
  return (
    <span className={`inline-flex items-center rounded-full border border-tertiary/30 bg-tertiary/15 px-3 py-1 text-xs font-bold text-tertiary shadow-sm backdrop-blur ${className}`}>
      {label}
    </span>
  );
}
