interface Step {
  text: string
  note?: string
  status?: 'success' | 'error'
}

interface ColConfig {
  title: string
  steps: Step[]
}

interface FlowCompareProps {
  left: ColConfig
  right: ColConfig
}

function StepBox({ step }: { step: Step }) {
  const borderColor =
    step.status === 'error'
      ? '#ef4444'
      : step.status === 'success'
        ? '#22c55e'
        : 'var(--color-accent)'

  const bg =
    step.status === 'error'
      ? 'color-mix(in srgb, #ef4444 8%, transparent)'
      : step.status === 'success'
        ? 'color-mix(in srgb, #22c55e 8%, transparent)'
        : 'color-mix(in srgb, var(--color-artifact) 40%, transparent)'

  return (
    <div
      className="w-full rounded-md border-l-2 px-3 py-2"
      style={{ borderColor, background: bg }}
    >
      <div className="text-sm font-medium text-primary">{step.text}</div>
      {step.note && (
        <div className="mt-0.5 text-xs text-secondary">{step.note}</div>
      )}
    </div>
  )
}

function FlowColumn({ col }: { col: ColConfig }) {
  return (
    <div className="flex flex-col">
      <div className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-accent">
        {col.title}
      </div>
      {col.steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center">
          <StepBox step={step} />
          {i < col.steps.length - 1 && (
            <div className="py-0.5 text-sm text-secondary">↓</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function FlowCompare({ left, right }: FlowCompareProps) {
  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FlowColumn col={left} />
      <FlowColumn col={right} />
    </div>
  )
}
