import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { circleApi, storyApi } from '../services/api';
import { Navbar } from '../components/Navbar';
import type { Circle, Story } from '../types';

export function CirclePage() {
  const { id } = useParams<{ id: string }>();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [circleCount, setCircleCount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    Promise.all([circleApi.get(Number(id)), storyApi.list(Number(id)), circleApi.list()])
      .then(([circleRes, storiesRes, circlesRes]) => {
        setCircle(circleRes.data);
        setStories(storiesRes.data);
        setCircleCount(circlesRes.data.length);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circle) return;

    setInviteStatus('loading');
    try {
      await circleApi.invite(circle.id, inviteEmail);
      setInviteStatus('success');
      setInviteEmail('');
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteStatus('idle');
      }, 2000);
    } catch {
      setInviteStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Circle not found</h1>
          {circleCount > 1 && (
            <Link to="/dashboard" className="text-yellow-300 hover:text-yellow-300">
              Back to dashboard
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {circleCount > 1 && (
          <Link to="/dashboard" className="text-yellow-300 hover:text-yellow-300 mb-6 inline-block">
            ← Back to dashboard
          </Link>
        )}

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{circle.name}</h1>
              {circle.description && <p className="text-gray-400">{circle.description}</p>}
            </div>
            <div className="flex gap-3">
              <Link
                to="/create-circle"
                className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                + New Circle
              </Link>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 border border-yellow-400 text-yellow-300 rounded-lg hover:bg-yellow-400/10 transition"
              >
                + Invite Member
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {circle.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-1"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-300 to-amber-300 flex items-center justify-center text-black text-xs font-bold">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300">{member.user.name}</span>
                {member.role === 'admin' && (
                  <span className="text-xs text-yellow-300">(admin)</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Stories</h2>
          <Link
            to={`/circles/${circle.id}/new-story`}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            + Start New Story
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-white mb-2">No stories yet</h3>
            <p className="text-gray-400 mb-6">Start the first story in this circle!</p>
            <Link
              to={`/circles/${circle.id}/new-story`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-lg hover:opacity-90 transition"
            >
              Start a Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {stories.map((story, index) => {
              const coverColors = [
                'from-amber-700 to-amber-900',
                'from-emerald-700 to-emerald-900',
                'from-blue-700 to-blue-900',
                'from-purple-700 to-purple-900',
                'from-rose-700 to-rose-900',
                'from-cyan-700 to-cyan-900',
                'from-orange-700 to-orange-900',
                'from-indigo-700 to-indigo-900',
              ];
              const colorClass = coverColors[index % coverColors.length];

              return (
                <Link
                  key={story.id}
                  to={`/stories/${story.id}`}
                  className="group"
                >
                  <div
                    className={`relative aspect-[2/3] bg-gradient-to-br ${colorClass} rounded-sm shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl overflow-hidden`}
                  >
                    {/* Book spine effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20" />

                    {/* Cover content */}
                    <div className="absolute inset-0 p-4 flex flex-col">
                      {/* Status badge */}
                      <div className="flex justify-end mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            story.status === 'active'
                              ? 'bg-green-500/30 text-green-200'
                              : 'bg-black/30 text-gray-300'
                          }`}
                        >
                          {story.status}
                        </span>
                      </div>

                      {/* Title area */}
                      <div className="flex-1 flex flex-col justify-center px-2">
                        <h3 className="text-white font-serif font-bold text-center leading-tight line-clamp-4 text-sm sm:text-base">
                          {story.title}
                        </h3>
                      </div>

                      {/* Bottom decorative line */}
                      <div className="mt-auto">
                        <div className="h-px bg-white/20 mb-3" />
                        <div className="text-center text-white/60 text-[10px] space-y-0.5">
                          <div>{story.contributions_count} contributions</div>
                          <div>{story.word_count} words</div>
                          <div className="pt-1 text-white/40">
                            {new Date(story.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Page edges effect on right */}
                    <div className="absolute right-0 top-2 bottom-2 w-1 flex flex-col justify-between">
                      <div className="h-full bg-gradient-to-l from-white/10 to-transparent" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Invite a member</h2>

            {inviteStatus === 'success' ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">✉️</div>
                <p className="text-yellow-300 font-semibold">Invitation sent!</p>
              </div>
            ) : (
              <form onSubmit={handleInvite}>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition mb-4"
                  placeholder="friend@example.com"
                  required
                />
                {inviteStatus === 'error' && (
                  <p className="text-red-400 text-sm mb-4">Failed to send invitation</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteStatus === 'loading'}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    {inviteStatus === 'loading' ? 'Sending...' : 'Send Invite'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
