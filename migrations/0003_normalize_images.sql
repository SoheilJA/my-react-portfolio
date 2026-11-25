ALTER TABLE images RENAME TO images_before_blob_migration;

CREATE TABLE images (
  id TEXT PRIMARY KEY,
  data BLOB NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (id, data, mime, size)
SELECT
  id,
  CAST(data AS BLOB),
  mime,
  CASE
    WHEN typeof(data) = 'text' AND substr(data, -2) = '==' THEN length(data) * 3 / 4 - 2
    WHEN typeof(data) = 'text' AND substr(data, -1) = '=' THEN length(data) * 3 / 4 - 1
    WHEN typeof(data) = 'text' THEN length(data) * 3 / 4
    ELSE length(data)
  END
FROM images_before_blob_migration;

DROP TABLE images_before_blob_migration;
