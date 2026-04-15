import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { useSceneStore } from '@/store/sceneStore';
import { TEMPLATE_FACTORIES } from '@/assets/templates/templates';
import {
  Plus, FolderOpen, FileText, Clock, Trash2, Copy,
  GraduationCap, Monitor, FlaskConical, Laptop, BookOpen, Presentation, Shapes
} from 'lucide-react';

const TEMPLATES = [
  { id: 'normal', name: '普通教室', icon: BookOpen, desc: '标准教学教室，含课桌椅、黑板、讲台', color: '#2563EB' },
  { id: 'recording', name: '精品录播教室', icon: Monitor, desc: '含录播系统、PTZ摄像头、音响系统', color: '#7C3AED' },
  { id: 'computer', name: '计算机教室', icon: Laptop, desc: '含电脑终端、充电柜、网络设备', color: '#0891B2' },
  { id: 'lab', name: '科学实验室', icon: FlaskConical, desc: '含实验台、传感器、数码显微镜', color: '#059669' },
  { id: 'seminar', name: '研讨教室', icon: Presentation, desc: '灵活布局、交互大屏、无线投屏', color: '#D97706' },
  { id: 'steam', name: 'STEAM 教室', icon: Shapes, desc: '创客设备、编程终端、3D打印', color: '#DC2626' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { recentProjects, createProject, removeRecentProject } = useProjectStore();

  const handleNewBlank = async () => {
    const proj = await createProject('未命名项目');
    navigate(`/editor/${proj.id}`);
  };

  const handleFromTemplate = async (templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    const project = await createProject(tpl ? `${tpl.name} - 新方案` : '未命名项目');
    // Load template scene if available
    const factory = TEMPLATE_FACTORIES[templateId];
    if (factory) {
      const templateScene = factory();
      useSceneStore.getState().setScene(templateScene);
      await useProjectStore.getState().saveCurrentProject(templateScene);
    }
    navigate(`/editor/${project.id}`);
  };

  const handleOpenRecent = (project: typeof recentProjects[0]) => {
    useProjectStore.getState().setCurrentProject(project);
    navigate(`/editor/${project.id}`);
  };

  const handleImportCRS = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.crs,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const project = JSON.parse(content);
          if (project && project.id && project.schemes) {
            project.id = crypto.randomUUID();
            project.updatedAt = new Date().toISOString();
            
            const { initProjects } = useProjectStore.getState();
            import('@/lib/db').then(async ({ saveProject }) => {
               await saveProject(project);
               await initProjects();
               navigate(`/editor/${project.id}`);
            });
          }
        } catch (err) {
          console.error("Invalid project file", err);
          alert("无效的项目文件");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        padding: '32px 48px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
        }}>
          <GraduationCap size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
            ClassRoom Studio
          </h1>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
            教育信息化教室场景配置与展示工具
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '36px 48px', overflow: 'auto' }}>
        {/* Quick Actions */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
            快速开始
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={handleNewBlank}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              }}
              onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Plus size={18} /> 空白项目
            </button>
            <button
              onClick={handleImportCRS}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 24px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#CBD5E1', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <FolderOpen size={18} /> 打开项目文件
            </button>
          </div>
        </section>

        {/* Templates */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
            教室模板
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 12,
          }}>
            {TEMPLATES.map(tpl => {
              const Icon = tpl.icon;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleFromTemplate(tpl.id)}
                  style={{
                    padding: 20, borderRadius: 12, textAlign: 'left',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#E2E8F0', cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = tpl.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 20px ${tpl.color}22`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: `${tpl.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={tpl.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{tpl.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 1.4 }}>{tpl.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Projects */}
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
            最近项目
          </h2>
          {recentProjects.length === 0 ? (
            <div style={{
              padding: '48px 0', textAlign: 'center',
              color: '#475569', fontSize: 14,
            }}>
              <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>还没有项目，点击上方按钮创建第一个项目</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 12,
            }}>
              {recentProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => handleOpenRecent(project)}
                  style={{
                    padding: 16, borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div style={{
                    height: 100, borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FileText size={28} color="#475569" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{project.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                    <Clock size={12} />
                    {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeRecentProject(project.id); }}
                      style={{
                        padding: '4px 8px', borderRadius: 4, fontSize: 11,
                        background: 'rgba(220,38,38,0.1)', border: 'none',
                        color: '#F87171', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Trash2 size={11} /> 移除
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      style={{
                        padding: '4px 8px', borderRadius: 4, fontSize: 11,
                        background: 'rgba(255,255,255,0.06)', border: 'none',
                        color: '#94A3B8', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Copy size={11} /> 复制
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: '#475569', fontSize: 12,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>ClassRoom Studio v0.1.0</span>
        <span>教育信息化方案可视化配置工具</span>
      </footer>
    </div>
  );
}
