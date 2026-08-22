export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="wrap footer">
      <span>© {year} Kumaran M — Built with React &amp; Vite</span>
      <span>DWG NO. PORTFOLIO-001 · SCALE N/A · REV 1.0</span>
    </footer>
  )
}
