import Button from '../common/Button';

export default function AvailabilityForm({ values, onChange, onSubmit, loading }) {
  const set = (k) => (e) => onChange({ ...values, [k]: e.target.value });
  const TIMES = Array.from({length:24},(_,i) => {
    const label = i===0?'12:00 AM':i<12?`${i}:00 AM`:i===12?'12:00 PM':`${i-12}:00 PM`;
    return { value:`${String(i).padStart(2,'0')}:00`, label };
  });

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit(values); }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Wake Time</label>
          <select className="input" value={values.wakeTime||'07:00'} onChange={set('wakeTime')}>
            {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Sleep Time</label>
          <select className="input" value={values.sleepTime||'23:00'} onChange={set('sleepTime')}>
            {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Deep Work Start</label>
          <select className="input" value={values.deepWorkStart||'09:00'} onChange={set('deepWorkStart')}>
            {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Deep Work End</label>
          <select className="input" value={values.deepWorkEnd||'12:00'} onChange={set('deepWorkEnd')}>
            {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Preferred Study Time</label>
        <select className="input" value={values.preferredStudyTime||'evening'} onChange={set('preferredStudyTime')}>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>
      <Button type="submit" loading={loading} className="w-full">Save Preferences</Button>
    </form>
  );
}
