import { useEffect, useRef, useState } from 'react';
import { Director, SCENES } from './director';

const NAV = SCENES.filter(s => s.id !== 'hero' && s.id !== 'archive');

export default function App() {
  const host = useRef<HTMLDivElement>(null);
  const cut = useRef<SVGSVGElement>(null);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const d = new Director(host.current!, cut.current!);
    const off = d.onChange(setIndex);
    if (import.meta.env.DEV) (window as any).__dir = d;
    d.start();
    return () => { off(); d.destroy(); };
  }, []);

  const cur = SCENES[index]?.id;
  const onNav = cur === 'archive' ? 'work' : cur;

  return (
    <>
      <div ref={host} className="stage" />
      <svg ref={cut} className="cut" aria-hidden="true">
        <line className="glow" /><line className="core" />
      </svg>
      <nav className={'way' + (index > 0 ? ' on' : '')} aria-label="Sections">
        <a className="mr" href="#top" aria-label="Back to the start">MR</a>
        <ol>
          {NAV.map(s => (
            <li key={s.id}>
              <a href={'#' + s.hash} aria-current={onNav === s.id ? 'true' : undefined}><sup>{s.num}</sup>{s.label}</a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
