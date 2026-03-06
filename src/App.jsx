import Section from './components/Section';
import { profileData } from './data/profileData';

const sectionLinks = [
  ['about', 'Обо мне'],
  ['skills', 'Компетенции'],
  ['experience', 'Опыт'],
  ['cases', 'Кейсы'],
  ['contacts', 'Контакты']
];

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex w-[min(1120px,92%)] items-center justify-between py-3">
          <a href="#top" className="text-sm font-semibold tracking-wide text-slate-900">
            MV · BA Portfolio
          </a>
          <ul className="hidden gap-5 text-sm text-slate-600 md:flex">
            {sectionLinks.map(([id, label]) => (
              <li key={id}>
                <a className="transition hover:text-slate-900" href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top">
        <section className="py-12 md:py-20">
          <div className="mx-auto grid w-[min(1120px,92%)] items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl p-6 md:p-10 glass shadow-glass">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent-600">Бизнес-аналитик в digital / fintech / AI</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">{profileData.name}</h1>
              <p className="mt-3 text-lg text-slate-700 md:text-xl">{profileData.role} · {profileData.focus}</p>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{profileData.summary}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={profileData.contacts.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Написать в Telegram
                </a>
                <a
                  href="#cases"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white/90"
                >
                  Смотреть кейсы
                </a>
                <a
                  href={profileData.contacts.cv}
                  className="rounded-xl border border-accent-100 bg-accent-50 px-5 py-3 text-sm font-medium text-accent-600 transition hover:-translate-y-0.5 hover:bg-accent-100"
                >
                  Скачать CV (PDF)
                </a>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {profileData.highlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl p-4 glass shadow-glass">
              <img
                src={profileData.avatar}
                alt="Фотография Михаила Васильева"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Если хотите использовать приложенное фото, сохраните файл в <code>public/profile-photo-placeholder.svg</code>.
              </p>
            </aside>
          </div>
        </section>

        <Section id="about" title="Обо мне" subtitle="Профессионально-дружелюбный профиль для личного бренда и поиска новых карьерных возможностей.">
          <div className="rounded-3xl p-6 md:p-8 glass shadow-glass">
            <p className="text-sm leading-7 text-slate-700 md:text-base">{profileData.about}</p>
          </div>
        </Section>

        <Section id="skills" title="Ключевые компетенции" subtitle="Компетенции сгруппированы так, чтобы за 30–60 секунд был понятен ваш реальный рабочий профиль в AI-продукте.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(profileData.competencies).map(([group, items]) => (
              <article key={group} className="rounded-2xl p-5 glass shadow-glass">
                <h3 className="text-base font-semibold text-slate-900">{group}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Опыт" subtitle="Не сухой список, а карьерная история с фокусом на ценность для продукта и команд.">
          {profileData.experience.map((item) => (
            <article key={item.company} className="rounded-3xl p-6 glass shadow-glass md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">{item.period}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-accent-600">{item.company}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">{item.story}</p>
            </article>
          ))}
        </Section>

        <Section id="cases" title="Кейсы и проекты" subtitle="Каждая карточка показывает контекст, проблему, конкретные действия и бизнес-результат.">
          <div className="grid gap-4 lg:grid-cols-2">
            {profileData.cases.map((item) => (
              <article key={item.title} className="group rounded-3xl p-6 glass shadow-glass transition hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <dl className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <div>
                    <dt className="font-medium text-slate-800">Контекст</dt>
                    <dd>{item.context}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-800">Проблема</dt>
                    <dd>{item.challenge}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-800">Что делал</dt>
                    <dd>{item.actions}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-800">Результат</dt>
                    <dd>{item.result}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Section>

        <Section id="education" title="Образование и развитие" subtitle="Замените placeholder-поля на фактические данные перед публикацией.">
          <div className="rounded-3xl p-6 glass shadow-glass md:p-8">
            <ul className="space-y-3 text-sm text-slate-600 md:text-base">
              {profileData.education.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>

      <footer id="contacts" className="border-t border-white/60 py-10">
        <div className="mx-auto grid w-[min(1120px,92%)] gap-6 rounded-3xl p-6 glass shadow-glass md:grid-cols-2 md:p-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Контакты</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Готов к продуктовым задачам в AI/fintech и проектам, где важны структурные требования, UX-логика и работа с данными.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              Telegram:{' '}
              <a className="text-accent-600 transition hover:text-accent-500" href={profileData.contacts.telegram}>
                @eatthegod
              </a>
            </li>
            <li>Email: {profileData.contacts.email}</li>
            <li>HH: {profileData.contacts.hh}</li>
            <li>LinkedIn: {profileData.contacts.linkedin}</li>
            <li>GitHub: {profileData.contacts.github}</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
