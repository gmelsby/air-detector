DROP TABLE IF EXISTS Samples;

CREATE TABLE samples (
    dt TEXT PRIMARY KEY,
    pm_1 INTEGER,
    pm_2_5 INTEGER,
    pm_1_env INTEGER,
    pm_2_5_env INTEGER,
    particles_0_3 INTEGER,
    particles_0_5 INTEGER
);
