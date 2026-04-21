import PaletteSwitcher from './PaletteSwitcher';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="stamp">SPACE<em>#</em>HASH</div>
      <div className="meta">
        <span className="coords">35.0844°N/106.6504°W</span>
        <PaletteSwitcher />
      </div>
    </div>
  );
}
