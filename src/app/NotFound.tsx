import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-8 text-slate-950">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-semibold">Маршрут не найден</h1>
        <p className="mt-4 text-slate-600">
          Вернитесь к выбору одной из трёх презентаций.
        </p>
        <nav
          className="mt-8 flex flex-wrap justify-center gap-3"
          aria-label="Sales-маршруты"
        >
          <Link className="route-link" to="/">
            Выбор презентации
          </Link>
          <Link className="route-link" to="/enterprise">
            Enterprise
          </Link>
          <Link className="route-link" to="/api">
            API
          </Link>
          <Link className="route-link" to="/small">
            Small Business
          </Link>
        </nav>
      </div>
    </main>
  );
}
