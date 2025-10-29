import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQ: React.FC<FAQProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: t('faq.items.q1'),
      answer: t('faq.items.a1'),
      category: 'general'
    },
    {
      id: '2',
      question: t('faq.items.q2'),
      answer: t('faq.items.a2'),
      category: 'general'
    },
    {
      id: '3',
      question: t('faq.items.q3'),
      answer: t('faq.items.a3'),
      category: 'features'
    },
    {
      id: '4',
      question: t('faq.items.q4'),
      answer: t('faq.items.a4'),
      category: 'features'
    },
    {
      id: '5',
      question: t('faq.items.q5'),
      answer: t('faq.items.a5'),
      category: 'icons'
    },
    {
      id: '6',
      question: t('faq.items.q6'),
      answer: t('faq.items.a6'),
      category: 'icons'
    },
    {
      id: '7',
      question: t('faq.items.q7'),
      answer: t('faq.items.a7'),
      category: 'export'
    },
    {
      id: '8',
      question: t('faq.items.q8'),
      answer: t('faq.items.a8'),
      category: 'technical'
    }
  ];

  const categories = [
    { id: 'all', label: t('faq.categories.all') },
    { id: 'general', label: t('faq.categories.general') },
    { id: 'features', label: t('faq.categories.features') },
    { id: 'icons', label: t('faq.categories.icons') },
    { id: 'export', label: t('faq.categories.export') },
    { id: 'technical', label: t('faq.categories.technical') }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <h2 className="text-2xl font-bold">{t('faq.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label={t('common.close') || 'Close'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Category Filter */}
          <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setExpandedId(null);
                }}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="p-6 space-y-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  aria-expanded={expandedId === item.id}
                >
                  <h3 className="text-left font-semibold text-gray-800">{item.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ml-4 ${
                      expandedId === item.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedId === item.id && (
                  <div className="px-4 pb-4 pt-0 bg-blue-50 text-gray-700 border-t border-gray-200">
                    <p className="text-sm leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {t('faq.noResults')}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
          <p className="text-sm text-gray-600 text-center">
            {t('faq.footer')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
