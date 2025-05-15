export default function Loading() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 flex items-center justify-center min-h-screen">
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4 mx-auto w-1/3"></div>
            <div className="h-32 bg-white/10 rounded-lg mb-4"></div>
            <div className="h-10 bg-white/10 rounded-lg w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    </main>
  )
} 