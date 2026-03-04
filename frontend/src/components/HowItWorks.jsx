const steps = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Sign up in seconds — just a username, email, and password. No credit card required.',
  },
  {
    num: '02',
    title: 'Set up your organization',
    desc: 'Create a workspace for your team or join an existing one via an invite request.',
  },
  {
    num: '03',
    title: 'Build & send quotes',
    desc: 'Add line items, set prices, and share a polished quote with your client instantly.',
  },
  {
    num: '04',
    title: 'Convert & get paid',
    desc: 'Once accepted, convert the quote to an invoice with one click and track payment status.',
  },
]

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="container">
        <span className="section-label">How it works</span>
        <h2 className="section-title">
          Up and running in{' '}
          <span className="gradient-text">four steps</span>
        </h2>
        <p className="section-sub">
          No long onboarding. No bloat. Just a clear path from quote to cash.
        </p>

        <div className="steps">
          {steps.map((s) => (
            <div key={s.num} className="step">
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
