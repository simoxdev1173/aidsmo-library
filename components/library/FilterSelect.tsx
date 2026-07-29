'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Radix Select rejects an empty-string item value, so "all" is represented by a
 * sentinel and translated back to "" in a hidden input. The hidden input is
 * what the surrounding GET form actually submits, which keeps the filter bar
 * working as a plain server-rendered form.
 */
const ALL = '__all';

export type FilterOption = { value: string; label: string };

export default function FilterSelect({
  name,
  label,
  defaultValue,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: FilterOption[];
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue === '' ? ALL : defaultValue);
  const submitted = value === ALL ? '' : value;

  return (
    <div className="space-y-1.5">
      <span className="block ps-1 text-[0.68rem] font-bold text-[#8A6A1D]">{label}</span>

      <input type="hidden" name={name} value={submitted} />

      <Select dir="rtl" value={value} onValueChange={setValue}>
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={placeholder ?? label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value || ALL} value={option.value || ALL}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
