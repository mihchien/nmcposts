import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Nguyễn Minh Chiến — AI Educator, STEAM Trainer and Software Developer",
};

const ACHIEVEMENTS = [
  { icon: "🏆", title: "Outstanding Teacher", desc: "Recognized by the Department of Education and Training" },
  { icon: "🎓", title: "4,000+ Teaching Hours", desc: "Hands-on teaching experience" },
  { icon: "👥", title: "1,000+ Students", desc: "Students, teachers and parents trained" },
  { icon: "🚀", title: "50+ Projects", desc: "Education and engineering projects completed" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-36 h-36 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-2xl">
              NMC
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Nguyễn Minh Chiến
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
              AI Educator · STEAM Trainer · Software Developer
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              With over <strong>4,000 hours of teaching</strong>, I am passionate about sharing knowledge
              in Artificial Intelligence, Programming, Robotics and STEAM Education with students,
              teachers and parents. My goal is to build a future generation capable of applying
              technology to solve real-world problems.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mt-4">
              I have worked with students from primary school to university level, designing hands-on
              curricula that connect theory with real-world application. From building Arduino-powered
              robots to training teachers on how to use AI tools effectively in the classroom — every
              experience has shaped my belief that <strong>technology education must be accessible,
              practical and inspiring</strong>.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mt-4">
              Beyond the classroom, I develop software tools and educational content to support
              the growing community of learners and educators in Vietnam who want to embrace
              the AI era with confidence. If you share that vision, I&apos;d love to connect.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Me
              </Link>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm">
                YouTube
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((ach) => (
            <div key={ach.title} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
              <div className="text-3xl mb-2">{ach.icon}</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{ach.title}</div>
              <div className="text-xs text-slate-400">{ach.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
