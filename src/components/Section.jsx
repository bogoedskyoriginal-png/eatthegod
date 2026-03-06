import { useEffect, useRef, useState } from 'react';

export default function Section({ id, title, subtitle, children, className = '' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={`scroll-mt-24 py-14 md:py-20 ${className}`}>
      <div className={`mx-auto w-[min(1120px,92%)] fade-in ${inView ? 'in-view' : ''}`}>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
