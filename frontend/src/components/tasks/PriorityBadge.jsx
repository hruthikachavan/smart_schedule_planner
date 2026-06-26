import { clsx } from 'clsx';
import { getQuadrantConfig } from '../../constants/priorities';

export default function PriorityBadge({ quadrant, importance, size = 'sm' }) {
  // Show quadrant label if available, else derive from importance
  const q = quadrant || (importance >= 4 ? 'DO_FIRST' : importance >= 3 ? 'SCHEDULE' : importance >= 2 ? 'DELEGATE' : 'ELIMINATE');
  const cfg = getQuadrantConfig(q);
  return (
    <span className={clsx('inline-flex items-center gap-1.5 font-medium rounded-lg', cfg.bg, cfg.text, size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs')}>
      <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', cfg.dot)} />
      {cfg.label}
    </span>
  );
}
