import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="mt-4 text-sm text-gray-500 font-medium">{text}</p>
    </div>
  );
}
