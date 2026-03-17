/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Send, Sparkles, User, AlertCircle, Briefcase, CheckCircle2, Lightbulb } from "lucide-react";
import Markdown from 'react-markdown';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePersonality = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const model = "gemini-3.1-pro-preview";
      const prompt = `
        أنت خبير في تحليل الشخصيات والسلوك البشري.
        المطلوب: تحليل الشخصية بناءً على النص التالي: "${inputText}"
        
        يجب أن يحتوي التحليل على الأقسام التالية بالترتيب وبشكل منظم:
        1. نوع الشخصية (وصف عام)
        2. أهم 3 صفات إيجابية (على شكل نقاط)
        3. أهم 3 نقاط ضعف (على شكل نقاط)
        4. تحليل مختصر للسلوك
        5. نصيحة عملية لتحسين الشخصية
        6. اقتراح وظيفة أو مجال يناسب هذه الشخصية

        الشروط:
        - اجعل التحليل منطقي وليس مبالغ فيه
        - استخدم أسلوب واضح وسهل الفهم
        - لا تستخدم مصطلحات معقدة
        - لا تكتب مقدمات، ابدأ مباشرة بالتحليل
        - اجعل الرد منظم جداً باستخدام عناوين واضحة ونقاط.
        - اللغة: العربية.
      `;

      const response = await genAI.models.generateContent({
        model: model,
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        setAnalysis(text);
      } else {
        throw new Error("لم يتم استلام رد من الذكاء الاصطناعي.");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحليل الشخصية. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-emerald-100" dir="rtl">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Brain size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">محلل الشخصية الذكي</h1>
          </div>
          <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            مدعوم بالذكاء الاصطناعي
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Input Section */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex items-center gap-2 mb-6 text-emerald-700">
              <User size={20} />
              <h2 className="font-semibold text-lg">صف نفسك أو مشاعرك</h2>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="مثال: أنا شخص أحب مساعدة الآخرين، لكنني أشعر بالتوتر عندما أكون تحت الضغط. أحب التخطيط لكل شيء مسبقاً..."
              className="w-full h-40 p-5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none text-lg leading-relaxed"
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={analyzePersonality}
                disabled={isLoading || !inputText.trim()}
                className={`
                  flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all
                  ${isLoading || !inputText.trim() 
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-95'}
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    ابدأ التحليل
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex items-center gap-4 mb-8"
            >
              <AlertCircle className="shrink-0" />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-2xl font-bold">نتائج التحليل</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* We'll parse the markdown response or just display it nicely */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-black/5 prose prose-emerald max-w-none prose-headings:text-emerald-900 prose-p:text-stone-700 prose-li:text-stone-700">
                  <div className="markdown-body">
                    <Markdown>{analysis}</Markdown>
                  </div>
                </div>
              </div>

              {/* Action Cards - Just for visual flair based on common sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3 text-amber-700">
                    <Lightbulb size={20} />
                    <h3 className="font-bold">نصيحة ذهبية</h3>
                  </div>
                  <p className="text-amber-900/80 text-sm leading-relaxed">
                    تذكر أن الوعي بالذات هو الخطوة الأولى نحو التغيير الإيجابي. حاول تطبيق النصيحة العملية أعلاه تدريجياً.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3 text-blue-700">
                    <Briefcase size={20} />
                    <h3 className="font-bold">التوجه المهني</h3>
                  </div>
                  <p className="text-blue-900/80 text-sm leading-relaxed">
                    المجال المقترح يعتمد على سماتك الشخصية الأساسية التي تضمن لك الإبداع والراحة النفسية في العمل.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {!analysis && !isLoading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-stone-400"
            >
              <Brain size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">أدخل وصفاً لشخصيتك أعلاه للبدء في التحليل</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-black/5 text-center text-stone-400 text-sm">
        <p>© {new Date().getFullYear()} محلل الشخصية الذكي. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
