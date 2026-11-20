CREATE TABLE IF NOT EXISTS content
(
    id
    INTEGER
    PRIMARY
    KEY
    CHECK
(
    id =
    1
),
    json TEXT NOT NULL,
    updated_at TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS images
(
    id
    TEXT
    PRIMARY
    KEY,
    mime
    TEXT
    NOT
    NULL,
    data
    TEXT
    NOT
    NULL
);