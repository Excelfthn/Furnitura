-- Create furniture catalog table
CREATE TABLE IF NOT EXISTS FURNITURE_CATALOG (
    ID VARCHAR(50) PRIMARY KEY,
    NAME VARCHAR(200) NOT NULL,
    CATEGORY VARCHAR(50) NOT NULL,
    THUMBNAIL_URL VARCHAR(500),
    DESCRIPTION VARCHAR(1000),
    SIZE_CATEGORY VARCHAR(20),
    WIDTH_CM NUMBER,
    HEIGHT_CM NUMBER,
    TAGS ARRAY,
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Insert sample furniture data
INSERT INTO FURNITURE_CATALOG (ID, NAME, CATEGORY, DESCRIPTION, SIZE_CATEGORY, WIDTH_CM, HEIGHT_CM, TAGS) VALUES
('sofa-001', 'Modern Beige Sectional', 'SOFA', 'Contemporary L-shaped sectional sofa in neutral beige', 'LARGE', 250, 90, ARRAY_CONSTRUCT('modern', 'sectional', 'beige')),
('sofa-002', 'Classic Leather Sofa', 'SOFA', 'Traditional brown leather 3-seater sofa', 'LARGE', 200, 85, ARRAY_CONSTRUCT('classic', 'leather', 'brown')),
('chair-001', 'Reading Armchair', 'CHAIR', 'Comfortable upholstered armchair perfect for reading', 'MEDIUM', 80, 90, ARRAY_CONSTRUCT('armchair', 'reading', 'comfort')),
('chair-002', 'Minimalist Dining Chair', 'CHAIR', 'Sleek wooden dining chair with clean lines', 'SMALL', 45, 85, ARRAY_CONSTRUCT('dining', 'minimalist', 'wood')),
('table-001', 'Coffee Table Oak', 'TABLE', 'Modern oak coffee table with storage', 'MEDIUM', 120, 45, ARRAY_CONSTRUCT('coffee', 'oak', 'storage')),
('table-002', 'Dining Table Round', 'TABLE', 'Round marble dining table for 4-6 people', 'LARGE', 140, 75, ARRAY_CONSTRUCT('dining', 'marble', 'round')),
('shelf-001', 'Wall Shelf Unit', 'STORAGE', 'Floating wall shelf with 4 tiers', 'MEDIUM', 100, 180, ARRAY_CONSTRUCT('wall', 'floating', 'shelf')),
('lamp-001', 'Floor Lamp Modern', 'LIGHTING', 'Contemporary arc floor lamp with adjustable arm', 'SMALL', 40, 180, ARRAY_CONSTRUCT('floor', 'modern', 'arc')),
('plant-001', 'Fiddle Leaf Fig', 'DECOR', 'Large potted fiddle leaf fig plant', 'MEDIUM', 50, 150, ARRAY_CONSTRUCT('plant', 'fiddle', 'green')),
('rug-001', 'Wool Area Rug', 'DECOR', 'Hand-woven wool area rug in geometric pattern', 'LARGE', 200, 300, ARRAY_CONSTRUCT('rug', 'wool', 'geometric'));

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_category ON FURNITURE_CATALOG(CATEGORY);
CREATE INDEX IF NOT EXISTS idx_name ON FURNITURE_CATALOG(NAME);

-- Verify data
SELECT * FROM FURNITURE_CATALOG ORDER BY CATEGORY, NAME;
