import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, XCircle, Users, Mail, BarChart2, Award,
  Plus, GitCommit, RotateCcw, UserPlus, Activity, PlusCircle, ShieldCheck,
} from 'lucide-react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { PageTransition } from '../../components/shared/PageTransition';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { selectToken, selectOrg } from '../../store/auth/authSelectors';
import {
  fetchDashboardStats,
  fetchDashboardActivity,
  fetchDashboardChart,
} from '../../features/orgDashboard/orgDashboardThunks';
import {
  selectDashboardStats,
  selectDashboardStatsLoading,
  selectDashboardActivity,
  selectDashboardActivityLoading,
  selectDashboardChartData,
  selectDashboardChartLoading,
} from '../../features/orgDashboard/orgDashboardSelectors';
import { TEXT, MUTED, BORDER, BG_SUBTLE, PRIMARY, SPACING, SHADOW, RADIUS, DURATION, SURFACE, WHITE } from '../../styles/tokens';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const ACTION_STYLES = {
  ISSUE:            { color: '#22c55e', Icon: Award },
  REVOKE:           { color: '#ef4444', Icon: RotateCcw },
  INVITE:           { color: '#3b82f6', Icon: Mail },
  RECIPIENT_CREATE: { color: '#8b5cf6', Icon: UserPlus },
};

function ActivityItem({ item }) {
  const { color, Icon } = ACTION_STYLES[item.action] ?? { color: MUTED, Icon: GitCommit };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: SPACING.sm,
        padding: `${SPACING.sm}px 0`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: RADIUS.md,
          backgroundColor: `${color}1a`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={14} color={color} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: TEXT, margin: 0, lineHeight: 1.4 }}>
          {item.description}
        </p>
        <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>
          {relativeTime(item.created_at)}
        </p>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: SPACING.sm, padding: `${SPACING.sm}px 0`, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 30, height: 30, borderRadius: RADIUS.md, backgroundColor: '#e5e7eb', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <ShimmerOverlay />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 11, backgroundColor: '#e5e7eb', borderRadius: 4, width: '70%', position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
            <div style={{ height: 9, backgroundColor: '#e5e7eb', borderRadius: 4, width: '30%', position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShimmerOverlay() {
  return (
    <>
      <style>{`@keyframes bcShimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)',
          backgroundSize: '200% 100%',
          animation: 'bcShimmer 1.4s infinite',
        }}
      />
    </>
  );
}

function BarChart({ data, loading }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    if (!loading && data.length > 0) {
      const id = setTimeout(() => setAnimated(true), 60);
      return () => clearTimeout(id);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140, padding: '0 8px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: `${40 + i * 15}%`, backgroundColor: '#e5e7eb', borderRadius: '4px 4px 0 0', position: 'relative', overflow: 'hidden' }}>
            <ShimmerOverlay />
          </div>
        ))}
      </div>
    );
  }

  if (!data.length) return null;

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartH = 140;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: chartH }}>
        {data.map((d, i) => {
          const pct = d.count / maxCount;
          const barH = Math.max(pct * chartH, d.count > 0 ? 4 : 0);
          const delay = i * 80;
          const isHov = hoveredIdx === i;

          return (
            <div
              key={d.month}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {animated && d.count > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: isHov ? PRIMARY : MUTED, transition: `color ${DURATION.fast}` }}>
                  {d.count}
                </span>
              )}
              <div
                style={{
                  width: '100%',
                  height: animated ? barH : 0,
                  backgroundColor: isHov ? PRIMARY : `${PRIMARY}99`,
                  borderRadius: '4px 4px 0 0',
                  transition: `height ${DURATION.slow} ${delay}ms ease-out, background-color ${DURATION.fast}`,
                  cursor: 'default',
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {data.map((d) => (
          <div key={d.month} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function OrgDashboard() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const token      = useSelector(selectToken);
  const org        = useSelector(selectOrg);

  const stats              = useSelector(selectDashboardStats);
  const statsLoading       = useSelector(selectDashboardStatsLoading);
  const activity           = useSelector(selectDashboardActivity);
  const activityLoading    = useSelector(selectDashboardActivityLoading);
  const chartData          = useSelector(selectDashboardChartData);
  const chartLoading       = useSelector(selectDashboardChartLoading);

  useEffect(() => {
    dispatch(fetchDashboardStats(token));
    dispatch(fetchDashboardActivity(token));
    dispatch(fetchDashboardChart(token));

    function handleFocus() {
      dispatch(fetchDashboardStats(token));
      dispatch(fetchDashboardActivity(token));
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch, token]);

  const STAT_CARDS = [
    { key: 'total_certificates',   title: 'Total Certs',    icon: FileText,    color: '#3B82F6' },
    { key: 'active_certificates',  title: 'Active',         icon: CheckCircle, color: '#22c55e' },
    { key: 'revoked_certificates', title: 'Revoked',        icon: XCircle,     color: '#ef4444' },
    { key: 'total_recipients',     title: 'Recipients',     icon: Users,       color: '#8b5cf6' },
    { key: 'pendingInvites',       title: 'Pending Invites',icon: Mail,        color: '#f59e0b' },
    { key: 'monthlyVerifications', title: 'Verifications',  icon: BarChart2,   color: '#14b8a6' },
  ];

  return (
    <OrgLayout title="Dashboard">
      <PageTransition>
        <PageHeader
          title="Dashboard"
          subtitle={org ? `Welcome back, ${org.org_name}` : 'Welcome back'}
          actions={[{
            label: 'Issue Certificate',
            icon: Plus,
            variant: 'primary',
            onClick: () => navigate('/org/issue'),
          }]}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: SPACING.md,
            marginBottom: SPACING.xl,
          }}
        >
          {STAT_CARDS.map(({ key, title, icon, color }) => (
            <StatCard
              key={key}
              title={title}
              value={stats[key]}
              icon={icon}
              color={color}
              loading={statsLoading}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SPACING.md, marginBottom: SPACING.xl }}>
          {[
            { label: 'Issue Certificate', Icon: PlusCircle, color: PRIMARY,    onClick: () => navigate('/org/certificates?action=issue') },
            { label: 'Invite Recipient',  Icon: UserPlus,   color: '#3B82F6',  onClick: () => navigate('/org/recipients?action=invite') },
            { label: 'Verify Certificate',Icon: ShieldCheck, color: '#8B5CF6', onClick: () => navigate('/org/verify') },
          ].map(({ label, Icon, color, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                display: 'flex', alignItems: 'center', gap: SPACING.sm,
                padding: `${SPACING.md}px ${SPACING.lg}px`,
                backgroundColor: WHITE, border: `1px solid ${BORDER}`,
                borderRadius: RADIUS.md, cursor: 'pointer',
                boxShadow: SHADOW.sm, transition: `transform ${DURATION.normal} ease, box-shadow ${DURATION.normal} ease`,
                textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = SHADOW.md; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOW.sm; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={color} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{label}</span>
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: SPACING.lg,
            marginBottom: SPACING.xl,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: RADIUS.lg,
              border: `1px solid ${BORDER}`,
              padding: SPACING.lg,
              boxShadow: SHADOW.sm,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: `0 0 ${SPACING.md}px` }}>
              Certificate Issuance — Last 6 Months
            </p>
            <BarChart data={chartData} loading={chartLoading} />
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: RADIUS.lg,
              border: `1px solid ${BORDER}`,
              padding: SPACING.lg,
              boxShadow: SHADOW.sm,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 280,
              overflow: 'hidden',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: `0 0 ${SPACING.sm}px`, flexShrink: 0 }}>
              Recent Activity
            </p>
            <div style={{ flex: 1, overflowY: 'auto', marginRight: -4, paddingRight: 4 }}>
              {activityLoading && <ActivitySkeleton />}
              {!activityLoading && activity.length === 0 && (
                <EmptyState
                  icon={Activity}
                  title="No activity yet"
                  description="Actions like issuing and revoking certificates will appear here."
                  style={{ padding: `${SPACING.lg}px 0` }}
                />
              )}
              {!activityLoading && activity.map((item) => (
                <ActivityItem key={item.log_id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </OrgLayout>
  );
}


