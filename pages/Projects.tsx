import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { GlassCard, NeuralButton, NeuralBadge, NeuralInput, NeuralSpinner } from '../components/UIElements';
import { formatDistanceToNow } from 'date-fns';

export const Projects: React.FC = () => {
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    await createProject.mutateAsync({
      name: 'New Project',
      description: 'A new AI-generated project',
      status: 'draft',
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <NeuralSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 space-y-8 max-w-7xl mx-auto animate-modal-fade">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
            Projects
          </h1>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
            {projects.length} total projects
          </p>
        </div>
        <NeuralButton
          onClick={handleCreateProject}
          loading={createProject.isPending}
          variant="primary"
          size="lg"
        >
          <span className="mr-2">✨</span> New Project
        </NeuralButton>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <NeuralInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'draft', 'generating', 'completed', 'deployed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filterStatus === status
                  ? 'bg-[#00DC82] text-black'
                  : 'bg-black/40 text-slate-500 hover:text-white border border-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'grid'
                ? 'bg-[#00DC82] text-black'
                : 'bg-black/40 text-slate-500 hover:text-white border border-white/5'
            }`}
          >
            ▦
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'list'
                ? 'bg-[#00DC82] text-black'
                : 'bg-black/40 text-slate-500 hover:text-white border border-white/5'
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <GlassCard className="p-16 text-center space-y-6">
          <div className="text-6xl">📊</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">No projects found</h3>
            <p className="text-slate-500 text-sm">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first project to get started'}
            </p>
          </div>
          {!searchQuery && filterStatus === 'all' && (
            <NeuralButton
              onClick={handleCreateProject}
              variant="primary"
              size="lg"
            >
              <span className="mr-2">✨</span> Create First Project
            </NeuralButton>
          )}
        </GlassCard>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <GlassCard key={project.id} className="p-6 space-y-4 group hover:border-[#00DC82]/30 transition-all">
              {/* Project thumbnail */}
              <div className="aspect-video rounded-xl bg-gradient-to-br from-[#00DC82]/20 to-blue-500/20 flex items-center justify-center text-4xl overflow-hidden">
                {project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                  <span>📊</span>
                )}
              </div>

              {/* Project info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-black text-white truncate flex-1">
                    {project.name}
                  </h3>
                  <NeuralBadge variant={
                    project.status === 'deployed' ? 'primary' :
                    project.status === 'completed' ? 'secondary' : undefined
                  }>
                    {project.status}
                  </NeuralBadge>
                </div>

                {project.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-600">
                  <span>{project.framework || 'React'}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-lg bg-black/40 text-[8px] font-bold text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <NeuralButton variant="secondary" size="xs" className="flex-1">
                  View
                </NeuralButton>
                <NeuralButton variant="ghost" size="xs" className="flex-1">
                  Edit
                </NeuralButton>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <GlassCard key={project.id} className="p-6 flex items-center gap-6 hover:border-[#00DC82]/30 transition-all">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#00DC82]/20 to-blue-500/20 flex items-center justify-center text-2xl shrink-0">
                {project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span>📊</span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-white truncate">
                    {project.name}
                  </h3>
                  <NeuralBadge variant={
                    project.status === 'deployed' ? 'primary' :
                    project.status === 'completed' ? 'secondary' : undefined
                  }>
                    {project.status}
                  </NeuralBadge>
                </div>

                {project.description && (
                  <p className="text-sm text-slate-400 line-clamp-1">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-slate-600">
                  <span>{project.framework || 'React'}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                  {project.is_public && (
                    <>
                      <span>•</span>
                      <span className="text-[#00DC82]">Public</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <NeuralButton variant="secondary" size="xs">
                  View
                </NeuralButton>
                <NeuralButton variant="ghost" size="xs">
                  Edit
                </NeuralButton>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
