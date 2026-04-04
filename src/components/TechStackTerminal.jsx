export default function TechStackTerminal() {
  return (
    <section className="tech-terminal" aria-label="Code preview">
      <div className="tech-terminal__chrome">
        <div className="tech-terminal__titlebar">
          <span className="tech-terminal__dot" />
          <span className="tech-terminal__dot tech-terminal__dot--amber" />
          <span className="tech-terminal__dot tech-terminal__dot--cyan" />
          <span>sinxode — views.py</span>
        </div>
        <pre className="tech-terminal__body">
          <code>
            <div className="tech-terminal__line">
              <span className="tech-terminal__kw">from</span> rest_framework
              <span className="tech-terminal__kw"> import </span>
              viewsets
            </div>
            <div className="tech-terminal__line">
              <span className="tech-terminal__kw">class</span>{' '}
              <span className="tech-terminal__fn">ProjectViewSet</span>(
              <span className="tech-terminal__fn">viewsets</span>.ModelViewSet):
            </div>
            <div className="tech-terminal__line">
              {'    '}queryset = <span className="tech-terminal__fn">Project</span>.objects.
              <span className="tech-terminal__fn">all</span>()
            </div>
            <div className="tech-terminal__line">
              {'    '}serializer_class = <span className="tech-terminal__fn">ProjectSerializer</span>
            </div>
            <div className="tech-terminal__line tech-terminal__comment"># Neon UI consumes this via /api/projects/</div>
          </code>
        </pre>
      </div>
      <div className="tech-terminal__chrome" style={{ marginTop: '1.25rem' }}>
        <div className="tech-terminal__titlebar">
          <span className="tech-terminal__dot" />
          <span className="tech-terminal__dot tech-terminal__dot--amber" />
          <span className="tech-terminal__dot tech-terminal__dot--cyan" />
          <span>sinxode — useWavePhase.ts</span>
        </div>
        <pre className="tech-terminal__body">
          <code>
            <div className="tech-terminal__line">
              <span className="tech-terminal__kw">export function</span>{' '}
              <span className="tech-terminal__fn">buildSinePath</span>(
              <span className="tech-terminal__decor">width</span>,{' '}
              <span className="tech-terminal__decor">amp</span>,{' '}
              <span className="tech-terminal__decor">phase</span>) {'{'}
            </div>
            <div className="tech-terminal__line">
              {'  '}<span className="tech-terminal__kw">return</span> paths.
              <span className="tech-terminal__fn">map</span>((t) =&gt;{' '}
              <span className="tech-terminal__fn">Math</span>.
              <span className="tech-terminal__fn">sin</span>(t + phase) * amp)
            </div>
            <div className="tech-terminal__line">{'}'}</div>
            <div className="tech-terminal__line tech-terminal__comment">// Scroll depth drives phase on the hero ∿</div>
          </code>
        </pre>
      </div>
    </section>
  )
}
