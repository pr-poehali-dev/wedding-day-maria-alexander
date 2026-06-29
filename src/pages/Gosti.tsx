import { useEffect, useState } from 'react';

const GUESTS_URL = 'https://functions.poehali.dev/b9ae73d8-1cb4-4f90-bdf5-ac12f39cf7db';

interface Guest {
  id: number;
  name: string;
  count: number;
  drink: string;
  created_at: string;
}

const Gosti = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(GUESTS_URL)
      .then(r => r.json())
      .then(data => {
        setGuests(data.guests || []);
        setTotal(data.total || 0);
      })
      .catch(() => setError('Не удалось загрузить список'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Golos Text, sans-serif' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Свадьба 29.08.2026</p>
          <h1 className="text-4xl sm:text-5xl font-light mb-2" style={{ fontFamily: 'Cormorant, serif' }}>
            Список гостей
          </h1>
          {!loading && !error && (
            <p className="text-muted-foreground mt-3">
              Подтвердили присутствие: <span className="text-foreground font-medium">{guests.length}</span> заявок
              {' '}·{' '}
              Всего гостей: <span className="text-foreground font-medium">{total}</span>
            </p>
          )}
        </div>

        {loading && (
          <div className="text-center text-muted-foreground py-20">Загружаем список...</div>
        )}

        {error && (
          <div className="text-center text-destructive py-20">{error}</div>
        )}

        {!loading && !error && guests.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            Пока никто не подтвердил присутствие
          </div>
        )}

        {!loading && guests.length > 0 && (
          <div className="space-y-3">
            {guests.map((g, i) => (
              <div
                key={g.id}
                className="bg-white rounded-lg px-5 py-4 shadow-sm border border-border flex items-center gap-4"
              >
                <span className="text-2xl font-light text-primary w-8 shrink-0" style={{ fontFamily: 'Cormorant, serif' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{g.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{g.drink}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{g.count} чел.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{g.created_at}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gosti;
