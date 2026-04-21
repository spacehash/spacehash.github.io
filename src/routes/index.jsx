export default function HomePage() {
  return (
    <div className="phone-column home">
      <div className="home-hero">
        <div className="home-eyebrow">
          <span>SYS://SPACEHASH</span>
          <span>DJ RIG SUPPLY · ALBUQUERQUE NM</span>
        </div>

        <div className="home-title-wrap">
          <div className="orbit" aria-hidden="true">
            <svg viewBox="-200 -200 400 400" preserveAspectRatio="xMidYMid meet">
              <circle className="path" cx="0" cy="0" r="180" />
              <circle className="path" cx="0" cy="0" r="130" />
              <circle className="path" cx="0" cy="0" r="80" />
            </svg>
          </div>
          <h1 className="home-title">
            <span className="line">SPACE</span>
            <span className="line italic"><span className="hash">#</span>HASH</span>
          </h1>
        </div>

        <div className="home-footline">
          <span>BUILD.2026.04</span>
          <span>UPLINK: OK</span>
          <span>MODULES: RENTALS / EVENTS / LOGS</span>
        </div>
      </div>
    </div>
  );
}
