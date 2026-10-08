import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicClient';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function PublicFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const { data: faqsData, isLoading } = useQuery({
    queryKey: ['publicFaqs'],
    queryFn: publicApi.getFaqs,
  });

  const faqs = faqsData?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
          Knowledge Base & Support
        </span>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-300 text-sm">
          Everything you need to know about our cloud architecture, engineering retainers, and security guarantees.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading FAQs...</div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={faq.id || idx} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full p-6 text-left font-bold text-base text-slate-100 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />
                  <span>{faq.question}</span>
                </div>
                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-sky-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              {openIndex === idx && (
                <div className="p-6 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
