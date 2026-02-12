import React, { useState } from 'react';
import { Star, X, MessageSquare, LogOut } from 'lucide-react';

interface LogoutFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutFeedbackModal: React.FC<LogoutFeedbackModalProps> = ({ isOpen, onClose, onConfirmLogout }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call to save feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    onConfirmLogout();
  };

  const labels = {
    1: 'Unsatisfied',
    2: 'Somewhat Unsatisfied',
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very Satisfied'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform scale-100 transition-all">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-start relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-serif font-bold mb-1">TRT Portal Feedback</h2>
            <p className="text-slate-400 text-sm">How was your experience with the Tracker today?</p>
          </div>
          <button 
            onClick={onClose}
            className="relative z-10 p-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
            {/* Star Rating */}
            <div className="flex flex-col items-center mb-6">
                <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star 
                                size={32} 
                                className={`transition-colors duration-200 ${
                                    star <= (hoverRating || rating) 
                                    ? 'fill-brand-cyan text-brand-cyan drop-shadow-sm' 
                                    : 'fill-gray-100 text-gray-200'
                                }`} 
                            />
                        </button>
                    ))}
                </div>
                <div className="h-5">
                    <span className="text-sm font-bold text-brand-cyan transition-opacity duration-300">
                        {(hoverRating || rating) ? labels[(hoverRating || rating) as keyof typeof labels] : ''}
                    </span>
                </div>
            </div>

            {/* Feedback Text */}
            <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Additional Comments (Optional)
                </label>
                <div className="relative">
                    <textarea 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tell us what we can improve..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/20 transition-all resize-none h-24 text-gray-800 placeholder-gray-400"
                    />
                    <MessageSquare size={16} className="absolute right-3 bottom-3 text-gray-300 pointer-events-none" />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-cyan hover:bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-cyan/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>Submit Feedback & Logout</>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};