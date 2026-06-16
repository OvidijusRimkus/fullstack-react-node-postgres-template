/*
  Seed duomenys testavimui.

  SVARBU:
  users lentelėje slaptažodžiai turi būti bcrypt hash'ai.

  Kadangi SQL faile patogiai negeneruosim bcrypt hash'o,
  vėliau admin vartotoją galėsim susikurti per /api/auth/register,
  tada DB ranka pakeisti role į 'admin'.

  Todėl čia seedinam tik cities ir places.
*/

INSERT INTO cities (name)
VALUES
  ('Vilnius'),
  ('Kaunas'),
  ('Trakai'),
  ('Klaipėda')
ON CONFLICT (name) DO NOTHING;

INSERT INTO places (
  name,
  type,
  description,
  image_url,
  address,
  rating,
  is_free,
  city_id
)
VALUES
  (
    'Trakų pilis',
    'Pilis',
    'Istorinė pilis Galvės ežero saloje. Viena žinomiausių lankytinų vietų Lietuvoje.',
    'https://images.unsplash.com/photo-1560875984-4c9f66dfab35?auto=format&fit=crop&w=1200&q=80',
    'Karaimų g. 43C, Trakai',
    4.8,
    false,
    (SELECT id FROM cities WHERE name = 'Trakai')
  ),
  (
    'Gedimino pilies bokštas',
    'Istorinis objektas',
    'Vienas svarbiausių Vilniaus simbolių, nuo kurio atsiveria miesto panorama.',
    'https://images.unsplash.com/photo-1607350999170-b893fef057ea?auto=format&fit=crop&w=1200&q=80',
    'Arsenalo g. 5, Vilnius',
    4.7,
    false,
    (SELECT id FROM cities WHERE name = 'Vilnius')
  ),
  (
    'Bernardinų sodas',
    'Parkas',
    'Žalias parkas Vilniaus centre, tinkamas pasivaikščiojimams ir poilsiui.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'B. Radvilaitės g. 8A, Vilnius',
    4.6,
    true,
    (SELECT id FROM cities WHERE name = 'Vilnius')
  ),
  (
    'Kauno pilis',
    'Pilis',
    'Viena seniausių mūrinių pilių Lietuvoje, esanti Kauno senamiestyje.',
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    'Pilies g. 17, Kaunas',
    4.5,
    true,
    (SELECT id FROM cities WHERE name = 'Kaunas')
  ),
  (
    'Jūrų muziejus',
    'Muziejus',
    'Muziejus Smiltynėje, kuriame galima susipažinti su jūros gyvūnija ir Lietuvos jūrine istorija.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'Smiltynės g. 3, Klaipėda',
    4.7,
    false,
    (SELECT id FROM cities WHERE name = 'Klaipėda')
  );