import Ribbons from './Ribbons.tsx'

function App() {
  return (
    <div className="page">
      <Ribbons />
      <div className="veil" aria-hidden="true" />

      <div className="content">
        <header>
          <span className="logo">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#DABF84" strokeWidth="3.5" />
              <path
                d="M8 66 C26 52 42 70 58 62 S84 44 93 47"
                fill="none"
                stroke="#F7F1EA"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M12 76 C30 65 48 83 66 74 S88 63 95 64"
                fill="none"
                stroke="#DABF84"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span>
              Anon<span className="gold">Report</span>
            </span>
          </span>
        </header>

        <main className="mid">
          <p className="eyebrow">Anonymous workplace reporting · South Africa</p>
          <h1>
            A fresh look
            <br />
            is on its way.
          </h1>
          <p className="lede">
            We're building a brand-new home for AnonReport. Check back soon.
          </p>
        </main>

        <footer>
          <span className="tagline">Safe. Secure. Anonymous.</span>
          <span>A service from Nxgen HR Consulting</span>
        </footer>
      </div>
    </div>
  )
}

export default App
