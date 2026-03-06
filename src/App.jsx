import { useMemo, useState } from 'react';

const BIG_HIT_PRICE = 235;

const initialForm = {
  initialAmount: '300000',
  monthlyContribution: '20000',
  annualRate: '12',
  years: '10'
};

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0
});

const decimalFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const millionFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

function formatRubles(value) {
  return `${numberFormatter.format(Math.max(0, value))} ₽`;
}

function formatMillionsRubles(value) {
  const millions = Math.max(0, value) / 1_000_000;
  return `${millionFormatter.format(millions)} млн ₽`;
}

function formatBigHits(value) {
  return `${decimalFormatter.format(Math.max(0, value))} Биг Хитов`;
}

function validateForm(values) {
  const errors = {};

  if (values.initialAmount === '' || Number(values.initialAmount) < 0) {
    errors.initialAmount = 'Введите стартовую сумму от 0 ₽.';
  }

  if (values.monthlyContribution === '' || Number(values.monthlyContribution) < 0) {
    errors.monthlyContribution = 'Ежемесячное пополнение не может быть меньше 0 ₽.';
  }

  const rate = Number(values.annualRate);
  if (values.annualRate === '' || Number.isNaN(rate) || rate <= -100 || rate > 200) {
    errors.annualRate = 'Укажите годовую доходность в диапазоне от -99.9% до 200%.';
  }

  const years = Number(values.years);
  if (values.years === '' || Number.isNaN(years) || years <= 0 || years > 60) {
    errors.years = 'Срок должен быть больше 0 и не больше 60 лет.';
  }

  return errors;
}

function calculateInvestment(values) {
  const initialAmount = Number(values.initialAmount);
  const monthlyContribution = Number(values.monthlyContribution);
  const annualRate = Number(values.annualRate);
  const years = Number(values.years);

  const totalMonths = Math.round(years * 12);
  const monthlyRate = (1 + annualRate / 100) ** (1 / 12) - 1;

  let balance = initialAmount;
  const history = [{ month: 0, balance }];

  for (let month = 1; month <= totalMonths; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    history.push({ month, balance });
  }

  const totalInvested = initialAmount + monthlyContribution * totalMonths;
  const totalAmount = balance;
  const profit = totalAmount - totalInvested;

  return {
    totalAmount,
    totalInvested,
    profit,
    totalAmountBigHits: totalAmount / BIG_HIT_PRICE,
    totalInvestedBigHits: totalInvested / BIG_HIT_PRICE,
    profitBigHits: profit / BIG_HIT_PRICE,
    history
  };
}

function Chart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const width = 920;
  const height = 360;
  const margin = { top: 18, right: 20, bottom: 52, left: 72 };

  const candles = useMemo(() => {
    if (data.length < 2) return [];

    const monthlyCount = data.length - 1;
    const totalYears = Math.ceil(monthlyCount / 12);

    return Array.from({ length: totalYears }, (_, index) => {
      const startMonth = index * 12;
      const endMonth = Math.min((index + 1) * 12, monthlyCount);
      const open = data[startMonth]?.balance ?? 0;
      const close = data[endMonth]?.balance ?? open;

      const range = data.slice(startMonth, endMonth + 1).map((item) => item.balance);
      const high = Math.max(...range, open, close);
      const low = Math.min(...range, open, close);

      return {
        label: `Год ${index + 1}`,
        open,
        close,
        high,
        low
      };
    });
  }, [data]);

  const minValue = useMemo(() => Math.min(...candles.map((item) => item.low), 0), [candles]);
  const maxValue = useMemo(() => Math.max(...candles.map((item) => item.high), 1), [candles]);

  const yScale = (value) => {
    const innerHeight = height - margin.top - margin.bottom;
    if (maxValue === minValue) return margin.top + innerHeight / 2;
    return margin.top + ((maxValue - value) / (maxValue - minValue)) * innerHeight;
  };

  const xMetrics = useMemo(() => {
    const innerWidth = width - margin.left - margin.right;
    const step = candles.length ? innerWidth / candles.length : innerWidth;
    const bodyWidth = Math.max(8, Math.min(30, step * 0.48));
    return { step, bodyWidth };
  }, [candles.length, margin.left, margin.right]);

  const yTicks = useMemo(() => {
    const ticksCount = 5;
    return Array.from({ length: ticksCount + 1 }, (_, index) => {
      const ratio = index / ticksCount;
      const value = maxValue - (maxValue - minValue) * ratio;
      return {
        value,
        y: yScale(value)
      };
    });
  }, [maxValue, minValue]);

  const xLabelStep = Math.max(1, Math.ceil(candles.length / 12));
  const activeCandle = activeIndex === null ? null : candles[activeIndex];

  return (
    <div className="chart-wrap">
      {activeCandle ? (
        <div className="chart-tooltip" role="status">
          <p>{activeCandle.label}</p>
          <span>Open: {formatMillionsRubles(activeCandle.open)}</span>
          <span>Close: {formatMillionsRubles(activeCandle.close)}</span>
          <span>High: {formatMillionsRubles(activeCandle.high)}</span>
          <span>Low: {formatMillionsRubles(activeCandle.low)}</span>
        </div>
      ) : null}

      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Годовой свечной график роста капитала">
        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line x1={margin.left} y1={tick.y} x2={width - margin.right} y2={tick.y} className="chart-grid-line" />
            <text x={margin.left - 10} y={tick.y + 4} className="chart-tick chart-tick-y">
              {millionFormatter.format(Math.max(0, tick.value) / 1_000_000)}
            </text>
          </g>
        ))}

        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          className="chart-axis"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          className="chart-axis"
        />

        {candles.map((candle, index) => {
          const xCenter = margin.left + xMetrics.step * index + xMetrics.step / 2;
          const openY = yScale(candle.open);
          const closeY = yScale(candle.close);
          const highY = yScale(candle.high);
          const lowY = yScale(candle.low);
          const bodyY = Math.min(openY, closeY);
          const bodyHeight = Math.max(2, Math.abs(closeY - openY));
          const isUp = candle.close >= candle.open;

          return (
            <g
              key={candle.label}
              className="candle"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <line x1={xCenter} y1={highY} x2={xCenter} y2={lowY} className={`candle-wick ${isUp ? 'up' : 'down'}`} />
              <rect
                x={xCenter - xMetrics.bodyWidth / 2}
                y={bodyY}
                width={xMetrics.bodyWidth}
                height={bodyHeight}
                rx="3"
                className={`candle-body ${isUp ? 'up' : 'down'} ${activeIndex === index ? 'active' : ''}`}
              />

              {(index % xLabelStep === 0 || index === candles.length - 1) && (
                <text x={xCenter} y={height - margin.bottom + 22} className="chart-tick chart-tick-x">
                  {index + 1}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="chart-labels">
        <span>Ось X: годы инвестирования</span>
        <span>Ось Y: капитал в млн ₽</span>
        <span>Наведите на свечу для деталей</span>
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(() => calculateInvestment(initialForm));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setResult(calculateInvestment(form));
  };

  return (
    <div className="page-shell">
      <div className="floating-hits" aria-hidden="true">
        <img src="/big-hit.svg" alt="" className="floating-hit hit-one" />
        <img src="/big-hit.svg" alt="" className="floating-hit hit-two" />
        <img src="/big-hit.svg" alt="" className="floating-hit hit-three" />
      </div>

      <main className="layout">
        <section className="hero glass-card">
          <p className="eyebrow">Инвестиционный калькулятор в рублях</p>
          <h1>Считаем капитал и переводим его в Биг Хиты</h1>
          <p className="intro-text">Показывает итог по годам: сколько занесли, сколько выросло и сколько это в Биг Хитах.</p>
          <img className="hero-hit" src="/big-hit.svg" alt="Иллюстрация Биг Хита" />
        </section>

        <section className="grid-layout">
          <form className="glass-card form-card" onSubmit={handleSubmit} noValidate>
            <label>
              Стартовая сумма, ₽
              <input
                name="initialAmount"
                type="number"
                min="0"
                step="1000"
                value={form.initialAmount}
                onChange={handleChange}
                inputMode="numeric"
              />
              {errors.initialAmount ? <span className="error-text">{errors.initialAmount}</span> : null}
            </label>

            <label>
              Ежемесячное пополнение, ₽
              <input
                name="monthlyContribution"
                type="number"
                min="0"
                step="1000"
                value={form.monthlyContribution}
                onChange={handleChange}
                inputMode="numeric"
              />
              {errors.monthlyContribution ? <span className="error-text">{errors.monthlyContribution}</span> : null}
            </label>

            <label>
              Годовая доходность, %
              <input
                name="annualRate"
                type="number"
                step="0.1"
                value={form.annualRate}
                onChange={handleChange}
                inputMode="decimal"
              />
              {errors.annualRate ? <span className="error-text">{errors.annualRate}</span> : null}
            </label>

            <label>
              Срок, лет
              <input
                name="years"
                type="number"
                min="1"
                max="60"
                step="1"
                value={form.years}
                onChange={handleChange}
                inputMode="numeric"
              />
              {errors.years ? <span className="error-text">{errors.years}</span> : null}
            </label>

            <button type="submit">Рассчитать</button>
          </form>

          <div className="results-stack">
            <section className="glass-card result-card decorative-card">
              <h2>Итоги по деньгам</h2>
              <ul>
                <li>
                  <span>Итоговая сумма</span>
                  <strong>{formatRubles(result.totalAmount)}</strong>
                </li>
                <li>
                  <span>Всего вложено</span>
                  <strong>{formatRubles(result.totalInvested)}</strong>
                </li>
                <li>
                  <span>Чистая прибыль</span>
                  <strong>{formatRubles(result.profit)}</strong>
                </li>
              </ul>
            </section>

            <section className="glass-card hits-card decorative-card">
              <h2>Сравнение в Биг Хитах</h2>
              <p>За весь срок вносите около <strong>{formatBigHits(result.totalInvestedBigHits)}</strong>.</p>
              <p>На финише выходит около <strong>{formatBigHits(result.totalAmountBigHits)}</strong>.</p>
              <p>Только чистый плюс это около <strong>{formatBigHits(result.profitBigHits)}</strong>.</p>
            </section>
          </div>
        </section>

        <section className="glass-card chart-card decorative-card">
          <div className="chart-head">
            <h2>Свечной график капитала по годам</h2>
            <p>{Math.ceil((result.history.length - 1) / 12)} лет расчета</p>
          </div>
          <Chart data={result.history} />
        </section>
      </main>
    </div>
  );
}
