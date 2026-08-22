-- Run once against STATIC_DB_* (dgmts_static_db) on the VPS.
-- About page President card + Department Heads carousel + /team/:id profiles.

CREATE TABLE IF NOT EXISTS about_leaders (
    id               SERIAL PRIMARY KEY,
    slug             TEXT UNIQUE,
    name             TEXT NOT NULL,
    role             TEXT NOT NULL,
    person_type      TEXT NOT NULL DEFAULT 'department_head'
                     CHECK (person_type IN ('president', 'department_head')),
    degree           TEXT,
    bio              TEXT,
    about            TEXT,
    image_url        TEXT NOT NULL,
    banner_url       TEXT,
    contact_address  TEXT,
    contact_phone    TEXT,
    contact_email    TEXT,
    contact_website  TEXT,
    sort_order       INTEGER NOT NULL DEFAULT 0,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_leaders_active_sort
    ON about_leaders (is_active, person_type, sort_order);
