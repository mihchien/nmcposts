import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryColor } from "@/lib/utils";
import NewsletterForm from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { name: "AI", slug: "ai", icon: "🤖", desc: "Artificial Intelligence & Machine Learning" },
  { name: "Python", slug: "python", icon: "🐍", desc: "Python programming language" },
  { name: "Swift", slug: "swift", icon: "🍎", desc: "iOS & macOS development with Swift" },
  { name: "Robotics", slug: "robotics", icon: "🦾", desc: "Robotics & Automation" },
  { name: "Arduino", slug: "arduino", icon: "⚡", desc: "Electronics & IoT with Arduino" },
  { name: "Tool", slug: "tool", icon: "🛠️", desc: "Useful tools & software" },
  { name: "Teaching Tips", slug: "teaching-tips", icon: "💡", desc: "Tips & skills for educators" },
  { name: "Education", slug: "education", icon: "📚", desc: "Modern teaching methodologies" },
  { name: "Developer Game", slug: "developer-game", icon: "🎮", desc: "Game development" },
  { name: "STEAM", slug: "steam", icon: "🚀", desc: "Science, Technology, Engineering, Art, Math" },
];

export default async function HomePage() {
  const [featuredPosts, featuredProjects] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: [{ createdAt: "desc" }, { featured: "desc" }],
      take: 6,
    }),
    prisma.project.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-28 md:py-36">
          <div className="flex items-center justify-between gap-8">
            {/* Left content */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                AI Educator & STEAM Trainer
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Technology, AI{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  & Education
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-10">
                Sharing practical knowledge about Artificial Intelligence, Programming, Robotics
                and STEAM Education — empowering the next generation of teachers and learners.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read Posts
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Explore Projects
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-0 mt-10 w-fit rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
                {[
                  { value: "4000+", label: "Teaching Hours", icon: "🎓" },
                  { value: "1000+", label: "Students", icon: "👥" },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex items-center gap-3 px-6 py-4 ${i !== 0 ? "border-l border-white/10" : ""}`}>
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <div className="text-2xl font-bold text-white leading-none">{stat.value}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating Tech Ecosystem */}
            <div className="hidden lg:block flex-shrink-0 w-[420px] h-[420px] relative select-none">
              <style>{`
                @keyframes nmc-float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                }
                @keyframes nmc-pulse-ring {
                  0% { transform: scale(1); opacity: 0.7; }
                  100% { transform: scale(2.8); opacity: 0; }
                }
                @keyframes nmc-glow {
                  0%, 100% { box-shadow: 0 0 24px 4px rgba(99,102,241,0.5); }
                  50% { box-shadow: 0 0 48px 12px rgba(139,92,246,0.7); }
                }
                @keyframes nmc-orbit {
                  from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
                  to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
                }
                @keyframes nmc-orbit-rev {
                  from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
                  to { transform: rotate(-360deg) translateX(110px) rotate(360deg); }
                }
                .nmc-badge-1 { animation: nmc-float 3.2s ease-in-out infinite; }
                .nmc-badge-2 { animation: nmc-float 2.8s ease-in-out infinite 0.6s; }
                .nmc-badge-3 { animation: nmc-float 3.6s ease-in-out infinite 1.1s; }
                .nmc-badge-4 { animation: nmc-float 2.9s ease-in-out infinite 0.3s; }
                .nmc-badge-5 { animation: nmc-float 3.4s ease-in-out infinite 0.9s; }
                .nmc-badge-6 { animation: nmc-float 3.0s ease-in-out infinite 1.5s; }
                .nmc-ring-1 { animation: nmc-pulse-ring 2.4s ease-out infinite; }
                .nmc-ring-2 { animation: nmc-pulse-ring 2.4s ease-out infinite 1.2s; }
                .nmc-center { animation: nmc-glow 3s ease-in-out infinite; }
                .nmc-dot-orbit { animation: nmc-orbit 12s linear infinite; }
                .nmc-dot-orbit-rev { animation: nmc-orbit-rev 8s linear infinite; }
              `}</style>

              {/* Center core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="nmc-ring-1 absolute w-24 h-24 rounded-full border border-indigo-400/60" />
                <div className="nmc-ring-2 absolute w-24 h-24 rounded-full border border-purple-400/50" />
                <div className="nmc-center relative z-10 w-20 h-20 bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 rounded-2xl flex flex-col items-center justify-center shadow-2xl">
                  <span className="text-2xl font-black text-white tracking-tight">NMC</span>
                  <span className="text-[9px] text-blue-200 font-medium tracking-widest">EDUCATOR</span>
                </div>

                {/* Orbiting dots */}
                <div className="absolute w-0 h-0">
                  <div className="nmc-dot-orbit absolute w-2.5 h-2.5 bg-blue-400 rounded-full -ml-1.25 -mt-1.25 shadow-[0_0_8px_2px_rgba(96,165,250,0.8)]" />
                </div>
                <div className="absolute w-0 h-0">
                  <div className="nmc-dot-orbit-rev absolute w-2 h-2 bg-purple-400 rounded-full -ml-1 -mt-1 shadow-[0_0_8px_2px_rgba(192,132,252,0.8)]" style={{animationDelay: '4s'}} />
                </div>
              </div>

              {/* Floating badges — positioned around center (210px center = top/left 50%) */}
              <div className="nmc-badge-1 absolute top-3 left-1/2 -translate-x-1/2 bg-slate-800/70 backdrop-blur-md border border-blue-500/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                <span className="text-xl">🤖</span>
                <div>
                  <div className="text-xs font-bold text-white">Artificial Intelligence</div>
                  <div className="text-[10px] text-slate-400">Machine Learning & AI</div>
                </div>
              </div>

              <div className="nmc-badge-2 absolute top-16 right-0 bg-slate-800/70 backdrop-blur-md border border-purple-500/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                <span className="text-xl">🐍</span>
                <div>
                  <div className="text-xs font-bold text-white">Python</div>
                  <div className="text-[10px] text-slate-400">Programming</div>
                </div>
              </div>

              <div className="nmc-badge-3 absolute bottom-20 right-2 bg-slate-800/70 backdrop-blur-md border border-teal-500/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                <span className="text-xl">🦾</span>
                <div>
                  <div className="text-xs font-bold text-white">Robotics</div>
                  <div className="text-[10px] text-slate-400">Automation & Control</div>
                </div>
              </div>

              <div className="nmc-badge-4 absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-800/70 backdrop-blur-md border border-yellow-500/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="text-xs font-bold text-white">Arduino</div>
                  <div className="text-[10px] text-slate-400">Electronics & IoT</div>
                </div>
              </div>

              <div className="nmc-badge-5 absolute bottom-20 left-2 bg-slate-800/70 backdrop-blur-md border border-green-500/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                <span className="text-xl">🚀</span>
                <div>
                  <div className="text-xs font-bold text-white">STEAM</div>
                  <div className="text-[10px] text-slate-400">Education</div>
                </div>
              </div>

              <div className="nmc-badge-6 absolute top-16 left-0 bg-slate-800/70 backdrop-blur-md border border-pink-500/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                <span className="text-xl">💻</span>
                <div>
                  <div className="text-xs font-bold text-white">Web Dev</div>
                  <div className="text-[10px] text-slate-400">JavaScript & React</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Articles</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">The latest and most useful knowledge</p>
          </div>
          <Link href="/posts" className="hidden sm:inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium">
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, i) => (
              <Link key={post.id} href={`/posts/${post.slug}`}
                className={`group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 fade-in ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
                      {post.category.slug === "ai" ? "🤖" : post.category.slug === "programming" ? "💻" : post.category.slug === "robotics" ? "🦾" : "📚"}
                    </div>
                  )}
                  {post.featured && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${getCategoryColor(post.category.slug)}`}>
                    {post.category.name}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-400">No posts yet. <Link href="/admin" className="text-blue-500 hover:underline">Publish one now</Link></p>
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/posts" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium">
            View all posts →
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Selected personal and educational projects</p>
          </div>
          <Link href="/projects" className="hidden sm:inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium">
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-teal-500 to-blue-600 relative">
                  {project.coverImage && (
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 mt-4">
                    {project.github && (
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">GitHub</span>
                    )}
                    {project.demo && (
                      <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">Demo</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-4xl mb-3">🚀</p>
            <p className="text-slate-400">Projects coming soon</p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Subscribe for New Articles</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Get notified when new articles about AI, Programming and STEAM Education are published.
          </p>
          <NewsletterForm />
          <p className="text-xs text-blue-200 mt-3">No spam. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
}
