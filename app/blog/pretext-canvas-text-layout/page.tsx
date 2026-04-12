import type { Metadata } from 'next'
import PretextDemo from '@/components/blog/PretextDemo'
import BlogPostLayout from '@/components/blog/BlogPostLayout'

export const metadata: Metadata = {
  title: 'Canvas Text Layout - Yi Wang',
  description: 'How a canvas-based text layout engine works — measuring text, carving slots around obstacles, and reflowing around moving objects in real time.',
}

const DEMO_TEXT = `Traditional CSS text layout is a black box — the browser decides where lines break and you adapt around it. A canvas-based text layout engine inverts this: you measure text yourself, then decide exactly where each line breaks based on whatever geometry you want. This enables text that flows around moving objects in real time. Before any layout can happen, the text is measured upfront using a font-aware library. This builds an internal map of every character's width for a given font. This measurement step is expensive and only done once — the result is a prepared text object that can be queried repeatedly at negligible cost. From this prepared object you can ask: given a cursor position and a maximum width, how much text fits on one line? — and get back the text content, its rendered width, and where the cursor ends up. This is the primitive everything else is built on. Text is laid out one horizontal band at a time, top to bottom. A band is a strip of space exactly one line-height tall at a specific vertical position. For each band, every obstacle reports what horizontal range it blocks, those blocked intervals are carved out of the available width, and each remaining slot is filled left to right with as much text as fits. The result is a flat array of positioned lines — each with an x, y, and text content — ready to be written to the DOM. Because obstacles are rebuilt fresh every frame from the object's current position, text automatically reflows around anything that moves. The layout engine doesn't care how an object got to its position — it only sees the current x, y, and radius. Layout produces data, not DOM. The DOM write is a separate final step each frame. Element pooling avoids creating and destroying DOM nodes every frame — a fixed pool of elements is maintained, grown when needed, with extras hidden. Each frame just updates text content and position on existing elements, which is significantly faster than creating new nodes.`

export default function PretextCanvasTextLayoutPage() {
  return (
    <div className="pt-16 md:pt-20 lg:pt-24">
      {/* ── hero demo ── */}
      <section className="flex flex-col gap-4 h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-6rem)]">
        <PretextDemo bodyText={DEMO_TEXT} />
        <p className="text-center text-sm text-stone-400 pointer-events-none select-none shrink-0">
          move your mouse · drag your dragon
        </p>
      </section>

      {/* ── article ── */}
      <BlogPostLayout
        title="Canvas Text Layout"
        date="2026-04-10"
        description="How a layout engine inverts CSS — measuring, carving, and reflowing text around moving objects in real time."
        tags={['canvas', 'text-layout', 'typescript', 'animation']}
      >
        <article className="prose max-w-none">

          <h2>The core idea</h2>
          <p>
            Traditional CSS text layout is a black box — the browser decides where lines break and you adapt around it.
            A canvas-based text layout engine inverts this: you measure text yourself, then decide exactly where each
            line breaks based on whatever geometry you want. This enables text that flows around moving objects in real time.
          </p>

          <h2>Text measurement</h2>
          <p>
            Before any layout can happen, the text is measured upfront using a font-aware library. This builds an
            internal map of every character&apos;s width for a given font. This measurement step is expensive and
            only done once — the result is a prepared text object that can be queried repeatedly at negligible cost.
          </p>
          <p>
            From this prepared object you can ask: <em>&quot;given a cursor position and a maximum width, how much text fits on one line?&quot;</em> — and get back the text content, its rendered width, and where the cursor ends up. This is the primitive everything else is built on.
          </p>
          <pre><code>{`const prepared = prepareWithSegments(text, font)
const line = layoutNextLine(prepared, cursor, maxWidth)
// → { text, width, end: nextCursor }`}</code></pre>

          <h2>The layout loop</h2>
          <p>Text is laid out one horizontal band at a time, top to bottom. A band is a strip of space exactly one line-height tall at a specific vertical position. For each band:</p>
          <ol>
            <li>Ask every obstacle: &quot;what horizontal range do you block at this height?&quot; → returns an interval <code>{`{ left, right }`}</code></li>
            <li>Carve those blocked intervals out of the full available width → remaining usable ranges are slots</li>
            <li>Fill each slot left to right with as much text as fits</li>
            <li>Advance down one line height and repeat</li>
          </ol>
          <p>The result is a flat array of positioned lines — each with an x, y, width, and text content — ready to be written to the DOM.</p>

          <h2>Obstacles</h2>
          <p>Two types of obstacles are supported, each requiring different math to compute their blocked interval per band.</p>
          <p>
            <strong>Circle obstacles</strong> — their footprint on a band varies by height. Wide in the middle, narrow near the top and bottom.
            The blocked width at a given band is computed using the circle equation: find the minimum vertical distance
            from the circle center to the band, then use Pythagoras to get the horizontal extent.
          </p>
          <pre><code>{`const minDy = /* distance from circle center to band */
const maxDx = Math.sqrt(r * r - minDy * minDy)
// blocked = { left: cx - maxDx - pad, right: cx + maxDx + pad }`}</code></pre>
          <p>
            <strong>Rect obstacles</strong> — fixed rectangles that block the same width on every band they cover.
            No math needed beyond a simple overlap check.
          </p>

          <h2>Moving objects</h2>
          <p>
            Because obstacles are rebuilt fresh every frame from the object&apos;s current position,
            text automatically reflows around anything that moves. The layout engine doesn&apos;t care
            how an object got to its position — it only sees the current x, y, and radius.
          </p>
          <p>
            The dragon above follows your cursor using a simple step each frame: compute the vector to
            the target, normalize it to get direction, multiply by speed × dt. Normalization —
            dividing both components by the distance — separates direction from magnitude, allowing
            speed to be controlled independently.
          </p>
          <pre><code>{`const dist = Math.sqrt(dx * dx + dy * dy)
const step = Math.min(speed * dt, dist - stopDist)
dragon.x += (dx / dist) * step
dragon.y += (dy / dist) * step`}</code></pre>

          <h2>The animation loop</h2>
          <p>
            No <code>setInterval</code> or <code>while</code> loop.
            The loop is a self-scheduling chain where each frame only re-queues the next frame if something is still moving.
            When the dragon is idle, the loop goes idle and stops consuming CPU entirely.
            Any external event — pointer move, resize — restarts it by queuing one frame.
          </p>

          <h2>DOM output</h2>
          <p>
            Layout produces data, not DOM. The DOM write is a separate final step each frame.
            Element pooling avoids creating and destroying DOM nodes every frame — a fixed pool of
            elements is maintained, grown when needed, with extras hidden. Each frame just updates
            text content and position on existing elements, which is significantly faster than
            creating new nodes.
          </p>

          <h2>Why this approach</h2>
          <p>
            The old approach is CSS layout. The browser handles everything — line breaking, wrapping, flow.
            You write some markup, apply styles, and the engine figures out where text goes.
          </p>
          <p>
            The downside is that CSS layout runs once and is fixed relative to the document flow. You can
            float an image and text will wrap around it — but only rectangles, only static elements, and
            only within normal document flow. There is no way to make text reflow around a circle, around
            an element that moves, or around arbitrary geometry. The browser gives you no hook into the
            line-breaking process. And if you try to animate it by updating the DOM every frame, you
            destroy and reconstruct nodes on each tick — which is expensive and causes visible jank.
          </p>
          <p>
            When text changes position — say, an obstacle moves — the browser needs to recalculate where
            every line breaks. This process is called <em>reflow</em>. The browser measures each
            element&apos;s size and position, resolves how content wraps, then repaints the screen.
            Reflow is triggered any time the DOM structure or geometry changes. For animated layout,
            the naive solution is to tear out the old DOM nodes and insert new ones with updated
            positions. But this forces a full reflow on every frame: the browser discards its cached
            layout, remeasures everything from scratch, and repaints. At 60fps, that cost adds up fast.
          </p>
          <p>
            This approach takes ownership of the entire pipeline — measurement, line breaking, obstacle
            math, DOM writes — and runs it every frame. The cost is complexity. The benefit is that you
            can do things CSS simply cannot: text flowing around a curve, around overlapping shapes,
            around objects that move in real time. Any geometry becomes a valid obstacle. Any moving
            object can push text out of the way.
          </p>

          <h2>Pitfall: stage is possibly null</h2>
          <p>
            When using <code>useRef</code> in React, the ref is typed as <code>HTMLDivElement | null</code> because
            the element doesn&apos;t exist yet at the time the component function runs — it only gets
            attached after the first render. TypeScript sees the ref as potentially null everywhere,
            including inside nested functions like <code>syncPool</code>,
            even if you&apos;ve already checked it at the top of the effect.
          </p>
          <p>
            The cause is that TypeScript&apos;s null narrowing doesn&apos;t carry into closures. When you
            write <code>if (!stage) return</code>, TypeScript narrows <code>stage</code> to non-null for
            the rest of that block — but inside a nested function defined later, it can&apos;t guarantee
            the narrowing still holds, since the function could be called at any time.
          </p>
          <p>
            A common but unsafe fix is the non-null assertion operator <code>!</code> — writing <code>stage!.appendChild(el)</code>.
            This simply tells TypeScript to stop complaining without any actual check. If <code>stage</code> were
            ever null at runtime, it would throw — silently bypassing the type system is never the right answer.
          </p>
          <p>
            The safe fix is narrowing by assignment. After the null check, assign <code>stage</code> to
            a new variable typed as <code>HTMLDivElement</code> — not nullable. TypeScript infers from
            the assignment that this variable can never be null, and that narrowing carries into any
            closure that uses it:
          </p>
          <pre><code>{`const stage = stageRef.current
if (!stage) return
const container: HTMLDivElement = stage  // narrowed — TypeScript knows this is non-null

function syncPool(...) {
  container.appendChild(el)   // ✓ safe in closures
}

const pageWidth = container.clientWidth  // ✓
container.style.cursor = 'grabbing'      // ✓`}</code></pre>
          <p>
            Unlike <code>!</code>, this approach doesn&apos;t bypass the type system — it works with it.
            TypeScript understands that <code>container</code> was assigned from a non-null value and
            will enforce that contract everywhere it&apos;s used.
          </p>

        </article>
      </BlogPostLayout>
    </div>
  )
}
