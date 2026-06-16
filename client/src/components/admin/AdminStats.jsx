/*
  AdminStats komponentas.

  Rodo pagrindines admin dashboard korteles:
  - vartotojai;
  - miestai;
  - lankytinos vietos;
  - nemokamos vietos;
  - mokamos vietos;
  - vidutinis įvertinimas.

  Props:
  - stats
*/

const AdminStats = ({ stats }) => {
  const cards = [
    {
      label: "Vartotojai",
      value: stats?.users_count ?? 0,
    },
    {
      label: "Miestai",
      value: stats?.cities_count ?? 0,
    },
    {
      label: "Lankytinos vietos",
      value: stats?.places_count ?? 0,
    },
    {
      label: "Nemokamos vietos",
      value: stats?.free_places_count ?? 0,
    },
    {
      label: "Mokamos vietos",
      value: stats?.paid_places_count ?? 0,
    },
    {
      label: "Vidutinis įvertinimas",
      value: Number(stats?.average_rating ?? 0).toFixed(1),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200"
        >
          <p className="text-sm text-gray-500">{card.label}</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;